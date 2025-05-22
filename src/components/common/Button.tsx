import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { ButtonProps } from '@/types/components';

const StyledButton = styled.button<ButtonProps>`
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  white-space: nowrap;
  min-width: ${props => props.size === 'small' ? '80px' : props.size === 'medium' ? '100px' : '120px'};

  /* Box Model */
  border-radius: ${spacing[2]};
  border: none;
  padding: ${props => {
    if (props.variant === 'text') return `${spacing[1]} ${spacing[2]}`;
    switch (props.size) {
      case 'small': return `${spacing[1.5]} ${spacing[3]}`;
      case 'medium': return `${spacing[2]} ${spacing[4]}`;
      case 'large': return `${spacing[3]} ${spacing[6]}`;
      default: return `${spacing[2]} ${spacing[4]}`;
    }
  }};

  /* Typography */
  font-family: ${typography.fontFamily.sans};
  font-weight: ${typography.fontWeight.medium};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return typography.fontSize.sm;
      case 'medium': return typography.fontSize.sm;
      case 'large': return typography.fontSize.base;
      default: return typography.fontSize.sm;
    }
  }};

  /* Visual */
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return colors.primary[600];
      case 'secondary': return colors.gray[100];
      case 'text': return 'transparent';
      case 'outline': return 'transparent';
      default: return colors.primary[600];
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return colors.background.default;
      case 'secondary': return colors.gray[800];
      case 'text': return colors.gray[700];
      case 'outline': return colors.primary[600];
      default: return colors.background.default;
    }
  }};
  border: ${props => props.variant === 'outline' ? `1px solid ${colors.primary[600]}` : 'none'};

  /* Others */
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;

  /* States */
  &:hover:not(:disabled) {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return colors.primary[700];
        case 'secondary': return colors.gray[200];
        case 'text': return 'transparent';
        case 'outline': return colors.primary[50];
        default: return colors.primary[700];
      }
    }};
    color: ${props => {
      switch (props.variant) {
        case 'text': return colors.gray[500];
        default: return props.variant === 'primary' ? colors.background.default : colors.gray[800];
      }
    }};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Loading State */
  ${props => props.isLoading && `
    color: transparent;
    pointer-events: none;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin: -8px 0 0 -8px;
      border: 2px solid ${props.variant === 'primary' ? colors.background.default : colors.primary[600]};
      border-right-color: transparent;
      border-radius: 50%;
      animation: button-loading-spinner 0.75s linear infinite;
    }
  `}

  @keyframes button-loading-spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  loadingText,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const content = isLoading ? loadingText || children : children;
  
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isLoading={isLoading}
      className={className}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {!isLoading && leftIcon}
      {content}
      {!isLoading && rightIcon}
    </StyledButton>
  );
};

export default Button; 