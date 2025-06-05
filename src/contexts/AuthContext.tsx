// src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/features/auth';
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
  // 초기 로딩 상태를 true로 설정하여, 인증 확인이 끝나기 전까지 로딩 UI 노출
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      // 서버에 사용자 정보 요청. 유효한 토큰 쿠키가 있으면 사용자 정보 반환 (로그인 성공)
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      // 비로그인 상태로 처리
      setUser(null);
      setError(err instanceof Error ? err : new Error('인증 확인에 실패했습니다.'));
    } finally {
      // 로딩 상태를 종료
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
      await logoutApi(); // 서버가 쿠키를 삭제
    } catch (err) {
      showToast(formatErrorMessage(err));
    } finally {
      // 서버에서 쿠키 삭제를 실패할 경우를 대비해 클라이언트에서도 상태를 초기화
      setUser(null);
      setError(null);
      // accessToken은 httpOnly가 아니므로 JS로 삭제가 가능
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