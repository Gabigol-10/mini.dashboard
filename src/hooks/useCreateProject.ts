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
  error: string | null;
  clearError: () => void;
}

export function useCreateProject(token: string): UseCreateProjectReturn {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(payload: CreateProjectPayload): Promise<Project> {
    setError(null);
    setSaving(true);
    try {
      const created = await apiCreateProject({ token, payload });
      return created;
    } catch (e) {
      const err = e as ApiError;
      const errorMsg = `${err.status || ""} ${err.message || "Error creando"}`.trim();
      setError(errorMsg);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return {
    create,
    saving,
    error,
    clearError,
  };
}
