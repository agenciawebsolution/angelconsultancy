/**
 * ==============================================================================
 * Angel Consultancy & Network - Cliente HTTP Base para APIs PHP
 * ==============================================================================
 */

const TOKEN_KEY = 'angel_admin_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

interface RequestOptions extends RequestInit {
  data?: unknown;
}

export async function apiRequest<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (options.data && !(options.data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.data);
  } else if (options.data instanceof FormData) {
    options.body = options.data;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include',
  });

  let responseText = '';
  try {
    responseText = await response.text();
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let responseData: unknown;
  const trimmed = responseText.trim();

  if (!trimmed) {
    if (!response.ok) {
      const error = new Error(`O servidor retornou uma resposta vazia (${response.status}).`) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }
    responseData = { success: true };
  } else if (isJson) {
    try {
      responseData = JSON.parse(trimmed);
    } catch {
      const error = new Error('O servidor retornou uma resposta inválida.') as Error & { status?: number; data?: unknown };
      error.status = response.status;
      error.data = trimmed;
      throw error;
    }
  } else {
    try {
      responseData = JSON.parse(trimmed);
    } catch {
      responseData = { message: trimmed };
    }
  }

  if (!response.ok) {
    const errorObj = responseData as { message?: string; error?: string } | undefined;
    const errorMessage = errorObj?.error || errorObj?.message || `Erro de conexão (${response.status})`;
    const error = new Error(errorMessage) as Error & { status?: number; data?: unknown };
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData as T;
}
