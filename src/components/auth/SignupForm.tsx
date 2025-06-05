import { useState, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import Input from '@/components/common/Input';
import PasswordInput from '@/components/common/PasswordInput';
import { spacing } from '@/styles/theme/spacing';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { apiClient } from '@/services/api/client';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';

const Form = styled.form`
  /* Layout */
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const FormGroup = styled.div`
  /* Layout */
  display: flex;
  flex-direction: column;
  position: relative;

  /* Box Model */
  height: 75px;

  &.password-group {
    height: 95px;
    margin-bottom: ${spacing[2]};
  }
`;

const LabelContainer = styled.div`
  /* Layout */
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* Box Model */
  margin-bottom: ${spacing[0.5]};
`;

const Label = styled.label`
  /* Layout */
  display: flex;
  align-items: center;

  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};
`;

const RequiredMark = styled.span`
  /* Box Model */
  margin-left: ${spacing[1]};

  /* Typography */
  color: ${colors.error.main};
`;

const ValidationMessage = styled.span<{ isValid?: boolean; isError?: boolean }>`
  /* Typography */
  font-size: ${typography.fontSize.xs};
  color: ${props => {
    if (props.isError) return colors.error.main;
    return props.isValid ? colors.success.main : colors.gray[500];
  }};
`;

const InputRightIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 38px;
  display: flex;
  align-items: center;
  font-size: 16px;
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

  // 중복 검사 상태
  const [emailCheck, setEmailCheck] = useState<'idle'|'checking'|'valid'|'invalid'>('idle');
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [nicknameCheck, setNicknameCheck] = useState<'idle'|'checking'|'valid'|'invalid'>('idle');
  const [nicknameCheckMsg, setNicknameCheckMsg] = useState('');

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

    try {
      setIsLoading(true);
      await onSubmit({
        nickname,
        email,
        password,
      });
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nickname, email, password, isFormValid, onSubmit]);

  // 이메일 중복 검사
  const checkEmailDup = async () => {
    if (!isEmailValid) return;
    setEmailCheck('checking');
    setEmailCheckMsg('');
    try {
      const { data } = await apiClient.get('/api/v1/users/emails/check', { params: { email } });
      if (data) {
        setEmailCheck('valid');
        setEmailCheckMsg('사용 가능한 이메일입니다.');
      } else {
        setEmailCheck('invalid');
        setEmailCheckMsg('이미 사용 중인 이메일입니다.');
      }
    } catch {
      setEmailCheck('invalid');
      setEmailCheckMsg('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  };
  // 닉네임 중복 검사
  const checkNicknameDup = async () => {
    if (!isNicknameValid) return;
    setNicknameCheck('checking');
    setNicknameCheckMsg('');
    try {
      const { data } = await apiClient.get('/api/v1/users/nicknames/check', { params: { nickname } });
      if (data) {
        setNicknameCheck('valid');
        setNicknameCheckMsg('사용 가능한 닉네임입니다.');
      } else {
        setNicknameCheck('invalid');
        setNicknameCheckMsg('이미 사용 중인 닉네임입니다.');
      }
    } catch {
      setNicknameCheck('invalid');
      setNicknameCheckMsg('닉네임 중복 확인 중 오류가 발생했습니다.');
    }
  };

  // 이메일/닉네임 값이 바뀌면 중복 검사 상태 초기화
  useEffect(() => { setEmailCheck('idle'); setEmailCheckMsg(''); }, [email]);
  useEffect(() => { setNicknameCheck('idle'); setNicknameCheckMsg(''); }, [nickname]);

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup style={{ position: 'relative' }}>
        <LabelContainer>
          <Label>
            이메일<RequiredMark>*</RequiredMark>
          </Label>
          {touched.email && (
            <ValidationMessage
              isError={!isEmailValid || emailCheck === 'invalid'}
              isValid={isEmailValid && emailCheck === 'valid'}
            >
              {!isEmailValid
                ? '올바른 이메일 형식이 아닙니다'
                : emailCheck === 'invalid'
                  ? emailCheckMsg
                  : emailCheck === 'valid'
                    ? emailCheckMsg
                    : '올바른 이메일 형식입니다'}
            </ValidationMessage>
          )}
        </LabelContainer>
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          onBlur={() => { handleBlur('email'); if (isEmailValid) checkEmailDup(); }}
          placeholder="example@email.com"
          fullWidth
        />
        {emailCheck === 'checking' && (
          <InputRightIcon><FaSpinner className="spin" /></InputRightIcon>
        )}
        {emailCheck === 'valid' && (
          <InputRightIcon><FaCheckCircle color={colors.success.main} /></InputRightIcon>
        )}
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

      <FormGroup style={{ position: 'relative' }}>
        <LabelContainer>
          <Label>
            닉네임<RequiredMark>*</RequiredMark>
          </Label>
          {touched.nickname && (
            <ValidationMessage
              isError={!isNicknameValid || nicknameCheck === 'invalid'}
              isValid={isNicknameValid && nicknameCheck === 'valid'}
            >
              {!isNicknameValid
                ? '닉네임은 2-16자 사이여야 합니다'
                : nicknameCheck === 'invalid'
                  ? nicknameCheckMsg
                  : nicknameCheck === 'valid'
                    ? nicknameCheckMsg
                    : '사용 가능한 닉네임입니다'}
            </ValidationMessage>
          )}
        </LabelContainer>
        <Input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          onBlur={() => { handleBlur('nickname'); if (isNicknameValid) checkNicknameDup(); }}
          placeholder="2-16자 사이의 닉네임을 입력하세요"
          maxLength={16}
          fullWidth
        />
        {nicknameCheck === 'checking' && (
          <InputRightIcon><FaSpinner className="spin" /></InputRightIcon>
        )}
        {nicknameCheck === 'valid' && (
          <InputRightIcon><FaCheckCircle color={colors.success.main} /></InputRightIcon>
        )}
      </FormGroup>
    </Form>
  );
};

export default SignupForm; 