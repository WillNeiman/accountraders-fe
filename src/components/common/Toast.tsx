"use client";

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { zIndex } from '@/styles/theme/zIndex';

const slideIn = keyframes`
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ isClosing: boolean }>`
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: ${colors.gray[800]};
  color: white;
  padding: ${spacing[4]} ${spacing[6]};
  border-radius: ${spacing[2]};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: ${zIndex.toast};
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-in-out forwards;
  max-width: 90%;
  width: auto;
  text-align: center;
  
  /* 데스크탑 */
  bottom: ${spacing[8]};
  
  /* 개발자 도구가 열려있을 때를 포함한 반응형 처리 */
  @media (max-height: 800px) {
    bottom: ${spacing[4]};
  }
  
  /* 모바일 */
  @media (max-width: 768px) {
    bottom: ${spacing[4]};
    max-width: calc(100% - ${spacing[4]} * 2);
    padding: ${spacing[3]} ${spacing[4]};
    font-size: 14px;
  }
  
  @media (min-width: 769px) {
    max-width: 400px;
  }
`;

interface ToastProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, duration = 3000, onClose }: ToastProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClosing(true);
      setTimeout(onClose, 300); // 애니메이션이 끝난 후 제거
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer isClosing={isClosing}>
      {message}
    </ToastContainer>
  );
};

export default Toast; 