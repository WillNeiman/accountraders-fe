import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import { useState } from 'react';
import ListingCard from './ListingCard';
import FilterTags from './FilterTags';
import { Listing } from '@/lib/dummyData';
import { zIndex } from '@/styles/theme/zIndex';
import FilterButton from './FilterButton';

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
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[6]};
  margin-top: ${spacing[4]};
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

const ListingGrid = ({ 
  listings, 
  onOpenFilter, 
  filters, 
  onRemoveFilter
}: ListingGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentListings = listings.slice(startIndex, endIndex);

  return (
    <Container>
      <FilterToolbar>
        <FilterButton onClick={onOpenFilter} size="default" />
        <FilterTags filters={filters} onRemoveFilter={onRemoveFilter} />
      </FilterToolbar>
      <Grid>
        {currentListings.map((listing) => (
          <ListingCard key={listing.listing_id} listing={listing} />
        ))}
      </Grid>
      <PaginationContainer>
        <PageButton
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
        >
          이전
        </PageButton>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <PageButton
            key={page}
            isActive={currentPage === page}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PageButton>
        ))}
        <PageButton
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </PageButton>
      </PaginationContainer>
    </Container>
  );
};

export default ListingGrid; 