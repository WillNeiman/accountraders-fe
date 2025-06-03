import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

// Button 컴포넌트 타입
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loadingText?: string;
}

// Input 컴포넌트 타입
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  hasError?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  mask?: string;
  maskPlaceholder?: string;
  autoComplete?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onValidation?: (value: string) => boolean | string;
}

// Modal 컴포넌트 타입
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
  titleAlign?: 'left' | 'center' | 'right';
  hasUnsavedChanges?: boolean;
  unsavedChangesMessage?: string;
  isLoading?: boolean;
  preventCloseWhenLoading?: boolean;
} 