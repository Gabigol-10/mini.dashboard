import { useState } from "react";
import { apiToggleProjectStatus } from "../services/dashboardService";
import type { Project, ApiError } from "../services/dashboardService";

interface UseToggleProjectReturn {
  toggle: (id: string) => Promise<Project>;
  loading: boolean;
  error: ApiError | null;
  clearError: () => void;
}

export function useToggleProject(
  token: string
): UseToggleProjectReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function toggle(id: string): Promise<Project> {
    setLoading(true);
    setError(null);

    try {
      const updated = await apiToggleProjectStatus({ token, id });
      return updated;
    } catch (e) {
  const err = e as ApiError;

  setError({
    message: err.message || "Error actualizando proyecto",
    status: err.status ?? 0,
  });

  throw err;
} finally {
      setLoading(false);
    }
  }

  function clearError(): void {
    setError(null);
  }

  return {
    toggle,
    loading,
    error,
    clearError,
  };
}