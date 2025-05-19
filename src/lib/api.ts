// api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 요청 시 쿠키를 포함
});

// API 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰이 만료된 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        removeTokens();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post('/auth/refresh', { refreshToken });
        const { accessToken: newAccessToken } = response.data;
        setAccessToken(newAccessToken);
        
        // 원래 요청 재시도
        const retryConfig = {
          ...error.config,
          headers: {
            ...error.config.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };
        
        return api(retryConfig);
      } catch (error) {
        removeTokens();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// 쿠키에서 액세스 토큰 가져오기
function getAccessTokenFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
  if (accessTokenCookie) {
    return accessTokenCookie.split('=')[1];
  }
  return null;
}

interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  tokenType: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  request?: unknown;
  message?: string;
}

// 로그인 API
export async function login(credentials: LoginRequest) {
  try {
    const response = await api.post<LoginResponse>('/api/v1/auth/login', credentials);
    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    if (err.response) {
      // 서버에서 응답이 왔지만 에러인 경우
      const errorMessage = err.response.data?.message || '로그인에 실패했습니다.';
      throw new Error(errorMessage);
    } else if (err.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      // 요청 설정 중 에러가 발생한 경우
      throw new Error('로그인 요청 중 오류가 발생했습니다.');
    }
  }
}

// 로그아웃
export function logout() {
  // 서버에 로그아웃 요청을 보내면 서버가 쿠키를 삭제함
  return api.post('/api/v1/auth/logout');
}

// 현재 액세스 토큰 가져오기
export function getAccessToken() {
  return getAccessTokenFromCookie();
}

// 예시: 사용자 정보 가져오기
export async function fetchUser(userId: string) {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
}

export const removeTokens = () => {
  Cookies.remove('accessToken', { path: '/' });
  Cookies.remove('refreshToken', { path: '/' });
};

export const setAccessToken = (token: string) => {
  Cookies.set('accessToken', token, {
    expires: 1/24,
    secure: process.env.NODE_ENV === 'production',
  });
}; 