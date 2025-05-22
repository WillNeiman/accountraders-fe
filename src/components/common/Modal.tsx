import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { zIndex } from '@/styles/theme/zIndex';
import { ModalProps } from '@/types/components';

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray[900]}80;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease-in-out;
  z-index: ${zIndex.modal};
`;

const ModalWrapper = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  width: ${props => {
    switch (props.size) {
      case 'small':
        return '400px';
      case 'large':
        return '800px';
      default:
        return '600px';
    }
  }};
  max-width: 90%;
  max-height: 90vh;
  position: relative;
  overflow: hidden;
  border-radius: ${spacing[4]};
`;

const ModalContainer = styled.div<{ isOpen: boolean }>`
  background-color: ${colors.background.default};
  padding: ${spacing[6]};
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: ${props => props.isOpen ? 'scale(1)' : 'scale(0.9)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: all 0.3s ease-in-out;
  user-select: text;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.gray[300]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.gray[400]};
  }
`;

const CloseButton = styled.button`
  /* Layout */
  position: absolute;
  top: ${spacing[4]};
  right: ${spacing[4]};

  /* Box Model */
  padding: ${spacing[2]};
  border: none;

  /* Visual */
  background: none;

  /* Typography */
  color: ${colors.gray[500]};

  /* Others */
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${colors.gray[700]};
  }
`;

const Title = styled.h2<{ align?: 'left' | 'center' | 'right' }>`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray[900]};
  margin-bottom: ${spacing[4]};
  text-align: ${props => props.align || 'left'};
`;

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  showCloseButton = true,
  titleAlign = 'left',
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      isDraggingRef.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDraggingRef.current && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
    isDraggingRef.current = false;
  };

  if (!isOpen) return null;

  return (
    <Overlay 
      isOpen={isOpen} 
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <ModalWrapper size={size}>
        <ModalContainer
          ref={modalRef}
          isOpen={isOpen}
        >
          {showCloseButton && (
            <CloseButton onClick={onClose}>
              ✕
            </CloseButton>
          )}
          {title && <Title align={titleAlign}>{title}</Title>}
          {children}
        </ModalContainer>
      </ModalWrapper>
    </Overlay>
  );
};

export default Modal; 