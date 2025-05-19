import Cookies from 'js-cookie';
import { api } from '@/lib/api';
import { User } from '@/types/user';
import { AxiosError } from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  nickname: string;
  email: string;
  password: string;
  fullName?: string;
  contactNumber?: string;
  profilePictureUrl?: string;
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
export const login = async (data: LoginRequest): Promise<void> => {
  try {
    await api.post<LoginResponse>('/api/v1/auth/login', data);
    // 서버가 Set-Cookie 헤더를 통해 토큰을 설정하므로 추가 작업 불필요
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
      throw new Error(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};

// 회원가입 API
export const signup = async (data: SignupRequest): Promise<void> => {
  try {
    await api.post('/api/v1/users', data);
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

// 현재 로그인한 사용자 정보 가져오기
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get<User>('/api/v1/auth/me');
    return response.data;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
}

// 로그아웃
export const logout = async () => {
  try {
    await api.post('/api/v1/auth/logout');
    // 쿠키 삭제는 서버에서 처리
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// 현재 액세스 토큰 가져오기 (get만 남김)
export const getAccessToken = () => Cookies.get('accessToken');

export const isAuthenticated = () => !!getAccessToken(); 