from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import joblib

app = FastAPI(title="LoanIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model  = joblib.load("credit_scoring_model.pkl")
scaler = joblib.load("scaler.pkl")

# ── Exact same encoding as notebook ──
HOME_MAP    = {"RENT": 0, "OWN": 1, "MORTGAGE": 2, "OTHER": 3}
INTENT_MAP  = {"PERSONAL": 0, "EDUCATION": 1, "MEDICAL": 2, "VENTURE": 3, "HOMEIMPROVEMENT": 4, "DEBTCONSOLIDATION": 5}
GRADE_MAP   = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6}
DEFAULT_MAP = {"Y": 1, "N": 0}

# ── IQR clip bounds from notebook training data ──
CLIP_BOUNDS = {
    "person_age":                 (4.0,   76.0),
    "person_income":              (4000,  210000),
    "person_emp_length":          (0.0,   20.0),
    "loan_amnt":                  (500,   28000),
    "loan_int_rate":              (5.42,  23.22),
    "loan_percent_income":        (0.0,   0.66),
    "cb_person_cred_hist_length": (0.0,   20.0),
}

def clip(val, col):
    lo, hi = CLIP_BOUNDS[col]
    return max(lo, min(hi, val))

class LoanRequest(BaseModel):
    age:          int
    income:       float
    home:         str      # RENT/OWN/MORTGAGE/OTHER
    emp_len:      float
    intent:       str      # PERSONAL/EDUCATION/...
    grade:        str      # A-G
    loan_amnt:    float
    int_rate:     float
    default_hist: str      # Y/N
    cred_hist:    int

@app.post("/predict")
def predict(req: LoanRequest):
    # Apply same IQR clipping as notebook
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

    features = np.array([[
        age,
        income,
        HOME_MAP[req.home],
        emp_len,
        INTENT_MAP[req.intent],
        GRADE_MAP[req.grade],
        loan_amnt,
        int_rate,
        pct_income,
        DEFAULT_MAP[req.default_hist],
        cred_hist,
        loan_to_income,
        income_per_age,
    ]])

    scaled       = scaler.transform(features)
    prob         = model.predict_proba(scaled)[0]
    default_risk = float(prob[1])
    approved     = default_risk < 0.35

    # Risk tier
    if default_risk < 0.15:   tier = "Low Risk"
    elif default_risk < 0.35: tier = "Moderate Risk"
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
