'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MainLayout from '@/components/layout/MainLayout';

export default function AppClientShell({ children }: { children: React.ReactNode }) {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <>
      <Header onHeightChange={setHeaderHeight} />
      <MainLayout headerHeight={headerHeight}>
        {children}
      </MainLayout>
      <Footer />
    </>
  );
} 