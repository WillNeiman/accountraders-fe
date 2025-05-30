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
      const accessToken = Cookies.get('accessToken');
      if (!accessToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err : new Error('인증 확인 중 오류가 발생했습니다.'));
      // 토큰이 유효하지 않은 경우 쿠키 삭제
      Cookies.remove('accessToken');
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
}; 