const TIER_COLOR = {
  "Low Risk":       "#0A7C59",
  "Moderate Risk":  "#D97706",
  "High Risk":      "#EA580C",
  "Very High Risk": "#B91C1C",
};

export default function ResultCard({ result }) {
  const { approved, default_risk, safe_score, tier, pct_income } = result;

  const color  = approved ? "#0A7C59" : "#B91C1C";
  const bgCol  = approved ? "#ECFDF5" : "#FEF2F2";
  const border = approved ? "#34D399" : "#F87171";

  return (
    <div style={{
      marginTop: "1.5rem",
      background: bgCol,
      border: `2px solid ${border}`,
      borderRadius: 16, padding: "2rem",
      textAlign: "center",
      animation: "fadeIn 0.4s ease",
    }}>
      <div style={{ fontSize: "3rem" }}>{approved ? "✅" : "❌"}</div>

      <h2 style={{
        fontFamily: "'DM Serif Display',serif",
        fontSize: "1.8rem", color,
        margin: "0.5rem 0 0.25rem",
      }}>
        {approved ? "Loan Approved" : "Loan Rejected"}
      </h2>

      <p style={{ color: TIER_COLOR[tier] || "#6B7A99", fontWeight: 600, fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
        {tier}
      </p>

      {/* Metric pills */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <MetricPill label="Default Risk"  value={`${default_risk}%`} color={color}       />
        <MetricPill label="Safety Score"  value={`${safe_score}%`}   color="#1B4FD8"     />
        <MetricPill label="Loan / Income" value={`${pct_income}%`}   color={pct_income > 50 ? "#B91C1C" : "#0A7C59"} />
      </div>

      {/* Risk bar */}
      <RiskBar defaultRisk={default_risk} color={color} approved={approved} />
    </div>
  );
}

function MetricPill({ label, value, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.7)", borderRadius: 10,
      padding: "10px 20px", minWidth: 110,
    }}>
      <div style={{ fontSize: "0.68rem", color: "#6B7A99", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.4rem", fontWeight: 700, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function RiskBar({ defaultRisk, color, approved }) {
  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#6B7A99", marginBottom: 4 }}>
        <span>0%</span><span>▲ 35% threshold</span><span>100%</span>
      </div>
      <div style={{ background: "#E2E6F0", borderRadius: 99, height: 10, overflow: "hidden", position: "relative" }}>
        {/* Threshold marker */}
        <div style={{ position: "absolute", left: "35%", top: 0, bottom: 0, width: 2, background: "#1B4FD8", zIndex: 2 }} />
        <div style={{
          width: `${Math.min(defaultRisk, 100)}%`,
          height: "100%", background: color,
          borderRadius: 99, transition: "width 0.6s ease",
        }} />
      </div>
      <p style={{ fontSize: "0.78rem", color: "#6B7A99", marginTop: 8 }}>
        {approved
          ? `✓ Risk (${defaultRisk}%) is below the 35% threshold`
          : `✗ Risk (${defaultRisk}%) exceeds the 35% threshold`}
      </p>
    </div>
  );
}
