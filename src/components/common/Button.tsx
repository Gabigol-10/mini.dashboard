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
        ? "linear-gradient(135deg, #9aa6ff 0%, #8090ff 100%)"
        : "linear-gradient(135deg, #3b5bff 0%, #5b7bff 100%)",
      color: "#fff",
      boxShadow: disabled
        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
        : "0 4px 12px rgba(59, 91, 255, 0.3)",
    },
    ghost: {
      background: "transparent",
      color: "#3b5bff",
      border: "2px solid #e0e7ff",
      boxShadow: "none",
    },
    danger: {
      background: disabled
        ? "linear-gradient(135deg, #ffb3b3 0%, #ff9999 100%)"
        : "linear-gradient(135deg, #ff3b3b 0%, #ff5b5b 100%)",
      color: "#fff",
      boxShadow: disabled
        ? "0 2px 4px rgba(0, 0, 0, 0.1)"
        : "0 4px 12px rgba(255, 59, 59, 0.3)",
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
              "0 6px 16px rgba(59, 91, 255, 0.4)";
          } else if (variant === "danger") {
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(255, 59, 59, 0.4)";
          } else {
            e.currentTarget.style.background = "#f0f4ff";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = "translateY(0)";
          if (variant === "primary") {
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(59, 91, 255, 0.3)";
          } else if (variant === "danger") {
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(255, 59, 59, 0.3)";
          } else {
            e.currentTarget.style.background = "transparent";
          }
        }
      }}
    >
      {children}
    </button>
  );
}
