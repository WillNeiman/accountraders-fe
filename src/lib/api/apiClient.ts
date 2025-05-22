import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 401 인터셉터: 액세스 토큰 만료 시 자동으로 refresh-token 요청 후 재시도
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !(originalRequest.url && originalRequest.url.includes('/users/me')) &&
      (accessToken || refreshToken)
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.post('/api/v1/auth/refresh-token');
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// 인터셉터 등 공통 설정은 여기서 추가 