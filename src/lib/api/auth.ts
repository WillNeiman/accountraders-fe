// src/lib/api/auth.ts
import { apiClient } from './apiClient';

interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  tokenType: string;
}

export async function login(credentials: LoginRequest) {
  const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
  return response.data;
}

export function logout() {
  return apiClient.post('/api/v1/auth/logout');
} 