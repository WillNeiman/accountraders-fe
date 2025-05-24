"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';
import { getCurrentUser, logout as logoutApi, getAccessToken } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';
import { formatErrorMessage } from '@/utils/error';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { showToast } = useToast();

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = getAccessToken();
      if (!accessToken) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (err) {
        // 토큰이 있지만 사용자 정보를 가져오지 못한 경우
        console.error('Failed to fetch user data:', err);
        setUser(null);
      }
    } catch (err: Error | unknown) {
      setUser(null);
      setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
      showToast(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (err) {
      showToast(formatErrorMessage(err));
    }
  }, [showToast]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 