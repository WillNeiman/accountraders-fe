import styled from '@emotion/styled';
import React from 'react';
import { typography } from '@/styles/theme/typography';
import { spacing, borderRadius } from '@/styles/theme/spacing';

export type LabelColorType = 'success' | 'error' | 'warning';

interface LabelProps {
  colorType: LabelColorType;
  children: React.ReactNode;
  className?: string;
}

const colorMap = {
  success: {
    bg: '#E6F9ED',
    color: '#1BA94C',
    border: '#B6F2D2',
  },
  error: {
    bg: '#FDEAEA',
    color: '#E03A3E',
    border: '#F5C2C7',
  },
  warning: {
    bg: '#FFF8E1',
    color: '#FFB300',
    border: '#FFE082',
  },
};

const StyledLabel = styled.span<{ colorType: LabelColorType }>`
  display: inline-block;
  padding: ${spacing[1]} ${spacing[3]};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.medium};
  border-radius: ${borderRadius.full};
  background: ${({ colorType }) => colorMap[colorType].bg};
  color: ${({ colorType }) => colorMap[colorType].color};
  border: 1px solid ${({ colorType }) => colorMap[colorType].border};
  vertical-align: middle;
`;

const Label = ({ colorType, children, className }: LabelProps) => (
  <StyledLabel colorType={colorType} className={className}>
    {children}
  </StyledLabel>
);

export default Label; 