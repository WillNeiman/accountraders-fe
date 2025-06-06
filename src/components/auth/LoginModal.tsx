"use client";

import { login, getCurrentUser } from '@/services/auth';
import LoginContent from './LoginContent';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/common/Modal';

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
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        onClose();
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <LoginContent onSubmit={handleLogin} onSignupClick={onSignupClick} />
    </Modal>
  );
} 