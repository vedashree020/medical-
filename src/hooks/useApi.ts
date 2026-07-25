import { useCallback, useEffect, useState } from 'react';
import { HealthStatus, PerformanceMetrics, MetricsHistoryPoint } from '@/types';
import { api } from '@/services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setApiState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(() => {
    let active = true;
    setApiState({ data: null, loading: true, error: null });
    fetcher()
      .then((data) => {
        if (active) setApiState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          setApiState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Request failed' });
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    const cleanup = run();
    return cleanup;
  }, [run]);

  return { ...state, refetch: run };
}

export function useHealth() {
  return useApi<HealthStatus>(() => api.getHealth(), []);
}

export function useMetrics() {
  return useApi<PerformanceMetrics>(() => api.getMetrics(), []);
}

export function useMetricsHistory() {
  return useApi<MetricsHistoryPoint[]>(() => api.getMetricsHistory(), []);
}
