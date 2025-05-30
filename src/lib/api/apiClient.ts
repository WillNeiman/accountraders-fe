import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 토큰 갱신 중복 요청 방지를 위한 플래그
let isRefreshing = false;
// 갱신 대기 중인 요청들을 저장할 배열
let refreshSubscribers: ((token: string) => void)[] = [];

// 갱신 완료 후 대기 중인 요청들을 처리
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// 갱신 실패 시 대기 중인 요청들을 처리
const onRefreshFailed = (error: Error) => {
  refreshSubscribers.forEach(callback => callback(''));
  refreshSubscribers = [];
  return Promise.reject(error);
};

// 401 인터셉터: 액세스 토큰 만료 시 자동으로 refresh-token 요청 후 재시도
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // 토큰 갱신이 필요한 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !(originalRequest.url && originalRequest.url.includes('/auth/refresh-token'))
    ) {
      // 이미 갱신 중인 경우, 현재 요청을 대기열에 추가
      if (isRefreshing) {
        try {
          await new Promise<string>((resolve) => {
            refreshSubscribers.push(resolve);
          });
          return apiClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // 토큰 갱신 요청
        const response = await apiClient.post('/api/v1/auth/refresh-token');
        
        // 새로운 액세스 토큰을 쿠키에 저장
        const newAccessToken = response.data.accessToken;
        Cookies.set('accessToken', newAccessToken, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        // 갱신 성공 시 대기 중인 요청들 처리
        onRefreshed(newAccessToken);
        isRefreshing = false;
        
        // 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        
        // 갱신 실패 시 대기 중인 요청들 처리
        onRefreshFailed(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'));
        
        // 토큰 갱신 실패 시 로그아웃 처리
        if (typeof window !== 'undefined') {
          try {
            await apiClient.post('/api/v1/auth/logout');
          } catch (logoutError) {
            console.error('Logout failed:', logoutError);
          } finally {
            Cookies.remove('accessToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 인터셉터 등 공통 설정은 여기서 추가 