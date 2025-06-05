"use client";

import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { Listing, ListingParams } from '@/types/features/listings';
import { fetchYoutubeListings } from '@/lib/api/youtubeListings';
import { fetchYoutubeCategories, YoutubeCategory } from '@/lib/api/youtubeCategories';
import ListingCard from './ListingCard';
import FilterModal from './FilterModal';
import { FilterHeader } from './FilterHeader';
import { FilterTagsScroll } from './FilterTagsScroll';
import { theme } from '@/styles/theme';
import { mediaQueries } from '@/styles/theme/breakpoints';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 280px); 
  gap: ${spacing[4]};
  justify-content: center; 
`;

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
`;

const FilterSection = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: ${spacing[2]};
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ContentSection = styled.div`
  padding: ${theme.spacing[4]};

  ${mediaQueries.sm} {
    padding: ${theme.spacing[6]};
  }

  ${mediaQueries.lg} {
    padding: ${theme.spacing[8]};
  }
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
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ListingParams>({
    sort: ['createdAt,desc']
  });
  const [categories, setCategories] = useState<YoutubeCategory[]>([]);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchYoutubeListings(filters);
      setListings(response.content);
    } catch (error) {
      setError('채널 목록을 불러오는데 실패했습니다.');
      console.error('Failed to load listings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const loadCategories = async () => {
    try {
      const categories = await fetchYoutubeCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleFilterChange = (newFilters: ListingParams) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleRemoveFilter = (key: keyof ListingParams, value?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (key === 'categoryIds' && value) {
        newFilters.categoryIds = prev.categoryIds?.filter(id => id !== value) || [];
        if (newFilters.categoryIds.length === 0) {
          delete newFilters.categoryIds;
        }
      } else if (key === 'sort') {
        delete newFilters.sort;
      } else {
        delete newFilters[key];
      }
      return newFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters({
      sort: ['createdAt,desc']
    });
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <GridContainer>
      <FilterSection>
        <FilterHeader
          onFilterClick={() => setIsFilterModalOpen(true)}
        />
        <FilterTagsScroll
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onResetFilters={handleResetFilters}
          categories={categories}
        />
      </FilterSection>
      <ContentSection>
        {isLoading ? (
          <LoadingMessage>로딩 중...</LoadingMessage>
        ) : (
          <Grid>
            {listings.map((listing) => (
              <ListingCard key={listing.listingId} listing={listing} />
            ))}
          </Grid>
        )}
      </ContentSection>
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