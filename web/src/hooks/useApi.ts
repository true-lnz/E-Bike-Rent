// hooks/useApi.ts
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../constants";

type ApiResponse<T> = {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
};

function useApi<T>(
  url: string,
  options: AxiosRequestConfig = {},
  immediate = true
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<AxiosError | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fullUrl = url.startsWith('http') ? url : BASE_URL + url;
      const response: AxiosResponse<T> = await axios({
        url: fullUrl,
        withCredentials: true,
        ...options
      });
      
      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError);
      throw axiosError;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

export function useApiGet<T>(url: string, params = {}, immediate = true) {
  return useApi<T>(url, { method: 'GET', params }, immediate);
}

export function useApiPost<T>(url: string, data = {}, immediate = false) {
  return useApi<T>(url, { method: 'POST', data }, immediate);
}

export function useApiPut<T>(url: string, data = {}, immediate = false) {
  return useApi<T>(url, { method: 'PUT', data }, immediate);
}

export function useApiDelete<T>(url: string, immediate = false) {
  return useApi<T>(url, { method: 'DELETE' }, immediate);
}

export default useApi;