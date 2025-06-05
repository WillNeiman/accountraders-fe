interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  tokenType: string;
}

import { apiClient } from './client';

/**
 * 사용자 로그인을 수행합니다.
 * @param credentials 로그인 정보
 * @returns 로그인 응답
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', credentials);
  return response.data;
}

/**
 * 사용자 로그아웃을 수행합니다.
 */
export function logout() {
  return apiClient.post('/api/v1/auth/logout');
} 