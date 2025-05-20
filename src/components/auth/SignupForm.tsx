import { useState, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import Input from '@/components/common/Input';
import PasswordInput from '@/components/common/PasswordInput';
import { spacing } from '@/styles/theme/spacing';
import { colors } from '@/styles/theme/colors';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 75px;

  &.password-group {
    height: 95px;
    margin-bottom: ${spacing[2]};
  }
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const RequiredMark = styled.span`
  color: #ff4444;
  margin-left: 4px;
`;

const ValidationMessage = styled.span<{ isValid?: boolean; isError?: boolean }>`
  font-size: 13px;
  color: ${props => {
    if (props.isError) return colors.error.main;
    return props.isValid ? colors.success.main : colors.gray[500];
  }};
`;

interface SignupFormProps {
  onSubmit: (data: {
    nickname: string;
    email: string;
    password: string;
    profilePictureUrl?: string;
  }) => Promise<void>;
  termsAgreed: boolean;
  onFormStateChange?: (state: { isFormValid: boolean; isLoading: boolean }) => void;
}

const SignupForm = ({ onSubmit, termsAgreed, onFormStateChange }: SignupFormProps) => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 필드별 검증 상태
  const [touched, setTouched] = useState({
    nickname: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const isNicknameValid = nickname.length >= 2 && nickname.length <= 16;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword;
  const isFormValid = isNicknameValid && isEmailValid && isPasswordValid && doPasswordsMatch && termsAgreed;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange({ isFormValid, isLoading });
    }
  }, [isFormValid, isLoading, onFormStateChange]);

  // SQL 인젝션 및 XSS 방지를 위한 문자 필터링
  const filterInjectionChars = (value: string) => {
    return value.replace(/['";`<>]/g, '');
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterInjectionChars(e.target.value);
    if (filtered.length <= 16) {
      setNickname(filtered);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterInjectionChars(e.target.value);
    setEmail(filtered);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterInjectionChars(e.target.value);
    setPassword(filtered);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterInjectionChars(e.target.value);
    setConfirmPassword(filtered);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await onSubmit({
        nickname,
        email,
        password,
      });
    } finally {
      setIsLoading(false);
    }
  }, [nickname, email, password, isFormValid, onSubmit]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <LabelContainer>
          <Label>
            이메일<RequiredMark>*</RequiredMark>
          </Label>
          {touched.email && (
            <ValidationMessage isError={!isEmailValid}>
              {!isEmailValid ? "올바른 이메일 형식이 아닙니다" : "올바른 이메일 형식입니다"}
            </ValidationMessage>
          )}
        </LabelContainer>
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => handleBlur('email')}
          placeholder="example@email.com"
          fullWidth
        />
      </FormGroup>

      <FormGroup className="password-group">
        <LabelContainer>
          <Label>
            비밀번호<RequiredMark>*</RequiredMark>
          </Label>
          {touched.password && (
            <ValidationMessage isError={!isPasswordValid}>
              {!isPasswordValid ? "비밀번호는 6자 이상이어야 합니다" : "사용 가능한 비밀번호입니다"}
            </ValidationMessage>
          )}
        </LabelContainer>
        <PasswordInput
          value={password}
          onChange={handlePasswordChange}
          onBlur={() => handleBlur('password')}
          placeholder="6자 이상의 비밀번호를 입력하세요"
          showStrengthBar
        />
      </FormGroup>

      <FormGroup>
        <LabelContainer>
          <Label>
            비밀번호 확인<RequiredMark>*</RequiredMark>
          </Label>
          {touched.confirmPassword && (
            <ValidationMessage isError={!doPasswordsMatch || !isPasswordValid}>
              {password.length === 0 
                ? "비밀번호를 먼저 입력해주세요"
                : !isPasswordValid
                ? "비밀번호는 6자 이상이어야 합니다"
                : !doPasswordsMatch 
                  ? "비밀번호가 일치하지 않습니다" 
                  : "비밀번호가 일치합니다"}
            </ValidationMessage>
          )}
        </LabelContainer>
        <PasswordInput
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onBlur={() => handleBlur('confirmPassword')}
          placeholder="비밀번호를 한 번 더 입력하세요"
        />
      </FormGroup>

      <FormGroup>
        <LabelContainer>
          <Label>
            닉네임<RequiredMark>*</RequiredMark>
          </Label>
          {touched.nickname && (
            <ValidationMessage isError={!isNicknameValid}>
              {!isNicknameValid ? "닉네임은 2-16자 사이여야 합니다" : "사용 가능한 닉네임입니다"}
            </ValidationMessage>
          )}
        </LabelContainer>
        <Input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          onBlur={() => handleBlur('nickname')}
          placeholder="2-16자 사이의 닉네임을 입력하세요"
          maxLength={16}
          fullWidth
        />
      </FormGroup>
    </Form>
  );
};

export default SignupForm; 