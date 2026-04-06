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
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    borderBottom: "1px solid #00d4ff",
    boxShadow: "0 0 20px rgba(0, 212, 255, 0.3), 0 4px 15px rgba(0, 0, 0, 0.5)",
    position: "relative",
  };

  const smallInputStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 8,
    border: "2px solid #00d4ff",
    fontSize: 13,
    outline: "none",
    transition: "all 0.3s ease",
    background: "rgba(0, 0, 0, 0.7)",
    color: "#00d4ff",
    boxShadow: "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(10px)",
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: "grid", gap: 6 }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#00d4ff",
            textShadow: "0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff",
            filter: "drop-shadow(0 0 5px rgba(0, 212, 255, 0.8))",
          }}
        >
          🛡️ Mini Dashboard
        </div>
        <div style={{ 
          fontSize: 12, 
          color: "#7dd3fc", 
          fontWeight: 500,
          textShadow: "0 0 5px rgba(125, 211, 252, 0.5)",
        }}>
          Arquitectura profesional escalable
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {token ? (
          <>
            <span
              style={{
                fontSize: 13,
                color: "#00d4ff",
                fontWeight: 600,
                padding: "10px 18px",
                background: "rgba(0, 0, 0, 0.7)",
                borderRadius: 8,
                border: "2px solid #00d4ff",
                boxShadow: "0 0 15px rgba(0, 212, 255, 0.4), inset 0 0 15px rgba(0, 212, 255, 0.1)",
                backdropFilter: "blur(10px)",
                textShadow: "0 0 5px #00d4ff",
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
            style={{ 
              display: "flex", 
              gap: 12, 
              alignItems: "center",
              padding: "16px 20px",
              background: "rgba(0, 0, 0, 0.8)",
              borderRadius: 12,
              border: "2px solid #00d4ff",
              boxShadow: "0 0 25px rgba(0, 212, 255, 0.4), inset 0 0 25px rgba(0, 212, 255, 0.1)",
              backdropFilter: "blur(15px)",
            }}
          >
            <input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="👤 Email or Username"
              style={smallInputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#00ffff";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.6), inset 0 0 15px rgba(0, 255, 255, 0.2)";
                e.currentTarget.style.color = "#00ffff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#00d4ff";
                e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)";
                e.currentTarget.style.color = "#00d4ff";
              }}
            />
            <input
              value={pass}
              onChange={(e) => onPassChange(e.target.value)}
              placeholder="🔑 Password"
              type="password"
              style={smallInputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#00ffff";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.6), inset 0 0 15px rgba(0, 255, 255, 0.2)";
                e.currentTarget.style.color = "#00ffff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#00d4ff";
                e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)";
                e.currentTarget.style.color = "#00d4ff";
              }}
            />
            <Button type="submit">🔐 Sign in</Button>
          </form>
        )}
      </div>
    </header>
  );
}
