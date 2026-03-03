import React, { useMemo, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { useCreateProject } from "../hooks/useCreateProject";
import { useToggleProject } from "../hooks/useToggleProject";
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

export function DashboardPage() {
  // auth state
  const [token, setToken] = useState("demo-token");
  const [email, setEmail] = useState("admin@demo.com");
  const [pass, setPass] = useState("123456");

  // hooks personalizados
  const { data, loading, error: err, reload } = useDashboard(token);
  const { create, saving, error: formErr } = useCreateProject(token);
  const { toggle } = useToggleProject(token);

  // ui state
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // form state
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [budget, setBudget] = useState("0");
  const [status, setStatus] = useState<"active" | "paused">("active");

  // validaciones
  const nameErr = validateProjectName(name);
  const ownerErr = validateOwner(owner);
  const budgetErr = validateBudget(budget);

  const filteredProjects = useMemo(() => {
    const items = data?.projects || [];
    return items
      .filter((p) => (statusFilter === "all" ? true : p.status === statusFilter))
      .filter((p) =>
        q.trim() ? p.name.toLowerCase().includes(q.trim().toLowerCase()) : true
      );
  }, [data, q, statusFilter]);

  const selected = useMemo(() => {
    if (!data?.projects || !selectedId) return null;
    return data.projects.find((p) => p.id === selectedId) || null;
  }, [data, selectedId]);

  React.useEffect(() => {
    if (!selectedId && data?.projects?.[0]?.id) {
      setSelectedId(data.projects[0].id);
    }
  }, [data, selectedId]);

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || name.trim().length < 3) {
      return;
    }
    if (!owner || owner.trim().length < 2) {
      return;
    }
    if (isNaN(Number(budget))) {
      return;
    }

    try {
      await create({
        name,
        owner,
        budget: Number(budget),
        status,
      });
      await reload();
      setName("");
      setOwner("");
      setBudget("0");
      setStatus("active");
    } catch (e) {
      // error manejado por el hook
    }
  }

  async function onToggleStatus(id: string) {
    try {
      await toggle(id);
      await reload();
    } catch (e) {
      const error = e as Error;
      alert(`Error: ${error.message || ""}`.trim());
    }
  }

  function onLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@") || pass.length < 3) {
      alert("Credenciales inválidas (simulado)");
      return;
    }
    setToken("demo-token");
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
        email={email}
        pass={pass}
        onEmailChange={setEmail}
        onPassChange={setPass}
        onLogin={onLogin}
        onLogout={onLogout}
        onReload={reload}
      />
      <main style={styles.main}>
        <section style={styles.left}>
          <div style={styles.sectionTitle}>Resumen</div>
          {loading ? (
            <div style={styles.notice}>Cargando dashboard…</div>
          ) : err ? (
            <div style={styles.errorBox}>
              <div style={{ fontWeight: 800 }}>Error</div>
              <div style={{ marginTop: 6, fontSize: 13 }}>
                {err.status ? `(${err.status}) ` : ""}
                {err.message}
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <Button onClick={reload}>Reintentar</Button>
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
              <div style={{ height: 16 }} />
              <div style={styles.sectionTitle}>Crear proyecto</div>
              <ProjectForm
                name={name}
                owner={owner}
                budget={budget}
                status={status}
                nameErr={nameErr}
                ownerErr={ownerErr}
                budgetErr={budgetErr}
                formErr={formErr}
                saving={saving}
                onNameChange={setName}
                onOwnerChange={setOwner}
                onBudgetChange={setBudget}
                onStatusChange={setStatus}
                onSubmit={onCreate}
              />
            </>
          ) : (
            <div style={styles.notice}>
              Inicia sesión para ver el dashboard (token vacío = 401).
            </div>
          )}
        </section>
        <section style={styles.right}>
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={styles.sectionTitle}>Proyectos</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar…"
                style={styles.smallInput}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...styles.smallInput, width: 140 }}
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="paused">Pausados</option>
              </select>
            </div>
          </div>
          {!token ? (
            <div style={styles.notice}>Sin token. Haz login arriba.</div>
          ) : loading ? (
            <div style={styles.notice}>Cargando lista…</div>
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
            <div style={styles.notice}>No hay data.</div>
          )}
        </section>
      </main>
      <style>{`
.row {
  text-align: left;
  width: 100%;
  border: 1px solid #e5e7ff;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
}
.rowIdle:hover { border-color: #b8c1ff; }
.rowActive { border-color: #3b5bff; box-shadow: 0 10px 30px rgba(59,91,255,0.12); }
`}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f6f7ff, #ffffff)",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: 24,
    padding: 24,
    maxWidth: 1400,
    margin: "0 auto",
  },
  left: {
    display: "grid",
    gap: 16,
    alignContent: "start",
  },
  right: {
    display: "grid",
    gap: 16,
    alignContent: "start",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    opacity: 0.6,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  notice: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
    textAlign: "center",
    fontSize: 13,
    opacity: 0.75,
  },
  errorBox: {
    background: "#ffe7e7",
    border: "1px solid #ffd0d0",
    borderRadius: 12,
    padding: 16,
  },
  split: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  smallInput: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d9d9e3",
    fontSize: 13,
    outline: "none",
  },
};
