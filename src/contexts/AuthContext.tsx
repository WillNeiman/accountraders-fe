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
      const user = await getCurrentUser();
      setUser(user);
    } catch (err: any) {
      setUser(null);
      setError(err);
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