import React from "react";
import { Button } from "../common/Button";

interface HeaderProps {
  token: string;
  userName: string | undefined;
  loading: boolean;
  email: string;
  pass: string;
  onEmailChange: (value: string) => void;
  onPassChange: (value: string) => void;
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
  onReload: () => void;
}

export function Header({
  token,
  userName,
  loading,
  email,
  pass,
  onEmailChange,
  onPassChange,
  onLogin,
  onLogout,
  onReload,
}: HeaderProps) {
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 32px",
    borderBottom: "1px solid #e0e7ff",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
    boxShadow: "0 2px 8px rgba(59, 91, 255, 0.08)",
  };

  const smallInputStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 8,
    border: "2px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s ease",
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: "grid", gap: 6 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            background: "linear-gradient(135deg, #3b5bff 0%, #5b7bff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Mini Dashboard
        </div>
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
          Arquitectura profesional escalable
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {token ? (
          <>
            <span
              style={{
                fontSize: 13,
                color: "#374151",
                fontWeight: 600,
                padding: "8px 16px",
                background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
                borderRadius: 8,
                border: "1px solid #c7d2fe",
              }}
            >
              👤 <b>{userName || "..."}</b>
            </span>
            <Button variant="ghost" onClick={onReload} disabled={loading}>
              {loading ? "⏳ Cargando..." : "🔄 Recargar"}
            </Button>
            <Button variant="danger" onClick={onLogout}>
              🚪 Logout
            </Button>
          </>
        ) : (
          <form
            onSubmit={onLogin}
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="email"
              style={smallInputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b5bff";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59, 91, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <input
              value={pass}
              onChange={(e) => onPassChange(e.target.value)}
              placeholder="password"
              type="password"
              style={smallInputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b5bff";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59, 91, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <Button type="submit">🔐 Login</Button>
          </form>
        )}
      </div>
    </header>
  );
}
