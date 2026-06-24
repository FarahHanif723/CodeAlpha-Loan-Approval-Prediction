import { useTheme } from "../context/ThemeContext";

// ── Card ──────────────────────────────────────────────
export function Card({ label, children }) {
  const { t } = useTheme();
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 14, padding: "1.5rem 1.75rem",
      marginBottom: "1.25rem",
      boxShadow: `0 2px 16px ${t.shadow}`,
    }}>
      <div style={{
        fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: t.muted,
        borderBottom: `1px solid ${t.border}`,
        paddingBottom: "0.6rem", marginBottom: "1.1rem",
      }}>{label}</div>
      {children}
    </div>
  );
}

// ── Grid ──────────────────────────────────────────────
export function Grid({ cols = 2, mt = false, children }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: "1rem",
      marginTop: mt ? "1rem" : 0,
    }}>
      {children}
    </div>
  );
}

// ── Field wrapper ─────────────────────────────────────
export function Field({ label, children }) {
  const { t } = useTheme();
  return (
    <div>
      <label style={{
        fontSize: "0.78rem", fontWeight: 500,
        color: t.muted, display: "block", marginBottom: 5,
      }}>{label}</label>
      {children}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────
export function Input({ value, onChange, ...rest }) {
  const { t } = useTheme();
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      {...rest}
      style={{
        width: "100%", padding: "9px 12px",
        background: t.bg, border: `1px solid ${t.border}`,
        borderRadius: 8, color: t.text, fontSize: "0.92rem",
        outline: "none", boxSizing: "border-box",
        transition: "border-color 0.2s",
      }}
      onFocus={e  => (e.target.style.borderColor = t.accent)}
      onBlur={e   => (e.target.style.borderColor = t.border)}
    />
  );
}

// ── Select ────────────────────────────────────────────
export function Select({ value, onChange, options, labels = {} }) {
  const { t } = useTheme();
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "9px 12px",
        background: t.bg, border: `1px solid ${t.border}`,
        borderRadius: 8, color: t.text, fontSize: "0.88rem",
        outline: "none", cursor: "pointer",
      }}
    >
      {options.map(o => (
        <option key={o} value={o}>{labels[o] || o}</option>
      ))}
    </select>
  );
}

// ── Toggle buttons (Yes/No) ───────────────────────────
export function YesNoToggle({ value, onChange }) {
  const { t } = useTheme();
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 2 }}>
      {["N", "Y"].map(opt => {
        const active = value === opt;
        const col    = opt === "N" ? "#0A7C59" : "#B91C1C";
        const bg     = opt === "N" ? "#ECFDF5" : "#FEF2F2";
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)} style={{
            flex: 1, padding: "9px 0", borderRadius: 8,
            border: `2px solid ${active ? col : t.border}`,
            background: active ? bg : t.bg,
            color: active ? col : t.muted,
            fontWeight: 600, cursor: "pointer",
            fontSize: "0.88rem", transition: "all 0.2s",
          }}>
            {opt === "N" ? "✅ No" : "❌ Yes"}
          </button>
        );
      })}
    </div>
  );
}

// ── Grade pill buttons ────────────────────────────────
export function GradePicker({ value, onChange, grades }) {
  const { t } = useTheme();
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
      {grades.map(g => {
        const active = value === g;
        return (
          <button key={g} type="button" onClick={() => onChange(g)} style={{
            flex: 1, padding: "8px 0", borderRadius: 7,
            border: `2px solid ${active ? t.accent : t.border}`,
            background: active ? t.accent : t.bg,
            color: active ? "#fff" : t.muted,
            fontWeight: 700, cursor: "pointer",
            fontSize: "0.8rem", transition: "all 0.2s",
          }}>{g}</button>
        );
      })}
    </div>
  );
}

// ── Submit button ─────────────────────────────────────
export function SubmitButton({ loading }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: "100%", padding: "0.9rem",
      background: "#1B4FD8", color: "#fff",
      border: "none", borderRadius: 12,
      fontSize: "1rem", fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      letterSpacing: "0.02em", transition: "opacity 0.2s",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      {loading ? <><Spinner /> Analyzing...</> : "🔍 Run Credit Assessment"}
    </button>
  );
}

// ── Spinner ───────────────────────────────────────────
export function Spinner() {
  return (
    <span style={{
      width: 16, height: 16,
      border: "2px solid rgba(255,255,255,0.3)",
      borderTop: "2px solid #fff",
      borderRadius: "50%", display: "inline-block",
      animation: "spin 0.7s linear infinite",
    }} />
  );
}
