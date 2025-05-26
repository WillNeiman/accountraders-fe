import { forwardRef } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { zIndex } from '@/styles/theme/zIndex';
import { ModalProps } from '@/types/components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const Overlay = styled.div<{ isClosing?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${props => props.isClosing ? fadeOut : fadeIn} 0.3s ease-in-out forwards;
`;

const ModalContainer = styled.div<{ isClosing?: boolean; size?: 'small' | 'medium' | 'large' }>`
  background: ${colors.background.default};
  border-radius: ${spacing[2]};
  padding: ${spacing[10]};
  position: relative;
  width: 100%;
  max-width: ${props => {
    switch (props.size) {
      case 'small':
        return '400px';
      case 'large':
        return '800px';
      default:
        return '600px';
    }
  }};
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-in-out forwards;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${spacing[4]};
  right: ${spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.text.secondary};
  padding: ${spacing[1]};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text.primary};
  }
`;

const Title = styled.h2<{ align?: 'left' | 'center' | 'right' }>`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray[900]};
  margin-bottom: ${spacing[4]};
  text-align: ${props => props.align || 'left'};
`;

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ isOpen, onClose, title, children, size = 'medium', showCloseButton = true, titleAlign = 'left' }, ref) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer ref={ref} size={size}>
        {showCloseButton && (
          <CloseButton onClick={onClose} aria-label="닫기">
            ✕
          </CloseButton>
        )}
        {title && <Title align={titleAlign}>{title}</Title>}
        {children}
      </ModalContainer>
    </Overlay>
  );
});

Modal.displayName = 'Modal';

export default Modal; 