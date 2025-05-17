import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { spacing } from '@/styles/theme/spacing';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing[4]};
`;

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isEmailValid && password.trim() !== '';

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      await onSubmit(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, isFormValid, onSubmit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="이메일 주소"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>
    </Form>
  );
};

export default LoginForm; 