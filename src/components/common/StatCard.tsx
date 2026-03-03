import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  hint?: string;
}

export function StatCard({ title, value, hint }: StatCardProps) {
  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5e7ff",
    borderRadius: 12,
    padding: 16,
  };

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{value}</div>
      {hint ? <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>{hint}</div> : null}
    </div>
  );
}
