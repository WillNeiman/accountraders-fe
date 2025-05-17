import { api } from '@/lib/api';
import { User } from '@/types/user';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  tokenType: string;  // Bearer
}

// 로그인 API
export async function login(credentials: LoginRequest) {
  try {
    const response = await api.post<LoginResponse>('/api/v1/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // 서버에서 응답이 왔지만 에러인 경우
      const errorMessage = error.response.data?.message || '로그인에 실패했습니다.';
      throw new Error(errorMessage);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      // 요청 설정 중 에러가 발생한 경우
      throw new Error('로그인 요청 중 오류가 발생했습니다.');
    }
  }
}

// 현재 사용자 정보 조회
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get<User>('/api/v1/users/me');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || '사용자 정보 조회에 실패했습니다.';
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('서버와의 통신에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      throw new Error('사용자 정보 요청 중 오류가 발생했습니다.');
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
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
  if (accessTokenCookie) {
    return accessTokenCookie.split('=')[1];
  }
  return null;
} 