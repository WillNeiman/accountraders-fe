'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';

const ProtectedLayoutContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.default};
`;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <ProtectedLayoutContainer>{children}</ProtectedLayoutContainer>;
} 