from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="LoanIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model  = joblib.load("Model/credit_scoring_model.pkl")
scaler = joblib.load("Model/scaler.pkl")

# ── Exact same encoding as notebook ──
HOME_MAP    = {"RENT": 0, "OWN": 1, "MORTGAGE": 2, "OTHER": 3}
INTENT_MAP  = {"PERSONAL": 0, "EDUCATION": 1, "MEDICAL": 2, "VENTURE": 3, "HOMEIMPROVEMENT": 4, "DEBTCONSOLIDATION": 5}
GRADE_MAP   = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6}
DEFAULT_MAP = {"Y": 1, "N": 0}

# ── IQR clip bounds from notebook ──
CLIP_BOUNDS = {
    "person_age":                 (4.0,   76.0),
    "person_income":              (4000,  6000000),
    "person_emp_length":          (0.0,   20.0),
    "loan_amnt":                  (500,   35000),
    "loan_int_rate":              (5.42,  23.22),
    "loan_percent_income":        (0.0,   0.66),
    "cb_person_cred_hist_length": (0.0,   20.0),
}

# ── Same column order as X_imputed in notebook ──
FEATURE_COLS = [
    "person_age", "person_income", "person_home_ownership", "person_emp_length",
    "loan_intent", "loan_grade", "loan_amnt", "loan_int_rate",
    "loan_percent_income", "cb_person_default_on_file", "cb_person_cred_hist_length",
    "loan_to_income", "income_per_age"
]

def clip(val, col):
    lo, hi = CLIP_BOUNDS[col]
    return max(lo, min(hi, val))

class LoanRequest(BaseModel):
    age:          int
    income:       float
    home:         str
    emp_len:      float
    intent:       str
    grade:        str
    loan_amnt:    float
    int_rate:     float
    default_hist: str
    cred_hist:    int

@app.post("/predict")
def predict(req: LoanRequest):
    # ── Hard business rules BEFORE model ──
    raw_pct = req.loan_amnt / req.income if req.income > 0 else 999
    reasons = []
    if raw_pct > 0.66:        reasons.append(f"Loan amount is {raw_pct*100:.0f}% of income (max 66%)")
    if req.income < 4000:     reasons.append("Income too low (minimum $4,000)")
    if req.default_hist == "Y" and raw_pct > 0.4: reasons.append("Previous default with high loan ratio")
    if GRADE_MAP[req.grade] >= 5 and raw_pct > 0.3: reasons.append("Poor loan grade with high loan ratio")

    if reasons:
        return {
            "approved":     False,
            "default_risk": 95.0,
            "safe_score":   5.0,
            "tier":         "Very High Risk",
            "pct_income":   round(raw_pct * 100, 1),
            "reason":       " | ".join(reasons),
        }

    age       = clip(req.age,       "person_age")
    income    = clip(req.income,    "person_income")
    emp_len   = clip(req.emp_len,   "person_emp_length")
    loan_amnt = clip(req.loan_amnt, "loan_amnt")
    int_rate  = clip(req.int_rate,  "loan_int_rate")
    cred_hist = clip(req.cred_hist, "cb_person_cred_hist_length")

    pct_income     = loan_amnt / income if income > 0 else 0.0
    pct_income     = clip(pct_income, "loan_percent_income")
    loan_to_income = loan_amnt / (income + 1)
    income_per_age = income / (age + 1)

    # ── Use DataFrame to match scaler's feature names (avoids sklearn warning) ──
    features = pd.DataFrame([[
        age, income, HOME_MAP[req.home], emp_len,
        INTENT_MAP[req.intent], GRADE_MAP[req.grade], loan_amnt,
        int_rate, pct_income, DEFAULT_MAP[req.default_hist], cred_hist,
        loan_to_income, income_per_age,
    ]], columns=FEATURE_COLS)

    scaled       = scaler.transform(features)
    prob         = model.predict_proba(scaled)[0]
    default_risk = float(prob[1])
    approved     = default_risk < 0.40

    if default_risk < 0.15:   tier = "Low Risk"
    elif default_risk < 0.40: tier = "Moderate Risk"
    elif default_risk < 0.60: tier = "High Risk"
    else:                      tier = "Very High Risk"

    return {
        "approved":     approved,
        "default_risk": round(default_risk * 100, 1),
        "safe_score":   round((1 - default_risk) * 100, 1),
        "tier":         tier,
        "pct_income":   round(pct_income * 100, 1),
    }

@app.get("/health")
def health():
    return {"status": "ok"}

# ── Serve React build (frontend) ──
if os.path.exists("dist"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

    @app.get("/")
    def serve_root():
        return FileResponse("dist/index.html")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        return FileResponse("dist/index.html")
