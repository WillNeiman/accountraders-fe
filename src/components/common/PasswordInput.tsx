import { useState } from 'react';
import styled from '@emotion/styled';
import { Eye, EyeOff } from 'lucide-react';
import Input from './Input';
import { colors } from '@/styles/theme/colors';

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${colors.gray[500]};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${colors.gray[700]};
  }
`;

const StrengthContainer = styled.div`
  margin-top: 4px;
  margin-bottom: -8px;
`;

const StrengthBar = styled.div`
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
`;

const StrengthIndicator = styled.div<{ strength: number }>`
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
  transition: all 0.3s ease-in-out;
`;

const StrengthText = styled.p<{ strength: number }>`
  margin: 4px 0 0;
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