import { useState } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import SignupForm from './SignupForm';
import Button from '../common/Button';
import Checkbox from '../common/Checkbox';

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

const TermsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const TermsText = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: ${spacing[2]};
`;

const TermsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TermsLink = styled.a`
  color: #0070f3;
  text-decoration: underline;
  font-size: 13px;
  cursor: pointer;
  margin-left: ${spacing[2]};
`;

interface SignupContentProps {
  onSubmit: (data: {
    nickname: string;
    email: string;
    password: string;
    fullName?: string;
    profilePictureUrl?: string;
  }) => Promise<void>;
}

export default function SignupContent({ onSubmit }: SignupContentProps) {
  // 개별 동의 상태
  const [terms, setTerms] = useState({
    all: false,
    service: false, // 이용약관(필수)
    privacy: false, // 개인정보처리방침(필수)
    marketing: false, // 마케팅 정보 수신(선택)
  });

  // 전체 동의 핸들러
  const handleAllChange = (checked: boolean) => {
    setTerms({
      all: checked,
      service: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  // 개별 동의 핸들러
  const handleTermChange = (key: keyof typeof terms, checked: boolean) => {
    const next = { ...terms, [key]: checked };
    next.all = next.service && next.privacy && next.marketing;
    setTerms(next);
  };

  const [formState, setFormState] = useState({ isFormValid: false, isLoading: false });

  return (
    <Container>
      <Header>
        <Logo>ACCOUNTRADERS</Logo>
        <Subtitle>회원가입</Subtitle>
      </Header>
      <SignupForm 
        onSubmit={onSubmit} 
        termsAgreed={terms.service && terms.privacy}
        onFormStateChange={setFormState}
      />
      <TermsContainer>
        <Checkbox
          checked={terms.all}
          onChange={e => handleAllChange(e.target.checked)}
          label={<b>전체 동의</b>}
        />
        <TermsRow>
          <Checkbox
            checked={terms.service}
            onChange={e => handleTermChange('service', e.target.checked)}
            label={<>
              이용약관 동의 <span style={{color:'#ff4444'}}>(필수)</span>
              <TermsLink href="/terms/service" target="_blank">보기</TermsLink>
            </>}
          />
        </TermsRow>
        <TermsRow>
          <Checkbox
            checked={terms.privacy}
            onChange={e => handleTermChange('privacy', e.target.checked)}
            label={<>
              개인정보처리방침 동의 <span style={{color:'#ff4444'}}>(필수)</span>
              <TermsLink href="/terms/privacy" target="_blank">보기</TermsLink>
            </>}
          />
        </TermsRow>
        <TermsRow>
          <Checkbox
            checked={terms.marketing}
            onChange={e => handleTermChange('marketing', e.target.checked)}
            label={<>
              마케팅 정보 수신 동의 <span style={{color:'#888'}}>(선택)</span>
              <TermsLink href="/terms/marketing" target="_blank">보기</TermsLink>
            </>}
          />
        </TermsRow>
        <TermsText>
          회원가입 시 필수 약관에 동의해야 합니다.
        </TermsText>
      </TermsContainer>
      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          style={{ marginTop: spacing[2] }}
          disabled={!formState.isFormValid || formState.isLoading}
          onClick={() => {
            document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }}
        >
          {formState.isLoading ? '가입 중...' : '회원가입'}
        </Button>
        {/* 구글 회원가입 기능 임시 중단
        <Button
          variant="secondary"
          fullWidth
          style={{ marginTop: spacing[4] }}
        >
          Google 계정으로 가입
        </Button>
        */}
      </div>
    </Container>
  );
} 