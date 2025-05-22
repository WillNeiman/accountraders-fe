"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types/user';
import { getCurrentUser, logout as logoutApi, getAccessToken } from '@/services/auth';

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
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutApi();
    setUser(null);
  }, []);

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