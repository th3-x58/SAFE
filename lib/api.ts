import type { Transaction, Budget, Goal } from '../types';
import { apiBaseUrl } from './utils';

const API_BASE_URL = `${apiBaseUrl}/api`;

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new ApiError(`API request failed: ${response.statusText}`, response.status);
  }

  return response.json();
}

// Transactions API
export const transactionsApi = {
  getAll: (): Promise<Transaction[]> => fetchApi<Transaction[]>('/transactions'),
  
  create: (transaction: Omit<Transaction, 'id'>): Promise<Transaction> =>
    fetchApi<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),
  
  createBulk: (transactions: Omit<Transaction, 'id'>[]): Promise<Transaction[]> =>
    fetchApi<Transaction[]>('/transactions/bulk', {
      method: 'POST',
      body: JSON.stringify(transactions),
    }),
  
  delete: (id: string): Promise<void> =>
    fetchApi<void>(`/transactions/${id}`, {
      method: 'DELETE',
    }),
};

// Budgets API
export const budgetsApi = {
  getAll: (): Promise<Budget[]> => fetchApi<Budget[]>('/budgets'),
  
  update: (id: string, budget: Omit<Budget, 'id'>): Promise<Budget> =>
    fetchApi<Budget>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget),
    }),
};

// Goals API
export const goalsApi = {
  getAll: (): Promise<Goal[]> => fetchApi<Goal[]>('/goals'),
  
  update: (id: string, goal: Omit<Goal, 'id'>): Promise<Goal> =>
    fetchApi<Goal>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    }),
};

// Auth API
export const authApi = {
  register: (email: string, password: string): Promise<{ id: string; email: string }> =>
    fetchApi<{ id: string; email: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  login: (email: string, password: string): Promise<{ token: string }> =>
    fetchApi<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
