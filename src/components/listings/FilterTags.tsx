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
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const categoryMap: Record<string, string> = {
  game: '게임',
  entertainment: '엔터테인먼트',
  education: '교육',
  music: '음악',
};

const sortByMap: Record<string, string> = {
  recent: '최신순',
  price: '가격순',
  subscribers: '구독자순',
  views: '조회수순',
};

const FilterTags = ({ filters, onRemoveFilter }: FilterTagsProps) => {
  const tags = [];

  if (filters.category && filters.category !== '') {
    tags.push({
      key: 'category',
      label: categoryMap[filters.category] || filters.category,
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

  if (filters.sortBy) {
    tags.push({
      key: 'sortBy',
      label: sortByMap[filters.sortBy],
    });
  }

  if (tags.length === 0) return null;

  return (
    <TagsContainer>
      {tags.map(({ key, label }) => (
        <Tag key={key}>
          {label}
          <RemoveButton onClick={() => onRemoveFilter(key as keyof ListingParams)} type="button">
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