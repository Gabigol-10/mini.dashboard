import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  hint?: string;
}

export function StatCard({ title, value, hint }: StatCardProps) {
  const cardStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
    border: "1px solid #e0e4ff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 2px 8px rgba(59, 91, 255, 0.08)",
    transition: "all 0.3s ease",
    cursor: "default",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(59, 91, 255, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(59, 91, 255, 0.08)";
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          color: "#6b7280",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          background: "linear-gradient(135deg, #3b5bff 0%, #5b7bff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      {hint ? (
        <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
