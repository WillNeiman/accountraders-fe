import { forwardRef, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { ModalProps } from '@/types/components';
import { zIndex } from '@/styles/theme/zIndex';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
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
  from { opacity: 1; }
  to { opacity: 0; }
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
  z-index: ${zIndex.modalBackdrop};
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
  z-index: ${zIndex.modal};
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

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium', 
  showCloseButton = true, 
  titleAlign = 'left',
  hasUnsavedChanges = false,
  unsavedChangesMessage = '작성 중인 내용이 있습니다. 정말로 닫으시겠습니까?',
  isLoading = false,
  preventCloseWhenLoading = false
}, ref) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const isPotentialDragRef = useRef(false);

  const attemptClose = () => {
    if (isLoading && preventCloseWhenLoading) {
      return;
    }

    if (hasUnsavedChanges) {
      if (window.confirm(unsavedChangesMessage)) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleOverlayMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      isPotentialDragRef.current = false;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleModalContentMouseDown = () => {
    isPotentialDragRef.current = true;
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (dragStartPos.current) {
        const dx = Math.abs(e.clientX - dragStartPos.current.x);
        const dy = Math.abs(e.clientY - dragStartPos.current.y);
        if (dx > 5 || dy > 5) {
          isPotentialDragRef.current = true;
        }
      }
    };

    if (isOpen) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isOpen]);

  const handleOverlayMouseUp = () => {
    if (dragStartPos.current) {
      dragStartPos.current = null;
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (!isPotentialDragRef.current) {
        attemptClose();
      }
    }
    isPotentialDragRef.current = false;
    dragStartPos.current = null;
  };

  if (!isOpen) return null;

  return (
    <Overlay
      onMouseDown={handleOverlayMouseDown}
      onMouseUp={handleOverlayMouseUp}
      onClick={handleOverlayClick}
    >
      <ModalContainer
        ref={(node) => {
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          modalRef.current = node;
        }}
        size={size}
        onMouseDown={handleModalContentMouseDown}
      >
        {showCloseButton && (
          <CloseButton onClick={attemptClose} aria-label="닫기">
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