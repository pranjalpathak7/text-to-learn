// client/src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { apiClient } from '../utils/api';
import type { AxiosRequestConfig } from 'axios'; // <-- Notice the 'type' keyword added here!

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    method: 'get' | 'post' | 'put' | 'delete', 
    url: string, 
    payload?: any, 
    config?: AxiosRequestConfig
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient[method](url, payload, config);
      setData(response.data);
      return response.data;
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}