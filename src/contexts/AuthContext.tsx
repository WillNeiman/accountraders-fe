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
    try {
      // 앱 로딩 시, 항상 getCurrentUser API를 호출하여 서버에 직접 인증 상태를 확인합니다.
      // 이 요청이 401을 반환하면 apiClient 인터셉터가 자동으로 리프레시를 시도할 것입니다.
      const userData = await getCurrentUser(); // services/auth에 정의된 API 함수
      setUser(userData);
      setError(null);
    } catch (err) {
      // getCurrentUser 또는 리프레시 시도 자체가 실패한 경우 (예: 리프레시 토큰 만료)
      setUser(null);
      // 로그인 페이지가 아닐 때만 에러를 표시하거나, 조용히 처리할 수 있습니다.
      // setError(err instanceof Error ? err : new Error('인증 확인 실패'));
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