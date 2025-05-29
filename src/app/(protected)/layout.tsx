'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { LayoutProps } from '@/types/layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const ProtectedLayoutContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.default};
  role: 'main';
  tabIndex: 0;
`;

export default function ProtectedLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
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