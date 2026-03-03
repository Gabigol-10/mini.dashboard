import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "success" | "warn" | "danger" | "neutral";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const bg =
    tone === "success"
      ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
      : tone === "warn"
        ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
        : tone === "danger"
          ? "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
          : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)";
  const fg =
    tone === "success"
      ? "#065f46"
      : tone === "warn"
        ? "#92400e"
        : tone === "danger"
          ? "#991b1b"
          : "#3730a3";
  const dotBg =
    tone === "success"
      ? "#10b981"
      : tone === "warn"
        ? "#f59e0b"
        : tone === "danger"
          ? "#ef4444"
          : "#6366f1";

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 11,
        fontWeight: 700,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: dotBg,
          display: "inline-block",
          boxShadow: `0 0 0 2px ${bg}`,
        }}
      />
      {children}
    </span>
  );
}
