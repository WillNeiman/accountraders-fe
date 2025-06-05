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
    
    // 인증이 필요 없는 엔드포인트 예외 처리
    const isAuthFreeEndpoint = (url: string) =>
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password');

    // 토큰 갱신이 필요한 경우
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !(originalRequest.url && originalRequest.url.includes('/auth/refresh-token')) &&
      !(originalRequest.url && isAuthFreeEndpoint(originalRequest.url))
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
        
        // 갱신 성공 시 대기 중인 요청들 처리
        onRefreshed(newAccessToken);
        isRefreshing = false;
        
        // 원래 요청 재시도
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        
        onRefreshFailed(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'));
        
        if (typeof window !== 'undefined') {
          try {
            await apiClient.post('/api/v1/auth/logout'); 
          } catch (logoutError) {
            console.error('Logout failed after refresh failure:', logoutError);
          } finally {
            Cookies.remove('accessToken');
          }
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    return response;
  },
  (error) => {
    // 오류 응답을 처리
    if (error.response) {
      // 서버가 응답을 반환한 경우
      switch (error.response.status) {
        case 401:
          // 인증 오류 처리
          break;
        case 403:
          // 권한 오류 처리
          break;
        case 404:
          // 리소스를 찾을 수 없는 경우
          break;
        default:
          // 기타 오류 처리
          break;
      }
    }
    return Promise.reject(error);
  }
); 