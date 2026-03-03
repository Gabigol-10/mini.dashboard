import { useState } from "react";
import { apiToggleProjectStatus } from "../services/dashboardService";
import type {
  Project,
  ApiError,
} from "../services/dashboardService";

interface UseToggleProjectReturn {
  toggle: (id: string) => Promise<Project>;
  toggling: boolean;
  error: string | null;
}

export function useToggleProject(token: string): UseToggleProjectReturn {
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle(id: string): Promise<Project> {
    setError(null);
    setToggling(true);
    try {
      const updated = await apiToggleProjectStatus({ token, id });
      return updated;
    } catch (e) {
      const err = e as ApiError;
      const errorMsg = `Error: ${err.status || ""} ${err.message || ""}`.trim();
      setError(errorMsg);
      throw err;
    } finally {
      setToggling(false);
    }
  }

  return {
    toggle,
    toggling,
    error,
  };
}
