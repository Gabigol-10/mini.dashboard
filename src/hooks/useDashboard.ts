import { useEffect, useState } from "react";
import { apiGetDashboard } from "../services/dashboardService";
import type {
  DashboardResponse,
  ApiError,
} from "../services/dashboardService";

interface UseDashboardReturn {
  data: DashboardResponse | null;
  loading: boolean;
  error: { message: string; status: number } | null;
  reload: () => Promise<void>;
}

export function useDashboard(token: string): UseDashboardReturn {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetDashboard({ token });
      setData(res);
    } catch (e) {
      const err = e as ApiError;
      setError({ message: err.message || "Error", status: err.status || 0 });
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}
