// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/user';
import { getCurrentUser, logout as logoutApi } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';
import { formatErrorMessage } from '@/utils/error';
// js-cookie는 여기서 더 이상 인증 확인 용도로 필요하지 않습니다.
// 로그아웃 시 클라이언트 측 토큰을 명시적으로 지우고 싶다면 남겨둘 수 있습니다.
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
  // 초기 로딩 상태를 true로 설정하여, 인증 확인이 끝나기 전까지 로딩 UI를 보여줍니다.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const checkAuth = useCallback(async () => {
    // 1. 클라이언트에서 쿠키를 확인하는 로직을 제거합니다.
    //    브라우저가 API 요청 시 자동으로 쿠키를 보내주므로,
    //    서버에 바로 사용자 정보를 요청하여 인증 상태를 확인합니다.
    try {
      // 2. 서버에 사용자 정보 요청.
      //    - 유효한 토큰 쿠키가 있으면: 사용자 정보 반환 (로그인 성공)
      //    - 액세스 토큰 만료, 리프레시 토큰 유효 시: axios 인터셉터가 토큰 갱신 후 재요청하여 사용자 정보 반환 (로그인 성공)
      //    - 모든 토큰이 무효/없으면: 401 에러 발생 (로그인 실패)
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      // 3. getCurrentUser()가 실패하면 (401 등) 비로그인 상태로 처리합니다.
      //    axios 인터셉터가 리프레시까지 실패한 최종적인 결과입니다.
      setUser(null);
      setError(err instanceof Error ? err : new Error('인증 확인에 실패했습니다.'));
    } finally {
      // 4. 인증 확인 절차가 성공하든 실패하든, 로딩 상태를 종료합니다.
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
      await logoutApi(); // 서버에 로그아웃 요청 (서버가 쿠키를 삭제)
    } catch (err) {
      showToast(formatErrorMessage(err));
    } finally {
      // 서버에서 쿠키 삭제를 실패할 경우를 대비해 클라이언트에서도 상태를 초기화합니다.
      setUser(null);
      setError(null);
      // accessToken은 httpOnly가 아니므로 JS로 삭제가 가능합니다.
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