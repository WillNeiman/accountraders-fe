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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${spacing[4]};
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
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
      <div style={{ display: 'flex', gap: theme.spacing[4], alignItems: 'center' }}>
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
          <ListingCard key={listing.listingId} listing={listing} />
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