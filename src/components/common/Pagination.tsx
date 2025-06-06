'use client';

import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing[2]};
  margin-top: ${spacing[6]};
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: ${spacing[2]} ${spacing[4]};
  border: 1px solid ${({ active }) => (active ? colors.primary[600] : colors.gray[300])};
  background: ${({ active }) => (active ? colors.primary[50] : 'white')};
  color: ${({ active }) => (active ? colors.primary[700] : colors.text.secondary)};
  border-radius: ${spacing[1]};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${colors.primary[50]};
    border-color: ${colors.primary[500]};
  }

  &:disabled {
    background: ${colors.gray[100]};
    border-color: ${colors.gray[300]};
    color: ${colors.gray[400]};
    cursor: not-allowed;
  }
`;

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <Container>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        이전
      </PageButton>
      {Array.from({ length: totalPages }, (_, i) => (
        <PageButton
          key={i}
          active={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </PageButton>
      ))}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        다음
      </PageButton>
    </Container>
  );
} 