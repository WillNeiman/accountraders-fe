// api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // 스프링 부트 서버 주소로 변경

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
    const accessToken = getAccessTokenFromCookie();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log('API 요청:', config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// API 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    console.log('API 응답:', response.data);
    // 쿠키 확인
    const cookies = response.headers['set-cookie'];
    if (cookies) {
      console.log('서버에서 설정한 쿠키:', cookies);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('API 응답 에러:', error.response.data);
      // 에러 응답의 쿠키도 확인
      const cookies = error.response.headers['set-cookie'];
      if (cookies) {
        console.log('에러 응답의 쿠키:', cookies);
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('API 요청 실패:', error.request);
    } else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('API 에러:', error.message);
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