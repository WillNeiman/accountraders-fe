import axios, { AxiosError } from 'axios';

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
const onRefreshFailed = (error: any) => {
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
      error.response?.data?.code === 'TOKEN_EXPIRED' && // 서버 응답의 에러 코드로 판단
      !originalRequest._retry &&
      !(originalRequest.url && originalRequest.url.includes('/auth/refresh-token'))
    ) {
      // 이미 갱신 중인 경우, 현재 요청을 대기열에 추가
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve) => {
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
        // 서버가 자동으로 새로운 액세스 토큰과 리프레시 토큰을 쿠키에 설정
        await apiClient.post('/api/v1/auth/refresh-token');
        
        // 갱신 성공 시 대기 중인 요청들 처리
        onRefreshed('');
        isRefreshing = false;
        
        // 원래 요청 재시도 (쿠키는 자동으로 갱신되므로 헤더 수정 불필요)
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        
        // 갱신 실패 시 대기 중인 요청들 처리
        onRefreshFailed(refreshError);
        
        // 토큰 갱신 실패 시 서버의 에러 응답에 따라 처리
        if (refreshError instanceof AxiosError) {
          const errorCode = refreshError.response?.data?.code;
          
          // 리프레시 토큰이 만료되었거나 유효하지 않은 경우
          if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
            if (typeof window !== 'undefined') {
              try {
                // 로그아웃 처리 후 로그인 페이지로 리다이렉트
                await apiClient.post('/api/v1/auth/logout');
              } catch (logoutError) {
                console.error('Logout failed:', logoutError);
              } finally {
                // 로그아웃 API 호출 실패 여부와 관계없이 로그인 페이지로 이동
                window.location.href = '/login';
              }
            }
          }
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 인터셉터 등 공통 설정은 여기서 추가 