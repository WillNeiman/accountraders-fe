import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { login, signup, getCurrentUser } from '@/services/auth';
import { useToast } from '@/contexts/ToastContext';
import Modal from '../common/Modal';
import SignupContent from './SignupContent';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
  const { showToast } = useToast();
  const { login: setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (data: {
    nickname: string;
    email: string;
    password: string;
    fullName?: string;
    profilePictureUrl?: string;
  }) => {
    try {
      setIsLoading(true);
      // 회원가입
      await signup(data);
      
      // 자동 로그인
      await login({ email: data.email, password: data.password });
      const userData = await getCurrentUser();
      setUser(userData);
      
      showToast('회원가입이 완료되었습니다.');
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="small"
      isLoading={isLoading}
      preventCloseWhenLoading={true}
      hasUnsavedChanges={isLoading}
      unsavedChangesMessage="회원가입 중입니다. 정말로 닫으시겠습니까?"
    >
      <SignupContent onSubmit={handleSignup} />
    </Modal>
  );
} 