import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';
import { mediaQueries } from '@/styles/theme/breakpoints';
import React from 'react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backText?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

const HeaderWrapper = styled.header`
  width: 100%;
  background: ${colors.background.paper};
  display: none;

  ${mediaQueries.md} {
    display: block;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing[2]};
  padding: ${spacing[6]} ${spacing[4]};
  max-width: 1200px;
  margin: 0 auto;

  ${mediaQueries.lg} {
    padding: ${spacing[8]} ${spacing[6]};
  }
`;

const Title = styled.h1`
  font-size: ${typography.fontSize.xl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0;

  ${mediaQueries.lg} {
    font-size: ${typography.fontSize['2xl']};
  }
`;

const BackButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const BackButtonUnderline = styled.div`
  width: 100%;
  height: 1px;
  background: ${colors.divider};
  margin-top: ${spacing[1]};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  background: none;
  border: none;
  color: ${colors.primary[600]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  padding: ${spacing[1]} ${spacing[2]};
  border-radius: ${spacing[2]};
  transition: background 0.2s;
  margin-top: ${spacing[2]};

  &:hover {
    background: ${colors.primary[50]};
  }

  ${mediaQueries.lg} {
    font-size: ${typography.fontSize.base};
  }
`;

export default function PageHeader({ title, showBack, backText = '뒤로가기', onBack, children }: PageHeaderProps) {
  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Title>{title}</Title>
        {showBack ? (
          <BackButtonWrapper>
            <BackButton onClick={onBack}>
              <span aria-hidden="true" style={{ fontSize: '1.2em', lineHeight: 1 }}>&larr;</span>
              {backText}
            </BackButton>
            <BackButtonUnderline />
          </BackButtonWrapper>
        ) : null}
        {children}
      </HeaderContainer>
    </HeaderWrapper>
  );
} 