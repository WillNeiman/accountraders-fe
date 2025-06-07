import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

export const Section = styled.section`
  margin-bottom: ${spacing[8]};
`;

export const SectionTitle = styled.h2`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[6]};
`;

export const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing[4]} 0;
  border-bottom: 1px solid ${colors.gray[200]};
`;

export const ItemLabel = styled.div`
  min-width: 150px;
  font-size: ${typography.fontSize.sm};
  color: ${colors.gray[400]};
  font-weight: ${typography.fontWeight.medium};
`;

export const ItemValue = styled.div`
  flex: 1;
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  margin-left: ${spacing[6]};
  word-break: break-all;
`;

export const EditButton = styled.button<{
  variant?: 'default' | 'primary' | 'error' | 'secondaryError' | 'success' | 'outline' | 'errorOutline';
}>`
  margin-left: ${spacing[4]};
  background: ${({ variant }) =>
    variant === 'secondaryError' ? colors.error.light :
    variant === 'success' ? colors.success.light :
    variant === 'outline' ? colors.background.default :
    variant === 'errorOutline' ? colors.background.default :
    'none'};
  border: 1px solid
    ${({ variant }) =>
      variant === 'primary'
        ? colors.primary[400]
        : variant === 'error'
        ? colors.error.main
        : variant === 'secondaryError'
        ? colors.error.light
        : variant === 'success'
        ? colors.success.main
        : variant === 'outline'
        ? colors.gray[300]
        : variant === 'errorOutline'
        ? colors.error.main
        : colors.gray[300]};
  border-radius: ${spacing[2]};
  color: ${({ variant }) =>
    variant === 'primary'
      ? colors.primary[600]
      : variant === 'error'
      ? colors.error.main
      : variant === 'secondaryError'
      ? colors.error.main
      : variant === 'success'
      ? colors.success.main
      : variant === 'outline'
      ? colors.gray[600]
      : variant === 'errorOutline'
      ? colors.error.main
      : colors.gray[400]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  padding: 0 ${spacing[4]};
  height: 32px;
  cursor: pointer;
  transition: border 0.2s, color 0.2s, background 0.2s;
  &:hover {
    border: 1px solid
      ${({ variant }) =>
        variant === 'primary'
          ? colors.primary[600]
          : variant === 'error'
          ? colors.error.dark
          : variant === 'secondaryError'
          ? colors.error.light
          : variant === 'success'
          ? colors.success.dark
          : variant === 'outline'
          ? colors.gray[400]
          : variant === 'errorOutline'
          ? colors.error.dark
          : colors.primary[400]};
    color: ${({ variant }) =>
      variant === 'primary'
        ? colors.primary[700]
        : variant === 'error'
        ? colors.error.dark
        : variant === 'secondaryError'
        ? colors.error.dark
        : variant === 'success'
        ? colors.success.dark
        : variant === 'outline'
        ? colors.gray[800]
        : variant === 'errorOutline'
        ? colors.error.dark
        : colors.primary[500]};
    background: ${({ variant }) =>
      variant === 'secondaryError' ? colors.error.light :
      variant === 'success' ? colors.success.light :
      variant === 'outline' ? colors.background.default :
      variant === 'errorOutline' ? colors.background.default :
      'none'};
  }
`;

export const InputWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: ${spacing[2]};
  margin-left: ${spacing[6]};
`;

export const WarningText = styled.p`
  color: ${colors.error.main};
  font-size: ${typography.fontSize.sm};
  margin-top: ${spacing[2]};
`; 