import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

// Button 컴포넌트 타입
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

// Input 컴포넌트 타입
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  hasError?: boolean;
}

// Modal 컴포넌트 타입
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
} 