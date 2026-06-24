import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Navbar        from "./components/Navbar";
import ApplicantForm from "./components/ApplicantForm";
import LoanForm      from "./components/LoanForm";
import ResultCard    from "./components/ResultCard";
import { SubmitButton } from "./components/UI";

const API = "http://localhost:8000";

const INITIAL_FORM = {
  age: "30", income: "50000", home: "RENT", emp_len: "3",
  intent: "PERSONAL", grade: "A", loan_amnt: "10000",
  int_rate: "12", default_hist: "N", cred_hist: "5",
};

function CreditApp() {
  const { t } = useTheme();
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setResult(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age:          parseInt(form.age),
          income:       parseFloat(form.income),
          home:         form.home,
          emp_len:      parseFloat(form.emp_len),
          intent:       form.intent,
          grade:        form.grade,
          loan_amnt:    parseFloat(form.loan_amnt),
          int_rate:     parseFloat(form.int_rate),
          default_hist: form.default_hist,
          cred_hist:    parseInt(form.cred_hist),
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch {
      setError("⚠️ Could not connect to API. Make sure backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',sans-serif", transition: "all 0.3s" }}>
      <Navbar />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", margin: "1.5rem 0 2.5rem" }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(1.8rem,4vw,2.5rem)", margin: "0 0 0.5rem", color: t.text }}>
            Credit Risk Assessment
          </h1>
          <p style={{ color: t.muted, fontSize: "0.9rem", margin: 0 }}>
            Instant loan decisions powered by Machine Learning
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <ApplicantForm form={form} onChange={handleChange} />
          <LoanForm      form={form} onChange={handleChange} />
          <SubmitButton loading={loading} />
        </form>

        {/* Error */}
        {error && (
          <div style={{ marginTop: "1rem", background: "#FEF2F2", border: "1px solid #F87171", borderRadius: 10, padding: "12px 16px", color: "#B91C1C", fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        {/* Result */}
        {result && <ResultCard result={result} />}

        <p style={{ textAlign: "center", color: t.muted, fontSize: "0.72rem", marginTop: "3rem" }}>
          LoanIQ · For demonstration & educational purposes only
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CreditApp />
    </ThemeProvider>
  );
}
