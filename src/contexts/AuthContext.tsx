// src/contexts/AuthContext.tsx
"use client";

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
    // 힌트: accessToken 쿠키를 먼저 확인합니다.
    const accessToken = Cookies.get('accessToken');

    // 힌트가 아예 없으면, API 요청 없이 즉시 로그아웃 처리합니다.
    if (!accessToken) {
      setUser(null);
      setIsLoading(false);
      return; // 함수 종료
    }

    // 힌트(accessToken)가 존재할 경우에만, 서버를 통해 진짜 세션인지 검증합니다.
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      // API 호출에 실패하면 (토큰 만료 등) 로그아웃 처리합니다.
      setError(err instanceof Error ? err : new Error('인증 확인 중 오류가 발생했습니다.'));
      setUser(null);
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
      setUser(null);
      setError(null);
      Cookies.remove('accessToken');
    } catch (err) {
      showToast(formatErrorMessage(err));
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
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; // TODO