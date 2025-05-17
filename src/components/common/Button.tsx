import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { ButtonProps } from '@/types/components';

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${spacing[2]};
  transition: all 0.2s;
  cursor: pointer;
  white-space: nowrap;
  font-family: ${typography.fontFamily.sans};
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  /* Variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${colors.primary[600]};
          color: ${colors.background.default};
          border: none;
          &:hover:not(:disabled) {
            background-color: ${colors.primary[700]};
          }
        `;
      case 'secondary':
        return `
          background-color: ${colors.gray[100]};
          color: ${colors.gray[800]};
          border: none;
          &:hover:not(:disabled) {
            background-color: ${colors.gray[200]};
          }
        `;
      case 'text':
        return `
          background: none;
          color: ${colors.gray[700]};
          border: none;
          padding: ${spacing[1]} ${spacing[2]};
          &:hover:not(:disabled) {
            color: ${colors.gray[500]};
          }
        `;
      case 'outline':
        return `
          background: none;
          color: ${colors.primary[600]};
          border: 1px solid ${colors.primary[600]};
          &:hover:not(:disabled) {
            background-color: ${colors.primary[50]};
          }
        `;
      default:
        return '';
    }
  }}

  /* Sizes */
  ${props => {
    if (props.variant === 'text') return '';
    switch (props.size) {
      case 'small':
        return `
          font-size: ${typography.fontSize.sm};
          padding: ${spacing[1.5]} ${spacing[3]};
        `;
      case 'medium':
        return `
          font-size: ${typography.fontSize.sm};
          padding: ${spacing[2]} ${spacing[4]};
        `;
      case 'large':
        return `
          font-size: ${typography.fontSize.base};
          padding: ${spacing[3]} ${spacing[6]};
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 