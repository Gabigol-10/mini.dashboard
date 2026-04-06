import React, { useMemo, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { useCreateProject } from "../hooks/useCreateProject";
import { useToggleProject } from "../hooks/useToggleProject";
import { useForm } from "../hooks/useForm";
import { money } from "../utils/formatters";
import {
  validateProjectName,
  validateOwner,
  validateBudget,
} from "../utils/validators";
import { Header } from "../components/layout/Header";
import { StatCard } from "../components/common/StatCard";
import { Button } from "../components/common/Button";
import { ProjectForm } from "../components/projects/ProjectForm";
import { ProjectList } from "../components/projects/ProjectList";
import { ProjectDetail } from "../components/projects/ProjectDetail";
import type { Project } from "../services/dashboardService";

interface ProjectFormValues extends Record<string, unknown> {
  name: string;
  owner: string;
  budget: string;
  status: "active" | "paused";
}

interface LoginFormValues extends Record<string, unknown> {
  email: string;
  password: string;
}

interface DashboardPageProps {
  onLoginStateChange: (isLoggedIn: boolean) => void;
}

export function DashboardPage({ onLoginStateChange }: DashboardPageProps) {
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const { data, loading, error: err, reload } = useDashboard(token);
  const { create, saving, error: formErr } = useCreateProject(token);
  const { toggle } = useToggleProject(token);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    initialValues: {
      email: "admin@demo.com",
      password: "123456",
    },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginFormValues, string>> = {};
      if (!values.email.includes("@")) {
        errors.email = "Email inválido";
      }
      if (values.password.length < 3) {
        errors.password = "Password muy corto";
      }
      return errors;
    },
    onSubmit: (values) => {
      // Validar credenciales correctas
      if (values.email === "admin@demo.com" && values.password === "123456") {
        setToken("demo-token");
        setLoginError(null);
      } else {
        setLoginError("Credenciales incorrectas. Verifica tu email y contraseña.");
        setToken("");
      }
    },
  });

  const projectForm = useForm<ProjectFormValues>({
    initialValues: {
      name: "",
      owner: "",
      budget: "0",
      status: "active",
    },
    validate: (values) => {
      const errors: Partial<Record<keyof ProjectFormValues, string>> = {};
      const nameErr = validateProjectName(values.name);
      const ownerErr = validateOwner(values.owner);
      const budgetErr = validateBudget(values.budget);

      if (nameErr) errors.name = nameErr;
      if (ownerErr) errors.owner = ownerErr;
      if (budgetErr) errors.budget = budgetErr;

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await create({
          name: values.name,
          owner: values.owner,
          budget: Number(values.budget),
          status: values.status,
        });
        await reload();
        projectForm.reset();
      } catch (error) {
        // Error manejado por useCreateProject
      }
    },
  });

  const filteredProjects = useMemo(() => {
    const items = data?.projects || [];
    return items
      .filter((p: Project) => (statusFilter === "all" ? true : p.status === statusFilter))
      .filter((p: Project) =>
        q.trim() ? p.name.toLowerCase().includes(q.trim().toLowerCase()) : true
      );
  }, [data, q, statusFilter]);

  const selected = useMemo(() => {
    if (!data?.projects || !selectedId) return null;
    return data.projects.find((p: Project) => p.id === selectedId) || null;
  }, [data, selectedId]);

  React.useEffect(() => {
    onLoginStateChange(!!token);
  }, [token, onLoginStateChange]);

  React.useEffect(() => {
    if (!selectedId && data?.projects?.[0]?.id) {
      setSelectedId(data.projects[0].id);
    }
  }, [data, selectedId]);

  async function onToggleStatus(id: string) {
    try {
      await toggle(id);
      await reload();
    } catch (e) {
      const error = e as Error;
      alert(`Error: ${error.message || ""}`.trim());
    }
  }

  function onLogout() {
    setToken("");
  }

  return (
    <div style={styles.page}>
      {!token ? (
        // PANTALLA DE LOGIN PROFESIONAL
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            {/* Columna izquierda - Info */}
            <div style={styles.loginHeader}>
              <div style={styles.loginLogo}>📊</div>
              <h1 style={styles.loginTitle}>Mini Dashboard</h1>
              <p style={styles.loginSubtitle}>
                Arquitectura profesional escalable con React + TypeScript.
                Sistema completo de gestión de proyectos con API integrada.
              </p>
              <div style={{ marginTop: 40 }}>
                <div style={styles.credentialsBox}>
                  <div style={styles.credentialsTitle}>
                    Credenciales de prueba:
                  </div>
                  <div style={styles.credentialRow}>
                    <span style={styles.credentialLabel}>Email:</span>
                    <code style={styles.credentialValue}>admin@demo.com</code>
                  </div>
                  <div style={styles.credentialRow}>
                    <span style={styles.credentialLabel}>Password:</span>
                    <code style={styles.credentialValue}>123456</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <form onSubmit={loginForm.handleSubmit} style={styles.loginForm}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Email</label>
                <input
                  type="email"
                  value={loginForm.values.email}
                  onChange={(e) =>
                    loginForm.handleChange("email", e.target.value)
                  }
                  placeholder="admin@demo.com"
                  style={styles.loginInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {loginForm.errors.email && (
                  <span style={styles.inputError}>
                    {loginForm.errors.email}
                  </span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Contraseña</label>
                <input
                  type="password"
                  value={loginForm.values.password}
                  onChange={(e) =>
                    loginForm.handleChange("password", e.target.value)
                  }
                  placeholder="••••••"
                  style={styles.loginInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#d1d5db";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {loginForm.errors.password && (
                  <span style={styles.inputError}>
                    {loginForm.errors.password}
                  </span>
                )}
              </div>

              {loginError && (
                <div style={styles.loginErrorBox}>
                  <span>⚠️</span>
                  <span>{loginError}</span>
                </div>
              )}

              <Button type="submit" disabled={loginForm.submitting}>
                {loginForm.submitting ? "Iniciando sesión..." : "🔐 Login"}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        // DASHBOARD PRINCIPAL (solo visible después de login)
        <>
          <Header
            token={token}
            userName={data?.me?.name}
            loading={loading}
            email={loginForm.values.email}
            pass={loginForm.values.password}
            onEmailChange={(value) => loginForm.handleChange("email", value)}
            onPassChange={(value) => loginForm.handleChange("password", value)}
            onLogin={loginForm.handleSubmit}
            onLogout={onLogout}
            onReload={reload}
          />
      <main style={styles.main}>
        <section style={styles.left}>
          <div style={styles.sectionTitle}>📊 Resumen</div>
          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>
              <div style={{ marginTop: 16, fontWeight: 600 }}>
                Cargando dashboard...
              </div>
            </div>
          ) : err ? (
            <div style={styles.errorBox}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Error</div>
              <div style={{ marginTop: 8, fontSize: 14 }}>
                {err.status ? `(${err.status}) ` : ""}
                {err.message}
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <Button onClick={reload}>🔄 Reintentar</Button>
              </div>
            </div>
          ) : data ? (
            <>
              <div style={styles.grid3}>
                <StatCard
                  title="Revenue"
                  value={money(data.stats.revenue)}
                  hint="Mensual (simulado)"
                />
                <StatCard
                  title="Nuevos usuarios"
                  value={String(data.stats.newUsers)}
                  hint="Últimos 7 días"
                />
                <StatCard
                  title="Churn"
                  value={`${Math.round(data.stats.churn * 100)}%`}
                  hint="Mensual (simulado)"
                />
              </div>
              <div style={{ height: 24 }} />
              <div style={styles.sectionTitle}>✨ Crear proyecto</div>
              <ProjectForm
                name={projectForm.values.name}
                owner={projectForm.values.owner}
                budget={projectForm.values.budget}
                status={projectForm.values.status}
                nameErr={projectForm.errors.name || null}
                ownerErr={projectForm.errors.owner || null}
                budgetErr={projectForm.errors.budget || null}
                formErr={formErr}
                saving={saving || projectForm.submitting}
                onNameChange={(value) => projectForm.handleChange("name", value)}
                onOwnerChange={(value) => projectForm.handleChange("owner", value)}
                onBudgetChange={(value) => projectForm.handleChange("budget", value)}
                onStatusChange={(value) => projectForm.handleChange("status", value)}
                onSubmit={projectForm.handleSubmit}
              />
            </>
          ) : (
            <div style={styles.notice}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
              Inicia sesión para ver el dashboard
            </div>
          )}
        </section>
        <section style={styles.right}>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={styles.sectionTitle}>📁 Proyectos</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="🔍 Buscar..."
                style={styles.smallInput}
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...styles.smallInput, width: 140 }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b5bff";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(59, 91, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e5e7eb";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value="all">📋 Todos</option>
                <option value="active">✅ Activos</option>
                <option value="paused">⏸ Pausados</option>
              </select>
            </div>
          </div>
          {!token ? (
            <div style={styles.notice}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
              Sin token. Haz login arriba
            </div>
          ) : loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.spinner}></div>
              <div style={{ marginTop: 16, fontWeight: 600 }}>
                Cargando proyectos...
              </div>
            </div>
          ) : err ? (
            <div style={styles.errorBox}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Error</div>
              <div style={{ marginTop: 8, fontSize: 14 }}>
                {err.status ? `(${err.status}) ` : ""}
                {err.message}
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <Button onClick={reload}>🔄 Reintentar</Button>
              </div>
            </div>
          ) : data && data.projects.length === 0 ? (
            <div style={styles.emptyBox}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                No hay proyectos
              </div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>
                Crea tu primer proyecto usando el formulario de la izquierda
              </div>
            </div>
          ) : data ? (
            <div style={styles.split}>
              <ProjectList
                projects={filteredProjects}
                selectedId={selectedId}
                onSelectProject={setSelectedId}
              />
              <ProjectDetail project={selected} onToggleStatus={onToggleStatus} />
            </div>
          ) : (
            <div style={styles.notice}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              No hay data
            </div>
          )}
        </section>
      </main>
        </>
      )}
      <style>{`
.row {
  text-align: left;
  width: 100%;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  borderRadius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.rowIdle:hover { 
  border-color: #c7d2fe; 
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.rowActive { 
  border-color: #3b5bff; 
  box-shadow: 0 8px 20px rgba(59,91,255,0.15);
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#ffffff",
  },
  // ESTILOS DE LOGIN
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
    padding: "40px 32px",
  },
  loginCard: {
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: 20,
    border: "2px solid #00d4ff",
    boxShadow: "0 0 40px rgba(0, 212, 255, 0.4), inset 0 0 40px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(20px)",
    maxWidth: 1400,
    width: "100%",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  loginHeader: {
    padding: "60px 60px 40px",
    textAlign: "left",
    background: "rgba(0, 0, 0, 0.9)",
    borderRight: "1px solid #00d4ff",
  },
  loginLogo: {
    fontSize: 72,
    marginBottom: 24,
    filter: "drop-shadow(0 0 15px rgba(0, 212, 255, 0.8))",
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: "#00d4ff",
    marginBottom: 12,
    letterSpacing: "-0.5px",
    textShadow: "0 0 20px #00d4ff, 0 0 40px #00d4ff",
  },
  loginSubtitle: {
    fontSize: 16,
    color: "#7dd3fc",
    fontWeight: 400,
    lineHeight: 1.6,
    textShadow: "0 0 10px rgba(125, 211, 252, 0.5)",
  },
  loginForm: {
    padding: "60px",
    background: "rgba(0, 0, 0, 0.7)",
    display: "grid",
    gap: 24,
  },
  inputGroup: {
    display: "grid",
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#00d4ff",
    textShadow: "0 0 5px rgba(0, 212, 255, 0.5)",
  },
  loginInput: {
    padding: "12px 16px",
    borderRadius: 10,
    border: "2px solid #00d4ff",
    fontSize: 15,
    outline: "none",
    transition: "all 0.3s ease",
    color: "#00d4ff",
    caretColor: "#00ffff",
    background: "rgba(0, 0, 0, 0.7)",
    boxShadow: "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  inputError: {
    fontSize: 13,
    color: "#ff6b6b",
    fontWeight: 500,
    textShadow: "0 0 5px rgba(255, 107, 107, 0.5)",
  },
  loginErrorBox: {
    background: "rgba(255, 59, 59, 0.2)",
    color: "#ff6b6b",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "2px solid #ff3b3b",
    boxShadow: "0 0 15px rgba(255, 59, 59, 0.4)",
    textShadow: "0 0 5px rgba(255, 107, 107, 0.5)",
  },
  loginFooter: {
    padding: "32px 60px",
    background: "#ffffff",
    borderTop: "1px solid #e5e7eb",
    gridColumn: "1 / -1",
  },
  credentialsBox: {
    display: "grid",
    gap: 16,
  },
  credentialsTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#7dd3fc",
    marginBottom: 8,
    textShadow: "0 0 5px rgba(125, 211, 252, 0.5)",
  },
  credentialRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 14,
  },
  credentialLabel: {
    fontWeight: 500,
    color: "#7dd3fc",
    minWidth: 80,
    textShadow: "0 0 5px rgba(125, 211, 252, 0.3)",
  },
  credentialValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#00d4ff",
    background: "rgba(0, 0, 0, 0.7)",
    padding: "6px 12px",
    borderRadius: 6,
    border: "2px solid #00d4ff",
    boxShadow: "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)",
    textShadow: "0 0 5px #00d4ff",
  },
  // ESTILOS DE DASHBOARD
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: 32,
    padding: 32,
    maxWidth: 1400,
    margin: "0 auto",
    background: "transparent",
  },
  left: {
    display: "grid",
    gap: 20,
    alignContent: "start",
  },
  right: {
    display: "grid",
    gap: 20,
    alignContent: "start",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#00d4ff",
    textShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  notice: {
    background: "rgba(0, 0, 0, 0.7)",
    border: "2px solid #00d4ff",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#7dd3fc",
    fontWeight: 500,
    boxShadow: "0 0 20px rgba(0, 212, 255, 0.3), inset 0 0 20px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  loadingBox: {
    background: "rgba(0, 0, 0, 0.7)",
    border: "2px solid #00d4ff",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#00d4ff",
    fontWeight: 600,
    boxShadow: "0 0 20px rgba(0, 212, 255, 0.4), inset 0 0 20px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid rgba(0, 212, 255, 0.3)",
    borderTop: "4px solid #00d4ff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
    boxShadow: "0 0 15px rgba(0, 212, 255, 0.5)",
  },
  errorBox: {
    background: "rgba(255, 59, 59, 0.2)",
    border: "2px solid #ff3b3b",
    borderRadius: 16,
    padding: 24,
    textAlign: "center",
    color: "#ff6b6b",
    boxShadow: "0 0 20px rgba(255, 59, 59, 0.4), inset 0 0 20px rgba(255, 59, 59, 0.1)",
    backdropFilter: "blur(10px)",
  },
  emptyBox: {
    background: "rgba(255, 193, 7, 0.2)",
    border: "2px solid #ffc107",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    color: "#ffeb3b",
    boxShadow: "0 0 20px rgba(255, 193, 7, 0.4), inset 0 0 20px rgba(255, 193, 7, 0.1)",
    backdropFilter: "blur(10px)",
  },
  split: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  smallInput: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "2px solid #00d4ff",
    fontSize: 13,
    outline: "none",
    transition: "all 0.3s ease",
    fontWeight: 500,
    background: "rgba(0, 0, 0, 0.7)",
    color: "#00d4ff",
    boxShadow: "0 0 10px rgba(0, 212, 255, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
};
