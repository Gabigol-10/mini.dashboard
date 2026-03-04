import { useEffect, useState, useCallback } from "react";
import { apiGetDashboard } from "../services/dashboardService";
import type {
  DashboardResponse,
  ApiError,
} from "../services/dashboardService";

interface UseDashboardReturn {
  data: DashboardResponse | null;
  loading: boolean;
  error: ApiError | null;
  reload: () => Promise<void>;
}

export function useDashboard(token: string): UseDashboardReturn {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiGetDashboard({ token });
      setData(response);
    } catch (e) {
      const err = e as ApiError;
      setError({
        message: err.message || "Error cargando dashboard",
        status: err.status ?? 0,
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    reload: load, // 👈 ESTO ES LO QUE FALTABA
  };
}