import { useTheme } from "../context/ThemeContext";
import { Card, Grid, Field, Input, Select, GradePicker } from "./UI";

const GRADES = ["A", "B", "C", "D", "E", "F", "G"];
const INTENT_OPTIONS = ["PERSONAL","EDUCATION","MEDICAL","VENTURE","HOMEIMPROVEMENT","DEBTCONSOLIDATION"];
const INTENT_LABELS  = {
  PERSONAL: "Personal", EDUCATION: "Education", MEDICAL: "Medical",
  VENTURE: "Venture", HOMEIMPROVEMENT: "Home Improvement", DEBTCONSOLIDATION: "Debt Consolidation",
};

export default function LoanForm({ form, onChange }) {
  const { t } = useTheme();
  const set = (key, val) => onChange(key, val);

  const income   = parseFloat(form.income)    || 1;
  const loanAmnt = parseFloat(form.loan_amnt) || 0;
  const pct      = ((loanAmnt / income) * 100).toFixed(1);
  const isHigh   = parseFloat(pct) > 50;

  return (
    <Card label="💼 Loan Details">
      <Grid cols={3}>
        <Field label="Loan Amount ($)">
          <Input type="number" value={form.loan_amnt} onChange={v => set("loan_amnt", v)} min={500} max={100000} />
        </Field>
        <Field label="Interest Rate (%)">
          <Input type="number" value={form.int_rate} onChange={v => set("int_rate", v)} min={1} max={40} step="0.1" />
        </Field>
        <Field label="Credit History (yrs)">
          <Input type="number" value={form.cred_hist} onChange={v => set("cred_hist", v)} min={0} max={50} />
        </Field>
      </Grid>

      <Grid cols={2} mt>
        <Field label="Loan Purpose">
          <Select value={form.intent} onChange={v => set("intent", v)} options={INTENT_OPTIONS} labels={INTENT_LABELS} />
        </Field>
        <Field label="Loan Grade">
          <GradePicker value={form.grade} onChange={v => set("grade", v)} grades={GRADES} />
        </Field>
      </Grid>

      {/* Auto-calc badge */}
      <div style={{
        marginTop: "1rem",
        background: isHigh ? "#FEF2F2" : t.accentBg,
        border: `1px solid ${isHigh ? "#F87171" : t.accent}`,
        borderRadius: 10, padding: "10px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: "0.68rem", color: t.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
             Auto-Calculated
          </div>
          <div style={{ fontSize: "0.85rem", color: t.text, marginTop: 2 }}>Loan % of Income</div>
        </div>
        <div style={{ fontSize: "1.6rem", fontWeight: 700, color: isHigh ? "#B91C1C" : t.accent }}>
          {pct}%
        </div>
      </div>
    </Card>
  );
}
