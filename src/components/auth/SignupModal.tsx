import Modal from '@/components/common/Modal';
import { signup } from '@/services/auth';
import SignupContent from './SignupContent';
import { useToast } from '@/contexts/ToastContext';
import { AxiosError } from 'axios';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignupModal({ isOpen, onClose }: SignupModalProps) {
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
      onClose();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        const errorCode = error.response.data.code;
        if (errorCode === 'EMAIL_ALREADY_EXISTS') {
          showToast('이미 사용 중인 이메일입니다.');
        } else if (errorCode === 'NICKNAME_ALREADY_EXISTS') {
          showToast('이미 사용 중인 닉네임입니다.');
        } else {
          showToast('회원가입 중 오류가 발생했습니다.');
        }
      } else {
        showToast('회원가입 중 오류가 발생했습니다.');
      }
      console.error('Signup failed:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
    >
      <SignupContent onSubmit={handleSignup} />
    </Modal>
  );
} 