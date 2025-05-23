import { memo, useCallback, useState, useId, KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { InputProps } from '@/types/components';
import { mediaQueries } from '@/styles/theme/breakpoints';

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  /* Layout */
  display: flex;
  flex-direction: column;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
`;

const InputContainer = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  position: relative;
`;

const StyledInput = styled.input<{ error?: string; hasLeftIcon?: boolean; hasRightIcon?: boolean }>`
  /* Layout */
  width: 100%;

  /* Box Model */
  padding: ${props => {
    const basePadding = `${spacing[3]} ${spacing[4]}`;
    if (props.hasLeftIcon && props.hasRightIcon) {
      return `${spacing[3]} ${spacing[10]}`;
    }
    if (props.hasLeftIcon) {
      return `${spacing[3]} ${spacing[4]} ${spacing[3]} ${spacing[10]}`;
    }
    if (props.hasRightIcon) {
      return `${spacing[3]} ${spacing[10]} ${spacing[3]} ${spacing[4]}`;
    }
    return basePadding;
  }};
  border: 1px solid ${props => props.error ? colors.error.main : colors.gray[300]};
  border-radius: ${spacing[2]};

  /* Visual */
  background-color: ${colors.background.default};
  outline: none;

  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};

  /* Others */
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: ${colors.gray[400]};
  }

  &:focus {
    border-color: ${props => props.error ? colors.error.main : colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.error ? colors.error.light : colors.primary[100]};
  }

  &:disabled {
    background-color: ${colors.gray[50]};
    cursor: not-allowed;
  }

  /* Responsive */
  ${mediaQueries.sm} {
    font-size: ${typography.fontSize.base};
    padding: ${spacing[3]} ${spacing[4]};
  }
`;

const Label = styled.label`
  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  font-weight: ${typography.fontWeight.medium};

  /* Box Model */
  margin-bottom: ${spacing[1]};
`;

const HelperText = styled.span<{ error?: boolean }>`
  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${props => props.error ? colors.error.main : colors.text.secondary};

  /* Box Model */
  margin-top: ${spacing[1]};
`;

const IconWrapper = styled.div<{ position: 'left' | 'right' }>`
  /* Layout */
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.position === 'left' ? 'left' : 'right'}: ${spacing[3]};
  top: 50%;
  transform: translateY(-50%);

  /* Typography */
  color: ${colors.gray[500]};
`;

const Input = memo(({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  validateOnBlur = false,
  validateOnChange = false,
  onValidation,
  leftIcon,
  rightIcon,
  id,
  onBlur,
  onChange,
  onKeyDown,
  disabled,
  required,
  ...props
}: InputProps) => {
  const [localError, setLocalError] = useState<string | undefined>(error);
  const inputId = useId();
  const helperId = useId();
  const hasError = Boolean(localError);

  const handleValidation = useCallback((value: string) => {
    if (onValidation) {
      const result = onValidation(value);
      if (typeof result === 'string') {
        setLocalError(result);
      } else if (!result) {
        setLocalError('유효하지 않은 입력입니다');
      } else {
        setLocalError(undefined);
      }
    }
  }, [onValidation]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (validateOnBlur) {
      handleValidation(e.target.value);
    }
    onBlur?.(e);
  }, [validateOnBlur, handleValidation, onBlur]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateOnChange) {
      handleValidation(e.target.value);
    }
    onChange?.(e);
  }, [validateOnChange, handleValidation, onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // 사용자 정의 키보드 이벤트 핸들러가 있다면 실행
    if (onKeyDown) {
      onKeyDown(e);
    }
  }, [disabled, onKeyDown]);

  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && (
        <Label htmlFor={id || inputId}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </Label>
      )}
      <InputContainer>
        {leftIcon && <IconWrapper position="left">{leftIcon}</IconWrapper>}
        <StyledInput
          id={id || inputId}
          className={className}
          error={localError}
          hasLeftIcon={Boolean(leftIcon)}
          hasRightIcon={Boolean(rightIcon)}
          aria-invalid={hasError}
          aria-describedby={helperId}
          aria-required={required}
          aria-disabled={disabled}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          required={required}
          tabIndex={disabled ? -1 : 0}
          {...props}
        />
        {rightIcon && <IconWrapper position="right">{rightIcon}</IconWrapper>}
      </InputContainer>
      {(helperText || localError) && (
        <HelperText id={helperId} error={hasError}>
          {localError || helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

export default Input; 