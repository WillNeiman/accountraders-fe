import { signup } from '@/services/auth';
import SignupContent from './SignupContent';
import { useToast } from '@/contexts/ToastContext';
import Modal from '../common/Modal';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

export default function SignupModal({ isOpen, onClose, onLoginClick }: SignupModalProps) {
  const { showToast } = useToast();

  const handleSignup = async (data: {
    nickname: string;
    email: string;
    password: string;
    fullName?: string;
    profilePictureUrl?: string;
  }) => {
    try {
      await signup(data);
      showToast('회원가입이 완료되었습니다.');
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <SignupContent onSubmit={handleSignup} />
    </Modal>
  );
} 