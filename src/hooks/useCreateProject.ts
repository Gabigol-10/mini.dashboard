import { useState } from "react";
import { apiCreateProject } from "../services/dashboardService";
import type {
  CreateProjectPayload,
  Project,
  ApiError,
} from "../services/dashboardService";

interface UseCreateProjectReturn {
  create: (payload: CreateProjectPayload) => Promise<Project>;
  saving: boolean;
  error: ApiError | null;
  clearError: () => void;
}

export function useCreateProject(token: string): UseCreateProjectReturn {
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function create(payload: CreateProjectPayload): Promise<Project> {
    setError(null);
    setSaving(true);

    try {
      const created = await apiCreateProject({ token, payload });
      return created;
    } catch (e) {
  const err = e as ApiError;

  const apiError: ApiError = {
    message: err.message || "Error creando proyecto",
    status: err.status ?? 0,
  };

  setError(apiError);
  throw apiError;
} finally {
      setSaving(false);
    }
  }

  function clearError(): void {
    setError(null);
  }

  return {
    create,
    saving,
    error,
    clearError,
  };
}