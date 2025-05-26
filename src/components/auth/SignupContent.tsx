import { useState } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
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
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  margin-bottom: ${spacing[2]};
`;

const Subtitle = styled.p`
  color: ${colors.text.secondary};
`;

const TermsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const TermsText = styled.p`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.secondary};
  text-align: center;
  margin-top: ${spacing[2]};
`;

const TermsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

const TermsLink = styled.a`
  color: ${colors.primary[500]};
  text-decoration: underline;
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  margin-left: ${spacing[2]};
`;

const RequiredMark = styled.span`
  color: ${colors.error.main};
`;

const OptionalMark = styled.span`
  color: ${colors.text.secondary};
`;

const SubmitButton = styled(Button)`
  margin-top: ${spacing[2]};
`;

const GoogleSignupButton = styled(Button)`
  margin-top: ${spacing[4]};
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
        <Logo>CHANNELINK</Logo>
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
              이용약관 동의 <RequiredMark>(필수)</RequiredMark>
              <TermsLink href="/terms/service" target="_blank">보기</TermsLink>
            </>}
          />
        </TermsRow>
        <TermsRow>
          <Checkbox
            checked={terms.privacy}
            onChange={e => handleTermChange('privacy', e.target.checked)}
            label={<>
              개인정보처리방침 동의 <RequiredMark>(필수)</RequiredMark>
              <TermsLink href="/terms/privacy" target="_blank">보기</TermsLink>
            </>}
          />
        </TermsRow>
        <TermsRow>
          <Checkbox
            checked={terms.marketing}
            onChange={e => handleTermChange('marketing', e.target.checked)}
            label={<>
              마케팅 정보 수신 동의 <OptionalMark>(선택)</OptionalMark>
              <TermsLink href="/terms/marketing" target="_blank">보기</TermsLink>
            </>}
          />
        </TermsRow>
        <TermsText>
          회원가입 시 필수 약관에 동의해야 합니다.
        </TermsText>
      </TermsContainer>
      <div>
        <SubmitButton
          type="submit"
          variant="primary"
          fullWidth
          disabled={!formState.isFormValid || formState.isLoading}
          onClick={() => {
            document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }}
        >
          {formState.isLoading ? '가입 중...' : '회원가입'}
        </SubmitButton>
        {/* 구글 회원가입 기능 임시 중단
        <GoogleSignupButton
          variant="secondary"
          fullWidth
        >
          Google 계정으로 가입
        </GoogleSignupButton>
        */}
      </div>
    </Container>
  );
} 