import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import LoginForm from './LoginForm';
import Button from '../common/Button';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';

const Container = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

const Header = styled.div`
  /* Typography */
  text-align: center;
`;

const Logo = styled.h1`
  /* Typography */
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};

  /* Box Model */
  margin-bottom: ${spacing[2]};
`;

const Subtitle = styled.p`
  /* Typography */
  color: ${colors.text.secondary};
`;

const LoginOptions = styled.div`
  /* Layout */
  display: flex;
  justify-content: space-between;

  /* Box Model */
  margin-top: ${spacing[2]};
`;

const Terms = styled.p`
  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  text-align: center;
`;

interface LoginContentProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSignupClick?: () => void;
}

export default function LoginContent({ onSubmit, onSignupClick }: LoginContentProps) {
  return (
    <Container>
      <Header>
        <Logo>CHANNELINK</Logo>
        <Subtitle>가장 빠른 비즈니스 채널 거래 플랫폼</Subtitle>
      </Header>
      
      <LoginForm onSubmit={onSubmit} />

      <div>
        <LoginOptions>
          <Button variant="text" size="small" onClick={onSignupClick}>
            이메일로 가입하기
          </Button>
          <Button variant="text" size="small">이메일 찾기</Button>
          <Button variant="text" size="small">비밀번호 찾기</Button>
        </LoginOptions>
      </div>
      
      <Terms>
        {/* 로그인하면 이용약관 및 개인정보보호방침에 동의하는 것으로 간주합니다. */}
      </Terms>
    </Container>
  );
} 