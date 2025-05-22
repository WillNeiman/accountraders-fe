import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { InputProps } from '@/types/components';

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const StyledInput = styled.input<{ error?: string }>`
  /* Layout */
  width: 100%;

  /* Box Model */
  padding: ${spacing[3]} ${spacing[4]};
  border: 1px solid ${props => props.error ? colors.error.main : colors.gray[300]};
  border-radius: ${spacing[2]};

  /* Visual */
  background-color: ${colors.background.default};
  outline: none;

  /* Typography */
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};

  /* Others */
  transition: all 0.2s;

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
`;

const Label = styled.label`
  font-size: ${typography.fontSize.sm};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[1]};
`;

const HelperText = styled.span<{ error?: boolean }>`
  font-size: ${typography.fontSize.sm};
  color: ${props => props.error ? colors.error.main : colors.text.secondary};
  margin-top: ${spacing[1]};
`;

const Input = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}: InputProps) => {
  const hasError = Boolean(error);

  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput
        className={className}
        error={error}
        {...props}
      />
      {(helperText || error) && (
        <HelperText error={hasError}>
          {error || helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
};

export default Input; 