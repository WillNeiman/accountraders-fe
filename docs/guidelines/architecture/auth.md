# 권한 및 인증 체계 가이드라인

## 1. 권한 체계

### 1.1 역할(Role) 정의
```typescript
// src/types/auth.ts
export enum Role {
  USER = 'ROLE_USER',    // 일반 사용자 (기본 역할)
  BUYER = 'ROLE_BUYER',  // 구매자 역할
  SELLER = 'ROLE_SELLER', // 판매자 역할
  ADMIN = 'ROLE_ADMIN'   // 관리자 역할
}

export type RoleType = keyof typeof Role;
```

### 1.2 사용자 상태(UserStatus) 정의
```typescript
// src/types/auth.ts
export enum UserStatus {
  ACTIVE = 'ACTIVE',       // 활성 상태
  INACTIVE = 'INACTIVE',   // 비활성 상태
  BLOCKED = 'BLOCKED',     // 차단 상태
  WITHDRAWN = 'WITHDRAWN'  // 탈퇴 상태
}

export type UserStatusType = keyof typeof UserStatus;
```

## 2. 인증 상태 관리

### 2.1 AuthContext 구현
```typescript
// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import { getCurrentUser, logout as logoutApi } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';
import { formatErrorMessage } from '@/utils/error';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err : new Error('인증 확인에 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setError(null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (err) {
      showToast(formatErrorMessage(err));
    } finally {
      setUser(null);
      setError(null);
      Cookies.remove('accessToken');
    }
  }, [showToast]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
```

### 2.2 API 클라이언트 구현
```typescript
// src/lib/api/apiClient.ts
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
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (error: Error) => {
  refreshSubscribers.forEach(callback => callback(''));
  refreshSubscribers = [];
  return Promise.reject(error);
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    const isAuthFreeEndpoint = (url: string) =>
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !(originalRequest.url && originalRequest.url.includes('/auth/refresh-token')) &&
      !(originalRequest.url && isAuthFreeEndpoint(originalRequest.url))
    ) {
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
        const response = await apiClient.post('/api/v1/auth/refresh-token');
        const newAccessToken = response.data.accessToken;
        onRefreshed(newAccessToken);
        isRefreshing = false;
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
```

## 3. 인증 관련 서비스

### 3.1 인증 서비스 구현
```typescript
// src/services/auth.ts
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/api/apiClient';
import { User } from '@/types/user';
import { formatErrorMessage } from '@/utils/error';

interface LoginRequest {
  email: string;
  password: string;
}

export async function login(credentials: LoginRequest) {
  const response = await apiClient.post('/api/v1/auth/login', credentials);
  return response.data;
}

export async function logout() {
  return apiClient.post('/api/v1/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<User>('/api/v1/users/me');
    return response.data;
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
}

export const isAuthenticated = async () => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};
```

## 4. 보안 고려사항

### 4.1 토큰 관리
- accessToken은 클라이언트에서 접근 가능한 쿠키로 저장
- 토큰 만료 시 자동 갱신 메커니즘 구현
- 리프레시 토큰은 HttpOnly 쿠키로 저장

### 4.2 권한 정보 보호
- 민감한 권한 정보는 클라이언트에 노출하지 않음
- 권한 체크는 서버 측에서 수행
- 권한 정보는 암호화하여 전송

### 4.3 세션 관리
- 세션 타임아웃 적절히 설정
- 동시 로그인 제한
- 비정상적인 접근 시도 모니터링

## 5. 권한 관리 모범 사례

### 5.1 권한 체크 원칙
- 클라이언트 측 권한 체크는 UI/UX 목적으로만 사용
- 모든 중요한 권한 체크는 서버 측에서 수행
- 권한이 필요한 작업은 항상 서버 측에서 재검증
- 클라이언트는 서버로부터 받은 역할 정보를 신뢰하고 사용

### 5.2 상태 관리
- 사용자 상태 변경은 항상 서버 측에서 수행
- 상태 변경 시 적절한 이벤트 발생 및 UI 업데이트
- 상태 변경에 따른 리다이렉션 처리

### 5.3 에러 처리
- 권한 부족 시 적절한 에러 메시지 표시
- 상태 변경 실패 시 사용자에게 명확한 피드백 제공
- 권한 관련 에러 로깅 및 모니터링