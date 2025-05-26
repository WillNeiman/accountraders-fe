"use client";

import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { login, getCurrentUser } from '@/services/auth';
import LoginContent from './LoginContent';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const Overlay = styled.div<{ isClosing?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${props => props.isClosing ? fadeOut : fadeIn} 0.3s ease-in-out forwards;
`;

const ModalContainer = styled.div<{ isClosing?: boolean }>`
  background: ${colors.background.default};
  border-radius: ${spacing[2]};
  padding: ${spacing[10]};
  position: relative;
  width: 100%;
  max-width: 480px;
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-in-out forwards;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${spacing[4]};
  right: ${spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.text.secondary};
  padding: ${spacing[1]};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text.primary};
  }
`;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick?: () => void;
  onLoginSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSignupClick, onLoginSuccess }: LoginModalProps) {
  const { showToast } = useToast();
  const { login: setUser } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      const userData = await getCurrentUser();
      setUser(userData);
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <CloseButton onClick={onClose} aria-label="닫기">
          ✕
        </CloseButton>
        <LoginContent onSubmit={handleLogin} onSignupClick={onSignupClick} />
      </ModalContainer>
    </Overlay>
  );
} 