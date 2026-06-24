import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { t, dark, setDark } = useTheme();

  return (
    <nav style={{
      background: t.surface,
      borderBottom: `1px solid ${t.border}`,
      padding: "0 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: `0 1px 12px ${t.shadow}`,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: t.accent, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>🏦</div>
        <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.2rem", color: t.text }}>
          LoanIQ
        </span>
        <span style={{
          fontSize: "0.68rem", color: t.accent,
          background: t.accentBg, padding: "2px 8px",
          borderRadius: 99, fontWeight: 600,
        }}>Credit Risk</span>
      </div>

      {/* Dark toggle */}
      <button onClick={() => setDark(d => !d)} style={{
        background: t.accentBg, border: `1px solid ${t.border}`,
        borderRadius: 8, padding: "6px 14px", color: t.text,
        cursor: "pointer", fontSize: "0.82rem",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        {dark ? "☀️ Light" : "🌙 Dark"}
      </button>
    </nav>
  );
}
