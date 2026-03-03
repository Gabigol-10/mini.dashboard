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
    padding: "16px 24px",
    borderBottom: "1px solid #e5e7ff",
    background: "#fff",
  };

  const smallInputStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d9d9e3",
    fontSize: 13,
    outline: "none",
  };

  return (
    <header style={headerStyle}>
      <div style={{ display: "grid", gap: 4 }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>Mini Dashboard</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Archivo intencionalmente mal estructurado para refactor.
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {token ? (
          <>
            <span style={{ fontSize: 13, opacity: 0.8 }}>
              Sesión: <b>{userName || "..."}</b>
            </span>
            <Button variant="ghost" onClick={onReload} disabled={loading}>
              Recargar
            </Button>
            <Button variant="danger" onClick={onLogout}>
              Logout
            </Button>
          </>
        ) : (
          <form
            onSubmit={onLogin}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="email"
              style={smallInputStyle}
            />
            <input
              value={pass}
              onChange={(e) => onPassChange(e.target.value)}
              placeholder="password"
              type="password"
              style={smallInputStyle}
            />
            <Button type="submit">Login</Button>
          </form>
        )}
      </div>
    </header>
  );
}
