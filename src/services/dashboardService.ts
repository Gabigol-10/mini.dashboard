import { httpClient, HttpError } from "../api/httpClient";

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

export interface ApiError {
  message: string;
  status: number;
}

const USE_MOCK_API = true;
const API_BASE_URL = "http://localhost:3001/api";

if (!USE_MOCK_API) {
  httpClient.setBaseURL(API_BASE_URL);
}

const fakeDb: DashboardResponse = {
  me: { id: "u1", name: "Wilber", role: "admin" },
  stats: { revenue: 18340, newUsers: 27, churn: 0.04 },
  projects: [
    { id: "p1", name: "RV4", status: "active", owner: "Backend", budget: 6000 },
    {
      id: "p2",
      name: "Portal Real Estate",
      status: "paused",
      owner: "Frontend",
      budget: 4500,
    },
    {
      id: "p3",
      name: "ReflexoPeru",
      status: "active",
      owner: "Fullstack",
      budget: 7800,
    },
    {
      id: "p4",
      name: "Agentes IA",
      status: "active",
      owner: "IA",
      budget: 2500,
    },
  ],
};

function randomFail(prob = 0.15): boolean {
  return Math.random() < prob;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function mockGetDashboard(token: string): Promise<DashboardResponse> {
  await sleep(700);
  if (!token) {
    const err: ApiError = {
      message: "No autorizado",
      status: 401,
    };
    throw err;
  }
  if (randomFail(0.12)) {
    const err: ApiError = {
      message: "Error de red (simulado)",
      status: 503,
    };
    throw err;
  }
  return {
    me: fakeDb.me,
    stats: fakeDb.stats,
    projects: [...fakeDb.projects],
  };
}

async function mockCreateProject(
  token: string,
  payload: CreateProjectPayload
): Promise<Project> {
  await sleep(650);
  if (!token) {
    const err: ApiError = {
      message: "No autorizado",
      status: 401,
    };
    throw err;
  }
  if (!payload?.name || payload.name.trim().length < 3) {
    const err: ApiError = {
      message: "Nombre inválido (mínimo 3 caracteres)",
      status: 400,
    };
    throw err;
  }
  if (!payload?.owner) {
    const err: ApiError = {
      message: "Owner requerido",
      status: 400,
    };
    throw err;
  }
  if (randomFail(0.2)) {
    const err: ApiError = {
      message: "No se pudo crear (simulado)",
      status: 500,
    };
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

async function mockToggleProjectStatus(
  token: string,
  id: string
): Promise<Project> {
  await sleep(450);
  if (!token) {
    const err: ApiError = {
      message: "No autorizado",
      status: 401,
    };
    throw err;
  }
  const idx = fakeDb.projects.findIndex((p) => p.id === id);
  if (idx === -1) {
    const err: ApiError = {
      message: "No encontrado",
      status: 404,
    };
    throw err;
  }
  if (randomFail(0.1)) {
    const err: ApiError = {
      message: "Error al actualizar (simulado)",
      status: 409,
    };
    throw err;
  }
  const curr = fakeDb.projects[idx];
  const next: Project = {
    ...curr,
    status: curr.status === "active" ? "paused" : "active",
  };
  fakeDb.projects[idx] = next;
  return next;
}

export async function apiGetDashboard({
  token,
}: {
  token: string;
}): Promise<DashboardResponse> {
  if (USE_MOCK_API) {
    return mockGetDashboard(token);
  }

  try {
    return await httpClient.get<DashboardResponse>("/dashboard", { token });
  } catch (err) {
    if (err instanceof HttpError) {
      const apiError: ApiError = {
        message: err.message,
        status: err.status,
      };
      throw apiError;
    }
    if (err instanceof Error) {
      const apiError: ApiError = {
        message: err.message,
        status: 0,
      };
      throw apiError;
    }
    const apiError: ApiError = {
      message: "Error desconocido",
      status: 0,
    };
    throw apiError;
  }
}

export async function apiCreateProject({
  token,
  payload,
}: {
  token: string;
  payload: CreateProjectPayload;
}): Promise<Project> {
  if (USE_MOCK_API) {
    return mockCreateProject(token, payload);
  }

  try {
    return await httpClient.post<Project>("/projects", payload, { token });
  } catch (err) {
    if (err instanceof HttpError) {
      const apiError: ApiError = {
        message: err.message,
        status: err.status,
      };
      throw apiError;
    }
    if (err instanceof Error) {
      const apiError: ApiError = {
        message: err.message,
        status: 0,
      };
      throw apiError;
    }
    const apiError: ApiError = {
      message: "Error desconocido",
      status: 0,
    };
    throw apiError;
  }
}

export async function apiToggleProjectStatus({
  token,
  id,
}: {
  token: string;
  id: string;
}): Promise<Project> {
  if (USE_MOCK_API) {
    return mockToggleProjectStatus(token, id);
  }

  try {
    return await httpClient.patch<Project>(
      `/projects/${id}/toggle`,
      {},
      { token }
    );
  } catch (err) {
    if (err instanceof HttpError) {
      const apiError: ApiError = {
        message: err.message,
        status: err.status,
      };
      throw apiError;
    }
    if (err instanceof Error) {
      const apiError: ApiError = {
        message: err.message,
        status: 0,
      };
      throw apiError;
    }
    const apiError: ApiError = {
      message: "Error desconocido",
      status: 0,
    };
    throw apiError;
  }
}
