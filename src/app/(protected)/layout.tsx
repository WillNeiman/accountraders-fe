'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { LayoutProps } from '@/types/common/layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProtectedLayoutContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.default};
  role: 'main';
  tabIndex: 0;
`;

export default function ProtectedLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace('/login');
      }
    }
  }, [isAuthLoading, user, router]);

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProtectedLayoutContainer>{children}</ProtectedLayoutContainer>
    </Suspense>
  );
} 