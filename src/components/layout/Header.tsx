import React from "react";
import { Button } from "../common/Button";

interface Props {
  token: string;
  userName?: string;
  loading: boolean;

  email: string;
  pass: string;
  loginError?: string | null;

  onEmailChange: (value: string) => void;
  onPassChange: (value: string) => void;

  onLogin: () => void;
  onLogout: () => void;
  onReload: () => void;
}

export function Header({
  token,
  userName,
  loading,
  email,
  pass,
  loginError,
  onEmailChange,
  onPassChange,
  onLogin,
  onLogout,
  onReload,
}: Props) {
  return (
    <header style={styles.header}>
      <div style={styles.title}>
        <div style={styles.titleText}>Mini Dashboard</div>
        <div style={styles.subtitle}>Arquitectura profesional escalable</div>
      </div>

      {!token ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
            style={styles.loginForm}
          >
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => onPassChange(e.target.value)}
              style={styles.input}
            />
            <Button type="submit">🔐 Login</Button>
          </form>
          {loginError && (
            <div style={styles.loginError}>
              ⚠️ {loginError}
            </div>
          )}
        </div>
      ) : (
        <div style={styles.userArea}>
          <span style={styles.userName}>
            👤 {loading ? "Cargando..." : userName || "Usuario"}
          </span>
          <Button onClick={onReload} disabled={loading}>
            {loading ? "⏳" : "🔄"} Recargar
          </Button>
          <Button onClick={onLogout}>🚪 Logout</Button>
        </div>
      )}
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    padding: "20px 32px",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
    borderBottom: "1px solid #e0e7ff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(59, 91, 255, 0.08)",
  },
  title: {
    display: "grid",
    gap: 4,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 900,
    background: "linear-gradient(135deg, #3b5bff 0%, #5b7bff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: 500,
  },
  loginForm: {
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  input: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "2px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s ease",
    color: "#1f2937",
    caretColor: "#3b5bff",
    background: "#ffffff",
  },
  loginError: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "8px 12px",
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 600,
    textAlign: "center",
  },
  userArea: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  userName: {
    fontSize: 13,
    color: "#374151",
    fontWeight: 600,
    padding: "8px 16px",
    background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
    borderRadius: 8,
    border: "1px solid #c7d2fe",
  },
};
