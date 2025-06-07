'use client';

import { useEffect } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { zIndex } from '@/styles/theme/zIndex';
import { shadows } from '@/styles/theme/shadows';
import Image from 'next/image';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: ${zIndex.modal};
  padding: ${spacing[4]};
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: ${spacing[2]};
  box-shadow: ${shadows.lg};
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${spacing[2]};
  right: ${spacing[2]};
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: ${spacing[1]};
  width: ${spacing[8]};
  height: ${spacing[8]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

export default function ImageModal({ isOpen, imageUrl, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="닫기">
          ✕
        </CloseButton>
        <Image
          src={imageUrl}
          alt="상세 이미지"
          width={1200}
          height={800}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </ModalContent>
    </ModalOverlay>
  );
} 