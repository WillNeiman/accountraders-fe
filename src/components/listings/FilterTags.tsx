"use client";

import { memo, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import { ListingParams } from '@/types/listings';
import { SORT_OPTIONS, DEFAULT_SORT } from '@/constants/filters';
import { formatPrice, formatNumber } from '@/utils/formatters';

interface FilterTagsProps {
  filters: ListingParams;
  onRemoveFilter: (key: keyof ListingParams, value?: string) => void;
  categories: { categoryId: string; categoryName: string }[];
}

const FilterTagsContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
  flex-wrap: wrap;
`;

const FilterTag = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  height: 32px;

  /* Box Model */
  padding: ${spacing[1.5]} ${spacing[3]};
  border: 1px solid ${colors.primary[100]};
  border-radius: 20px;

  /* Visual */
  background-color: ${colors.primary[50]};

  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${colors.primary[700]};
`;

const RemoveButton = styled.button`
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Box Model */
  padding: 0;
  
  /* Visual */
  background: none;
  border: none;
  color: ${colors.primary[400]};
  
  /* Others */
  cursor: pointer;
  
  &:hover {
    color: ${colors.primary[600]};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FilterTags = memo(({ filters, onRemoveFilter, categories }: FilterTagsProps) => {
  const handleRemoveFilter = useCallback((key: keyof ListingParams, value?: string) => {
    onRemoveFilter(key, value);
  }, [onRemoveFilter]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent, key: keyof ListingParams, value?: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRemoveFilter(key, value);
    }
  }, [handleRemoveFilter]);

  const tags = useMemo(() => {
    const result: { key: string; label: string; value?: string; isDefault?: boolean }[] = [];

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      filters.categoryIds.forEach(id => {
        const cat = categories.find(c => c.categoryId === id);
        if (cat) {
          result.push({
            key: `categoryId-${id}`,
            label: cat.categoryName,
            value: id,
          });
        }
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      const priceLabel = filters.minPrice && filters.maxPrice
        ? `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`
        : filters.minPrice
          ? `${formatPrice(filters.minPrice)} 이상`
          : `${formatPrice(filters.maxPrice!)} 이하`;
      result.push({ key: 'price', label: priceLabel, value: undefined });
    }

    if (filters.minSubscribers || filters.maxSubscribers) {
      const subsLabel = filters.minSubscribers && filters.maxSubscribers
        ? `${formatNumber(filters.minSubscribers)} - ${formatNumber(filters.maxSubscribers)}`
        : filters.minSubscribers
          ? `${formatNumber(filters.minSubscribers)} 이상`
          : `${formatNumber(filters.maxSubscribers!)} 이하`;
      result.push({ key: 'subscribers', label: subsLabel, value: undefined });
    }

    if (filters.sort && filters.sort.length > 0) {
      filters.sort.forEach(sort => {
        const sortLabel = SORT_OPTIONS[sort];
        if (sortLabel) {
          result.push({
            key: `sort-${sort}`,
            label: sortLabel,
            isDefault: sort === DEFAULT_SORT && filters.sort?.length === 1
          });
        }
      });
    }

    return result;
  }, [filters, categories]);

  if (tags.length === 0) return null;

  return (
    <FilterTagsContainer role="list">
      {tags.map(({ key, label, value, isDefault }) => (
        <FilterTag key={key} role="listitem">
          {label}
          {!isDefault && (
            <RemoveButton
              onClick={() => {
                if (key.startsWith('categoryId-')) {
                  handleRemoveFilter('categoryIds', value);
                } else if (key.startsWith('sort-')) {
                  handleRemoveFilter('sort');
                } else if (key === 'price') {
                  handleRemoveFilter('minPrice');
                  handleRemoveFilter('maxPrice');
                } else if (key === 'subscribers') {
                  handleRemoveFilter('minSubscribers');
                  handleRemoveFilter('maxSubscribers');
                } else {
                  handleRemoveFilter(key as keyof ListingParams);
                }
              }}
              onKeyPress={(e) => {
                if (key.startsWith('categoryId-')) {
                  handleKeyPress(e, 'categoryIds', value);
                } else if (key.startsWith('sort-')) {
                  handleKeyPress(e, 'sort');
                } else if (key === 'price') {
                  handleKeyPress(e, 'minPrice');
                  handleKeyPress(e, 'maxPrice');
                } else if (key === 'subscribers') {
                  handleKeyPress(e, 'minSubscribers');
                  handleKeyPress(e, 'maxSubscribers');
                } else {
                  handleKeyPress(e, key as keyof ListingParams);
                }
              }}
              aria-label={`${label} 필터 제거`}
              role="button"
              tabIndex={0}
            >
              <span className="sr-only">{label} 필터 제거</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </RemoveButton>
          )}
        </FilterTag>
      ))}
    </FilterTagsContainer>
  );
});

FilterTags.displayName = 'FilterTags';

export default FilterTags; 