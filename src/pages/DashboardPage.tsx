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

export function DashboardPage() {
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
        setLoginError("Credenciales incorrectas");
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
        // El error ya está siendo manejado por useCreateProject
        // y se mostrará automáticamente en formErr
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
      <Header
        token={token}
        userName={data?.me?.name}
        loading={loading}
        email={loginForm.values.email}
        pass={loginForm.values.password}
        loginError={loginError}
        onEmailChange={(value) => loginForm.handleChange("email", value)}
        onPassChange={(value) => loginForm.handleChange("password", value)}
        onLogin={loginForm.handleSubmit}
        onLogout={onLogout}
        onReload={reload}
      />
      
      {!token ? (
        <div style={styles.loginScreen}>
          <div style={styles.loginCard}>
            <div style={styles.loginIcon}>🔐</div>
            <h2 style={styles.loginTitle}>Bienvenido al Dashboard</h2>
            <p style={styles.loginSubtitle}>
              Inicia sesión para acceder a tus proyectos y estadísticas
            </p>
            <div style={styles.loginCredentials}>
              <div style={styles.credentialItem}>
                <span style={styles.credentialLabel}>Email:</span>
                <code style={styles.credentialValue}>admin@demo.com</code>
              </div>
              <div style={styles.credentialItem}>
                <span style={styles.credentialLabel}>Password:</span>
                <code style={styles.credentialValue}>123456</code>
              </div>
            </div>
          </div>
        </div>
      ) : (
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
            ) : null}
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
            {loading ? (
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
            ) : null}
          </section>
        </main>
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
    background: "linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: 32,
    padding: 32,
    maxWidth: 1400,
    margin: "0 auto",
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
    color: "#6b7280",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  notice: {
    background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    fontWeight: 500,
  },
  loadingBox: {
    background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
    border: "1px solid #c7d2fe",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    fontSize: 14,
    color: "#4338ca",
    fontWeight: 600,
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #e0e7ff",
    borderTop: "4px solid #3b5bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },
  errorBox: {
    background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
    border: "1px solid #fca5a5",
    borderRadius: 16,
    padding: 24,
    textAlign: "center",
    color: "#991b1b",
  },
  emptyBox: {
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    border: "1px solid #fbbf24",
    borderRadius: 16,
    padding: 40,
    textAlign: "center",
    color: "#92400e",
  },
  split: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  smallInput: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "2px solid #e5e7eb",
    fontSize: 13,
    outline: "none",
    transition: "all 0.2s ease",
    fontWeight: 500,
    color: "#1f2937",
    caretColor: "#3b5bff",
    background: "#ffffff",
  },
  loginScreen: {
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  loginCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)",
    border: "1px solid #e0e4ff",
    borderRadius: 24,
    padding: 48,
    maxWidth: 500,
    width: "100%",
    boxShadow: "0 8px 32px rgba(59, 91, 255, 0.12)",
    textAlign: "center",
  },
  loginIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 900,
    background: "linear-gradient(135deg, #3b5bff 0%, #5b7bff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: 12,
  },
  loginSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
    lineHeight: 1.6,
  },
  loginCredentials: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    display: "grid",
    gap: 12,
    textAlign: "left",
  },
  credentialItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  credentialLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    minWidth: 80,
  },
  credentialValue: {
    fontSize: 13,
    fontWeight: 600,
    color: "#3b5bff",
    background: "#f0f4ff",
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #c7d2fe",
  },
};
