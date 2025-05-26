import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

export const MyContainer = styled.div`
  padding: ${spacing[6]};
`;

export const PageHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: ${spacing[8]};
`;

export const PageTitle = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

export const PageDescription = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.text.secondary};
`;

export const ContentGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  align-items: flex-start;
  gap: ${spacing[2]};

  @media (min-width: 768px) {
    grid-template-columns: 180px 1fr;
  }
  @media (min-width: 1024px) {
    grid-template-columns: 280px 1fr;
  }
`;

export const Sidebar = styled.nav`
  background: ${colors.background.paper};
  border-radius: ${spacing[2]};
  width: 280px;

  @media (max-width: 1023px) {
    width: 180px;
  }
  @media (max-width: 767px) {
    display: none;
  }
`;

export const MainContent = styled.main`
  background: ${colors.background.paper};
  border-radius: ${spacing[2]};
  padding: ${spacing[6]};
  min-height: 600px;
`; 