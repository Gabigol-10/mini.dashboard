import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  tone?: "success" | "warn" | "danger" | "neutral";
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const bg =
    tone === "success"
      ? "#e7f7ee"
      : tone === "warn"
        ? "#fff3e0"
        : tone === "danger"
          ? "#ffe7e7"
          : "#eef2ff";
  const fg =
    tone === "success"
      ? "#127a43"
      : tone === "warn"
        ? "#a05a00"
        : tone === "danger"
          ? "#a11a1a"
          : "#233876";
  return (
    <span
      style={{
        padding: "3px 8px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: fg,
          display: "inline-block",
        }}
      />
      {children}
    </span>
  );
}
