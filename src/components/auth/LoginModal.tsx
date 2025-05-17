import Modal from '@/components/common/Modal';
import { login } from '@/services/auth';
import LoginContent from './LoginContent';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="small"
    >
      <LoginContent onSubmit={handleLogin} />
    </Modal>
  );
} 