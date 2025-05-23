import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { spacing } from '@/styles/theme/spacing';
import { typography } from '@/styles/theme/typography';

interface FilterButtonProps {
  onClick: () => void;
  size?: 'default' | 'large';
}

const Button = styled.button<{ size: 'default' | 'large' }>`
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing[2]};
  height: 32px;
  width: auto;
  align-self: flex-start;
  margin-left: ${spacing[5]};

  /* Box Model */
  padding: ${props => props.size === 'large' ? spacing[3] : spacing[1.5]} ${props => props.size === 'large' ? spacing[5] : spacing[3]};
  border: none;
  border-radius: 20px;

  /* Visual */
  background-color: ${colors.primary[600]};

  /* Typography */
  font-size: ${props => props.size === 'large' ? typography.fontSize.base : typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  color: white;

  /* Others */
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.primary[700]};
  }

  svg {
    width: ${props => props.size === 'large' ? '20px' : '16px'};
    height: ${props => props.size === 'large' ? '20px' : '16px'};
  }
`;

const FilterButton = ({ onClick, size = 'default' }: FilterButtonProps) => {
  return (
    <Button onClick={onClick} size={size}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      필터
    </Button>
  );
};

export default FilterButton; 