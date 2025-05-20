import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';

interface ListingFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

interface FilterValues {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minSubscribers?: number;
  maxSubscribers?: number;
  sortBy?: 'price' | 'subscribers' | 'views' | 'recent';
}

const FilterContainer = styled.div`
  padding: ${spacing[4]};
  background: white;
  border: 1px solid ${colors.gray[200]};
  border-radius: 8px;
`;

const FilterSection = styled.div`
  margin-bottom: ${spacing[4]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterTitle = styled.h3`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

const Select = styled.select`
  width: 100%;
  padding: ${spacing[2]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
  }
`;

const RangeInputContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
`;

const RangeInput = styled.input`
  width: 100%;
  padding: ${spacing[2]};
  border: 1px solid ${colors.gray[300]};
  border-radius: 4px;
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${colors.primary[500]};
  }
`;

const ListingFilters = ({ onFilterChange }: ListingFiltersProps) => {
  return (
    <FilterContainer>
      <FilterSection>
        <FilterTitle>카테고리</FilterTitle>
        <Select onChange={(e) => onFilterChange({ category: e.target.value })}>
          <option value="">전체</option>
          <option value="game">게임</option>
          <option value="entertainment">엔터테인먼트</option>
          <option value="education">교육</option>
          <option value="music">음악</option>
          {/* API 연동 후 동적으로 카테고리 추가 */}
        </Select>
      </FilterSection>

      <FilterSection>
        <FilterTitle>가격 범위</FilterTitle>
        <RangeInputContainer>
          <RangeInput
            type="number"
            placeholder="최소"
            onChange={(e) => onFilterChange({ minPrice: Number(e.target.value) })}
          />
          <RangeInput
            type="number"
            placeholder="최대"
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
          />
        </RangeInputContainer>
      </FilterSection>

      <FilterSection>
        <FilterTitle>구독자 수</FilterTitle>
        <RangeInputContainer>
          <RangeInput
            type="number"
            placeholder="최소"
            onChange={(e) => onFilterChange({ minSubscribers: Number(e.target.value) })}
          />
          <RangeInput
            type="number"
            placeholder="최대"
            onChange={(e) => onFilterChange({ maxSubscribers: Number(e.target.value) })}
          />
        </RangeInputContainer>
      </FilterSection>

      <FilterSection>
        <FilterTitle>정렬</FilterTitle>
        <Select onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterValues['sortBy'] })}>
          <option value="recent">최신순</option>
          <option value="price">가격순</option>
          <option value="subscribers">구독자순</option>
          <option value="views">조회수순</option>
        </Select>
      </FilterSection>
    </FilterContainer>
  );
};

export default ListingFilters; 