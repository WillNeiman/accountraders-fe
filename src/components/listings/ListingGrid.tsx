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
  showOnlyFilters?: boolean;
  showOnlyGrid?: boolean;
}

const Container = styled.div<{ showOnlyFilters?: boolean }>`
  position: relative;
  min-height: ${props => props.showOnlyFilters ? 'auto' : '400px'};
  padding-bottom: ${props => props.showOnlyFilters ? 0 : spacing[20]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${spacing[6]};
  margin-top: ${spacing[4]};
`;

const FilterHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: ${zIndex.sticky};
  display: flex;
  align-items: center;
  gap: ${spacing[4]};
  padding-bottom: 10px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing[2]};
  margin-top: ${spacing[8]};
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: ${spacing[2]} ${spacing[4]};
  border: 1px solid ${props => props.isActive ? colors.primary[600] : colors.gray[300]};
  background-color: ${props => props.isActive ? colors.primary[600] : 'white'};
  color: ${props => props.isActive ? 'white' : colors.gray[700]};
  border-radius: 4px;
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
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
  onRemoveFilter,
  showOnlyFilters,
  showOnlyGrid 
}: ListingGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentListings = listings.slice(startIndex, endIndex);

  if (showOnlyFilters) {
    return (
      <Container showOnlyFilters>
        <FilterHeader>
          <FilterButton onClick={onOpenFilter} size="default" />
          <FilterTags filters={filters} onRemoveFilter={onRemoveFilter} />
        </FilterHeader>
      </Container>
    );
  }

  if (showOnlyGrid) {
    return (
      <Container>
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
  }

  return (
    <Container>
      <FilterHeader>
        <FilterButton onClick={onOpenFilter} size="default" />
        <FilterTags filters={filters} onRemoveFilter={onRemoveFilter} />
      </FilterHeader>
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