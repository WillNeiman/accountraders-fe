'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { LayoutProps } from '@/types/layout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import LoginModal from '@/components/auth/LoginModal';
import { useLoginModalCloseHandler } from '@/utils/navigation';

const ProtectedLayoutContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background.default};
  role: 'main';
  tabIndex: 0;
`;

export default function ProtectedLayout({ children }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const handleLoginClose = useLoginModalCloseHandler();

  useEffect(() => {
    if (!isLoading && !user) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoginModalOpen(false);
    }
  }, [isLoading, user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
        isAuthRequired={true}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />
      <Suspense fallback={<LoadingSpinner />}>
        <ProtectedLayoutContainer>{children}</ProtectedLayoutContainer>
      </Suspense>
    </>
  );
} 