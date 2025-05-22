import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { Listing, ListingParams } from '@/types/listings';
import { fetchYoutubeListings } from '@/lib/api/youtubeListings';
import ListingCard from './ListingCard';
import FilterButton from './FilterButton';
import FilterTags from './FilterTags';
import FilterModal from './FilterModal';
import { theme } from '@/styles/theme';
import { zIndex } from '@/styles/theme/zIndex';

interface ListingGridProps {
  listings: Listing[];
  onOpenFilter: () => void;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minSubscribers?: number;
    maxSubscribers?: number;
    sortBy?: 'price' | 'subscribers' | 'views' | 'recent';
  };
  onRemoveFilter: (key: string) => void;
}

const Container = styled.div`
  min-height: 400px;
  width: 100%;
  position: relative;
`;

const FilterToolbar = styled.div`
  /* Layout */
  position: sticky;
  top: 57px;
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  width: 100%;

  /* Box Model */
  padding: ${spacing[4]} 0;
  margin-bottom: ${spacing[4]};

  /* Visual */
  background: linear-gradient(
    to bottom,
    ${colors.background.default} 0%,
    ${colors.background.default}00 100%
  );

  /* Others */
  z-index: ${zIndex.sticky};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${spacing[4]};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing[2]};
  margin-top: ${spacing[8]};
  padding-bottom: ${spacing[8]};
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  /* Box Model */
  padding: ${spacing[2]} ${spacing[4]};
  border: 1px solid ${props => props.isActive ? colors.primary[600] : colors.gray[300]};
  border-radius: 4px;

  /* Visual */
  background-color: ${props => props.isActive ? colors.primary[600] : 'white'};

  /* Typography */
  font-size: ${typography.fontSize.sm};
  color: ${props => props.isActive ? 'white' : colors.gray[700]};

  /* Others */
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.isActive ? colors.primary[700] : colors.gray[100]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ITEMS_PER_PAGE = 16;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.gray[600]};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.red[500]};
`;

export const ListingGrid = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ListingParams>({});

  useEffect(() => {
    const loadListings = async () => {
      try {
        setIsLoading(true);
        const response = await fetchYoutubeListings(filters);
        setListings(response.listings ?? []);
      } catch (err) {
        setError(err as Error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  const handleFilterChange = (newFilters: ListingParams) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  if (isLoading) {
    return <LoadingMessage>로딩 중...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>데이터를 불러오는 중 오류가 발생했습니다.</ErrorMessage>;
  }

  return (
    <GridContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FilterButton onClick={() => setIsFilterModalOpen(true)} />
        <FilterTags filters={filters} onRemoveFilter={(key: keyof ListingParams) => {
          setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[key];
            return newFilters;
          });
        }} />
      </div>
      <Grid>
        {listings.map((listing) => (
          <ListingCard key={listing.listing_id} listing={listing} />
        ))}
      </Grid>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />
    </GridContainer>
  );
};

export default ListingGrid; 