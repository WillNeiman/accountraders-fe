import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import { FiX, FiRefreshCw } from 'react-icons/fi';
import { ListingParams } from '@/types/features/listings';
import { formatPrice, formatNumber } from '@/utils/formatters';
import { theme } from '@/styles/theme';

interface FilterTagsScrollProps {
  filters: ListingParams;
  onRemoveFilter: (key: keyof ListingParams, value?: string) => void;
  onResetFilters: () => void;
  categories: { categoryId: string; categoryName: string }[];
}

interface Tag {
  key: string;
  label: string;
  value?: string;
}

const ScrollContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex: 1;
  min-width: 0;
  width: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  padding: ${spacing[1]} ${spacing[2]};
  background: ${colors.gray[100]};
  border: 1px solid ${colors.gray[300]};
  border-radius: ${spacing[5]};
  color: ${colors.text.primary};
  font-size: ${typography.fontSize.sm};
  white-space: nowrap;
  flex-shrink: 0;

  @media (min-width: ${theme.breakpoints.md}) {
    flex-shrink: 1;
  }
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing[0.5]};
  background: none;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};
  padding: ${spacing[1]} ${spacing[2]};
  background: ${colors.primary[50]};
  border: 1px solid ${colors.primary[200]};
  border-radius: ${spacing[5]};
  color: ${colors.primary[600]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${colors.primary[100]};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;

export const FilterTagsScroll = ({ filters, onRemoveFilter, onResetFilters, categories }: FilterTagsScrollProps) => {
  const tags: Tag[] = [];

  // Add category tags
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    filters.categoryIds.forEach(categoryId => {
      const category = categories.find(c => c.categoryId === categoryId);
      if (category) {
        tags.push({
          key: `categoryId-${categoryId}`,
          label: category.categoryName,
          value: categoryId
        });
      }
    });
  }

  // Add price range tag
  if (filters.minPrice || filters.maxPrice) {
    const minPrice = filters.minPrice ? formatPrice(filters.minPrice) : '0원';
    const maxPrice = filters.maxPrice ? formatPrice(filters.maxPrice) : '무제한';
    tags.push({
      key: 'price',
      label: `${minPrice} - ${maxPrice}`
    });
  }

  // Add subscriber range tag
  if (filters.minSubscribers || filters.maxSubscribers) {
    const minSubs = filters.minSubscribers ? formatNumber(filters.minSubscribers) : '0';
    const maxSubs = filters.maxSubscribers ? formatNumber(filters.maxSubscribers) : '무제한';
    tags.push({
      key: 'subscribers',
      label: `${minSubs}명 - ${maxSubs}명`
    });
  }

  if (tags.length === 0) return null;

  return (
    <ScrollContainer>
      <ResetButton onClick={onResetFilters}>
        <FiRefreshCw size={14} />
        초기화
      </ResetButton>
      {tags.map(({ key, label, value }) => (
        <FilterTag key={key}>
          {label}
          <RemoveButton
            onClick={() => {
              if (key.startsWith('categoryId-')) {
                onRemoveFilter('categoryIds', value);
              } else if (key === 'price') {
                onRemoveFilter('minPrice');
                onRemoveFilter('maxPrice');
              } else if (key === 'subscribers') {
                onRemoveFilter('minSubscribers');
                onRemoveFilter('maxSubscribers');
              }
            }}
            aria-label={`${label} 필터 제거`}
          >
            <FiX size={14} />
          </RemoveButton>
        </FilterTag>
      ))}
    </ScrollContainer>
  );
}; 