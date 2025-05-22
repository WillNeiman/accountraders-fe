import { useState } from 'react';
import styled from '@emotion/styled';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';

const InputWrapper = styled.div`
  /* Layout */
  position: relative;

  /* Box Model */
  width: 100%;
`;

const ToggleButton = styled.button`
  /* Layout */
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: ${spacing[3]};
  top: 50%;
  transform: translateY(-50%);

  /* Box Model */
  padding: ${spacing[1]};

  /* Visual */
  background: none;
  border: none;

  /* Typography */
  color: ${colors.gray[500]};

  /* Others */
  cursor: pointer;

  &:hover {
    color: ${colors.gray[700]};
  }
`;

const StrengthContainer = styled.div`
  /* Box Model */
  margin-top: ${spacing[1]};
  margin-bottom: -${spacing[2]};
`;

const StrengthBar = styled.div`
  /* Box Model */
  height: ${spacing[1]};
  border-radius: ${spacing[0.5]};

  /* Visual */
  overflow: hidden;
`;

const StrengthIndicator = styled.div<{ strength: number }>`
  /* Box Model */
  height: 100%;
  width: ${props => {
    switch (props.strength) {
      case 0: return '0%';
      case 1: return '33.33%';
      case 2: return '66.66%';
      case 3: return '100%';
      default: return '0%';
    }
  }};

  /* Visual */
  background-color: ${props => {
    switch (props.strength) {
      case 1:
        return colors.error.main;
      case 2:
        return colors.warning.main;
      case 3:
        return colors.success.main;
      default:
        return colors.gray[200];
    }
  }};

  /* Others */
  transition: all 0.3s ease-in-out;
`;

const StrengthText = styled.p<{ strength: number }>`
  /* Box Model */
  margin: 4px 0 0;

  /* Typography */
  font-size: 12px;
  color: ${props => {
    switch (props.strength) {
      case 1:
        return colors.error.main;
      case 2:
        return colors.warning.main;
      case 3:
        return colors.success.main;
      default:
        return colors.gray[500];
    }
  }};
`;

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  showStrengthBar?: boolean;
}

const PasswordInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  showStrengthBar = false,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const calculatePasswordStrength = (password: string): number => {
    if (password.length === 0) { // 입력값이 없으면 strength는 0
      return 0;
    }
    // 1자 이상 6자 이하면 무조건 낮음(1)
    if (password.length > 0 && password.length <= 6) {
      return 1;
    }

    let strength = 0;
    if (/[A-Za-z]/.test(password)) strength++; // 문자 포함
    if (/[0-9]/.test(password)) strength++; // 숫자 포함
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++; // 특수문자 포함
    return strength;
  };

  const strength = calculatePasswordStrength(value);
  const strengthText = ['', '낮음', '보통', '강함'][strength];

  return (
    <div>
      <InputWrapper>
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder || "6자 이상의 비밀번호를 입력하세요"}
          label={label}
          error={error}
          fullWidth
        />
        <ToggleButton
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </ToggleButton>
      </InputWrapper>
      {showStrengthBar && (
        <StrengthContainer>
          <StrengthBar>
            <StrengthIndicator strength={strength} />
          </StrengthBar>
          {value.length > 0 && strengthText && (
            <StrengthText strength={strength}>
              {`비밀번호 강도: ${strengthText}`}
            </StrengthText>
          )}
        </StrengthContainer>
      )}
    </div>
  );
};

export default PasswordInput; 