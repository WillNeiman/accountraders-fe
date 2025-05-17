import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import LoginForm from './LoginForm';
import Button from '../common/Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]};
`;

const Header = styled.div`
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: ${spacing[2]};
`;

const Subtitle = styled.p`
  color: #666;
`;

const LoginOptions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${spacing[2]};
`;

const Terms = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

interface LoginContentProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function LoginContent({ onSubmit }: LoginContentProps) {
  return (
    <Container>
      <Header>
        <Logo>ACCOUNTRADERS</Logo>
        <Subtitle>솔로건 들어가는 자리</Subtitle>
      </Header>
      
      <LoginForm onSubmit={onSubmit} />

      <div>
        <LoginOptions>
          <Button variant="text" size="small">이메일 가입</Button>
          <Button variant="text" size="small">이메일 찾기</Button>
          <Button variant="text" size="small">비밀번호 찾기</Button>
        </LoginOptions>
        
        <Button
          variant="secondary"
          fullWidth
          style={{ marginTop: spacing[4] }}
        >
          Google 계정으로 로그인
        </Button>
      </div>
      
      <Terms>
        로그인하면 이용약관 및 개인정보보호방침에 동의하는 것으로 간주합니다.
      </Terms>
    </Container>
  );
} 