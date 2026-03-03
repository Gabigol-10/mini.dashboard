// ------------------------- TIPOS -------------------------

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface Stats {
  revenue: number;
  newUsers: number;
  churn: number;
}

export interface Project {
  id: string;
  name: string;
  status: "active" | "paused";
  owner: string;
  budget: number;
}

export interface DashboardResponse {
  me: User;
  stats: Stats;
  projects: Project[];
}

export interface CreateProjectPayload {
  name: string;
  owner: string;
  budget?: number;
  status?: "active" | "paused";
}

export interface ApiError extends Error {
  status?: number;
}

// ------------------------- "API" SIMULADA -------------------------

const fakeDb: DashboardResponse = {
  me: { id: "u1", name: "Wilber", role: "admin" },
  stats: { revenue: 18340, newUsers: 27, churn: 0.04 },
  projects: [
    { id: "p1", name: "RV4", status: "active", owner: "Backend", budget: 6000 },
    { id: "p2", name: "Portal Real Estate", status: "paused", owner: "Frontend", budget: 4500 },
    { id: "p3", name: "ReflexoPeru", status: "active", owner: "Fullstack", budget: 7800 },
    { id: "p4", name: "Agentes IA", status: "active", owner: "IA", budget: 2500 },
  ],
};

function randomFail(prob = 0.15): boolean {
  return Math.random() < prob;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function apiGetDashboard({ token }: { token: string }): Promise<DashboardResponse> {
  await sleep(700);
  if (!token) {
    const err = new Error("No autorizado") as ApiError;
    err.status = 401;
    throw err;
  }
  if (randomFail(0.12)) {
    const err = new Error("Error de red (simulado)") as ApiError;
    err.status = 503;
    throw err;
  }
  return {
    me: fakeDb.me,
    stats: fakeDb.stats,
    projects: fakeDb.projects,
  };
}

export async function apiCreateProject({ 
  token, 
  payload 
}: { 
  token: string; 
  payload: CreateProjectPayload;
}): Promise<Project> {
  await sleep(650);
  if (!token) {
    const err = new Error("No autorizado") as ApiError;
    err.status = 401;
    throw err;
  }
  if (!payload?.name || payload.name.trim().length < 3) {
    const err = new Error("Nombre inválido (mínimo 3 caracteres)") as ApiError;
    err.status = 400;
    throw err;
  }
  if (!payload?.owner) {
    const err = new Error("Owner requerido") as ApiError;
    err.status = 400;
    throw err;
  }
  if (randomFail(0.2)) {
    const err = new Error("No se pudo crear (simulado)") as ApiError;
    err.status = 500;
    throw err;
  }
  const newItem: Project = {
    id: "p" + (fakeDb.projects.length + 1),
    name: payload.name.trim(),
    status: payload.status || "active",
    owner: payload.owner,
    budget: Number(payload.budget || 0),
  };
  fakeDb.projects = [newItem, ...fakeDb.projects];
  return newItem;
}

export async function apiToggleProjectStatus({ 
  token, 
  id 
}: { 
  token: string; 
  id: string;
}): Promise<Project> {
  await sleep(450);
  if (!token) {
    const err = new Error("No autorizado") as ApiError;
    err.status = 401;
    throw err;
  }
  const idx = fakeDb.projects.findIndex((p) => p.id === id);
  if (idx === -1) {
    const err = new Error("No encontrado") as ApiError;
    err.status = 404;
    throw err;
  }
  if (randomFail(0.1)) {
    const err = new Error("Error al actualizar (simulado)") as ApiError;
    err.status = 409;
    throw err;
  }
  const curr = fakeDb.projects[idx];
  const next: Project = { ...curr, status: curr.status === "active" ? "paused" : "active" };
  fakeDb.projects[idx] = next;
  return next;
}
