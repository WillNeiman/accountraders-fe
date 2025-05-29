'use client';

import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

export const Section = styled.section`
  /* Layout */
  margin-bottom: ${spacing[5]};
`;

export const SectionTitle = styled.h2`
  /* Typography */
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[4]};
`;

export const InfoGrid = styled.div`
  /* Layout */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  /* Layout */
  margin-bottom: ${spacing[1]};
`;

export const Label = styled.label`
  /* Typography */
  display: block;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing[2]};
`;

export const Value = styled.div`
  /* Typography */
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  /* Box Model */
  padding: ${spacing[3]};
  background: ${colors.background.gray};
  border-radius: ${spacing[2]};
`;

export const ButtonGroup = styled.div`
  /* Layout */
  display: flex;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[10]};
`; 