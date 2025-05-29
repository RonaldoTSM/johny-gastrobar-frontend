// Configuração da API e funções utilitárias

const API_BASE_URL = 'http://localhost:8088/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP ${response.status}: ${response.statusText}`);
    }

    // Para DELETE que retorna 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${error}`);
  }
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data: any) => apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: <T>(endpoint: string, data: any) => apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, {
    method: 'DELETE',
  }),
};

// Utilitários para formatação de datas
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0]; // AAAA-MM-DD
};

export const formatDateTimeForAPI = (date: Date): string => {
  return date.toISOString().slice(0, 19); // AAAA-MM-DDTHH:MM:SS
};
