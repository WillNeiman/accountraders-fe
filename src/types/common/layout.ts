import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface ErrorProps {
  error: Error;
  reset: () => void;
} 