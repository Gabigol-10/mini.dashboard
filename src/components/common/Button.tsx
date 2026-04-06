import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function Button({
  children,
  variant = "primary",
  disabled,
  onClick,
  type = "button",
}: ButtonProps) {
  const base: React.CSSProperties = {
    padding: "10px 18px",
    borderRadius: 10,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
    fontSize: 13,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const map: Record<string, React.CSSProperties> = {
    primary: {
      background: disabled
        ? "rgba(0, 212, 255, 0.3)"
        : "linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)",
      color: disabled ? "#7dd3fc" : "#000",
      border: "2px solid #00d4ff",
      boxShadow: disabled
        ? "0 0 5px rgba(0, 212, 255, 0.2)"
        : "0 0 20px rgba(0, 212, 255, 0.6), inset 0 0 20px rgba(0, 212, 255, 0.1)",
      textShadow: disabled ? "none" : "0 0 5px rgba(0, 0, 0, 0.5)",
      fontWeight: 700,
    },
    ghost: {
      background: "rgba(0, 0, 0, 0.7)",
      color: "#00d4ff",
      border: "2px solid #00d4ff",
      boxShadow: "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)",
      backdropFilter: "blur(10px)",
      textShadow: "0 0 5px #00d4ff",
    },
    danger: {
      background: disabled
        ? "rgba(255, 59, 59, 0.3)"
        : "linear-gradient(135deg, #ff3b3b 0%, #dc2626 100%)",
      color: disabled ? "#fca5a5" : "#fff",
      border: "2px solid #ff3b3b",
      boxShadow: disabled
        ? "0 0 5px rgba(255, 59, 59, 0.2)"
        : "0 0 20px rgba(255, 59, 59, 0.6), inset 0 0 20px rgba(255, 59, 59, 0.1)",
      textShadow: disabled ? "none" : "0 0 5px rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...(map[variant] || map.primary) }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(-2px)";
          if (variant === "primary") {
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(0, 212, 255, 0.8), inset 0 0 30px rgba(0, 212, 255, 0.2)";
          } else if (variant === "danger") {
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(255, 59, 59, 0.8), inset 0 0 30px rgba(255, 59, 59, 0.2)";
          } else {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.9)";
            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 212, 255, 0.5), inset 0 0 15px rgba(0, 212, 255, 0.2)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0)";
          if (variant === "primary") {
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(0, 212, 255, 0.6), inset 0 0 20px rgba(0, 212, 255, 0.1)";
          } else if (variant === "danger") {
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(255, 59, 59, 0.6), inset 0 0 20px rgba(255, 59, 59, 0.1)";
          } else {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.7)";
            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)";
          }
        }
      }}
    >
      {children}
    </button>
  );
}
