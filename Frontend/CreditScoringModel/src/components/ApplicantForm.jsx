import { Card, Grid, Field, Input, Select, YesNoToggle } from "./UI";

const HOME_OPTIONS  = ["RENT", "OWN", "MORTGAGE", "OTHER"];

export default function ApplicantForm({ form, onChange }) {
  const set = (key, val) => onChange(key, val);

  return (
    <Card label="👤 Applicant Profile">
      <Grid cols={3}>
        <Field label="Age">
          <Input type="number" value={form.age} onChange={v => set("age", v)} min={18} max={100} />
        </Field>
        <Field label="Annual Income ($)">
          <Input type="number" value={form.income} onChange={v => set("income", v)} min={1000} />
        </Field>
        <Field label="Employment Length (yrs)">
          <Input type="number" value={form.emp_len} onChange={v => set("emp_len", v)} min={0} max={50} step="0.5" />
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
