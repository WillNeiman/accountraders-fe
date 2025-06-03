"use client";

import { useState } from 'react';
import { login, getCurrentUser } from '@/services/auth';
import LoginContent from './LoginContent';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/common/Modal';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick?: () => void;
  onLoginSuccess?: () => void;
  redirectUrl?: string;
  isAuthRequired?: boolean;
}

const AuthRequiredBanner = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Box Model */
  width: 100%;
  padding: ${spacing[3]} ${spacing[2]};
  margin-bottom: ${spacing[4]};
  border-radius: ${spacing[2]};
  /* Visual */
  background-color: ${colors.primary[50]};
  border: 1px solid ${colors.primary[200]};
  /* Typography */
  font-size: ${typography.fontSize.base};
  color: ${colors.primary[700]};
  font-weight: ${typography.fontWeight.medium};
  text-align: center;
`;

export default function LoginModal({ isOpen, onClose, onSignupClick, onLoginSuccess, redirectUrl, isAuthRequired = false }: LoginModalProps) {
  const { showToast } = useToast();
  const { login: setUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await login({ email, password });
      const userData = await getCurrentUser();
      setUser(userData);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        onClose();
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="small"
      isLoading={isLoading}
      preventCloseWhenLoading={true}
      hasUnsavedChanges={isLoading}
      unsavedChangesMessage="로그인 중입니다. 정말로 닫으시겠습니까?"
    >
      {isAuthRequired && (
        <AuthRequiredBanner>
          로그인이 필요한 메뉴입니다
        </AuthRequiredBanner>
      )}
      <LoginContent onSubmit={handleLogin} onSignupClick={onSignupClick} />
    </Modal>
  );
} 