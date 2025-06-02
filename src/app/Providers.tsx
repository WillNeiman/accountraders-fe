'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import EmotionRegistry from '@/styles/EmotionRegistry';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MainLayout from '@/components/layout/MainLayout';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <EmotionRegistry>
      <ToastProvider>
        <AuthProvider>
          <Header onHeightChange={setHeaderHeight} />
          <MainLayout headerHeight={headerHeight}>
            {children}
          </MainLayout>
          <Footer />
        </AuthProvider>
      </ToastProvider>
    </EmotionRegistry>
  );
} 