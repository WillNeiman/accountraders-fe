import styled from '@emotion/styled';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { spacing } from '@/styles/theme/spacing';
import { ListingParams } from '@/types/listings';

interface FilterTagsProps {
  filters: ListingParams;
  onRemoveFilter: (key: keyof ListingParams) => void;
}

const TagsContainer = styled.div`
  display: flex;
  gap: ${spacing[2]};
  flex-wrap: wrap;
`;

const Tag = styled.div`
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
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${colors.primary[400]};
  
  &:hover {
    color: ${colors.primary[600]};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ko-KR').format(num);
};

const sortMap: Record<string, string> = {
  'createdAt,desc': '최신순',
  'createdAt,asc': '오래된순',
  'askingPrice,desc': '가격 높은순',
  'askingPrice,asc': '가격 낮은순',
  'subscriberCount,desc': '구독자 많은순',
  'subscriberCount,asc': '구독자 적은순',
  'viewCountOnPlatform,desc': '조회수 많은순',
  'viewCountOnPlatform,asc': '조회수 적은순',
};

const FilterTags = ({ filters, onRemoveFilter }: FilterTagsProps) => {
  const tags = [];

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    tags.push({
      key: 'categoryIds',
      label: `카테고리 ${filters.categoryIds.length}개 선택`,
    });
  }

  if (filters.minPrice || filters.maxPrice) {
    const priceLabel = filters.minPrice && filters.maxPrice
      ? `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`
      : filters.minPrice
        ? `${formatPrice(filters.minPrice)} 이상`
        : `${formatPrice(filters.maxPrice!)} 이하`;
    tags.push({ key: 'price', label: priceLabel });
  }

  if (filters.minSubscribers || filters.maxSubscribers) {
    const subsLabel = filters.minSubscribers && filters.maxSubscribers
      ? `${formatNumber(filters.minSubscribers)} - ${formatNumber(filters.maxSubscribers)}`
      : filters.minSubscribers
        ? `${formatNumber(filters.minSubscribers)} 이상`
        : `${formatNumber(filters.maxSubscribers!)} 이하`;
    tags.push({ key: 'subscribers', label: subsLabel });
  }

  if (filters.sort && filters.sort.length > 0) {
    filters.sort.forEach(sort => {
      const sortLabel = sortMap[sort];
      if (sortLabel) {
        tags.push({
          key: `sort-${sort}`,
          label: sortLabel,
        });
      }
    });
  }

  if (tags.length === 0) return null;

  return (
    <TagsContainer>
      {tags.map(({ key, label }) => (
        <Tag key={key}>
          {label}
          <RemoveButton onClick={() => {
            if (key.startsWith('sort-')) {
              onRemoveFilter('sort');
            } else {
              onRemoveFilter(key as keyof ListingParams);
            }
          }}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </RemoveButton>
        </Tag>
      ))}
    </TagsContainer>
  );
};

export default FilterTags; 