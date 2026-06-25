import { Card, Grid, Field, Input, Select, YesNoToggle } from "./UI";

const HOME_OPTIONS  = ["RENT", "OWN", "MORTGAGE", "OTHER"];

export default function ApplicantForm({ form, onChange }) {
  const set = (key, val) => onChange(key, val);

  const bounded = (max, key) => v => {
    if (v === "" || v === "-") return set(key, v);   // allow clearing
    if (parseFloat(v) <= max) set(key, v);
  };

  return (
    <Card label="👤 Applicant Profile">
      <Grid cols={3}>
        <Field label="Age">
          <Input type="number" value={form.age} onChange={bounded(100, "age")} min={18} max={100} />
        </Field>
        <Field label="Annual Income ($)">
          <Input type="number" value={form.income} onChange={bounded(6000000, "income")} min={4000} max={6000000} />
        </Field>
        <Field label="Employment Length (yrs)">
          <Input type="number" value={form.emp_len} onChange={bounded(50, "emp_len")} min={0} max={50} step="0.5" />
        </Field>
      </Grid>

      <Grid cols={2} mt>
        <Field label="Home Ownership">
          <Select value={form.home} onChange={v => set("home", v)} options={HOME_OPTIONS} />
        </Field>
        <Field label="Previous Default?">
          <YesNoToggle value={form.default_hist} onChange={v => set("default_hist", v)} />
        </Field>
      </Grid>
    </Card>
  );
}
