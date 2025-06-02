import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import { FiSliders } from 'react-icons/fi';

interface FilterHeaderProps {
  onFilterClick: () => void;
}

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  flex-shrink: 0;
  width: auto;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[1]} ${spacing[2]};
  background: none;
  border: none;
  color: ${colors.text.primary};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${colors.primary[600]};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const FilterHeader = ({ onFilterClick }: FilterHeaderProps) => {
  return (
    <HeaderContainer>
      <FilterButton onClick={onFilterClick}>
        <FiSliders size={16} />
        필터
      </FilterButton>
    </HeaderContainer>
  );
}; 