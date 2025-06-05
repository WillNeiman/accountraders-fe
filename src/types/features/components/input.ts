import { InputHTMLAttributes, ReactNode } from 'react';

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