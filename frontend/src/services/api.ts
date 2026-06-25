import { supabase } from '../lib/supabase';
import type { ApiResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api/v1';

class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError('Unauthorized', 401);
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? `Request failed with status ${response.status}`,
      response.status,
      payload?.errors
    );
  }

  return payload as T;
}

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  return handleResponse<ApiResponse<T>>(response);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<ApiResponse<T>>(response);
}

export async function apiPatch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<ApiResponse<T>>(response);
}

export async function apiPut<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<ApiResponse<T>>(response);
}

export async function apiDelete<T>(path: string): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  return handleResponse<ApiResponse<T>>(response);
}

export async function apiFetchBlob(path: string): Promise<Blob> {
  const headers = await getAuthHeaders();
  delete headers['Content-Type'];

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError('Unauthorized', 401);
  }

  if (!response.ok) {
    throw new ApiError(`Download failed with status ${response.status}`, response.status);
  }

  return response.blob();
}

export { ApiError };
