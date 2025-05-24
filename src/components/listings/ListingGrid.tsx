"use client";

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { Listing, ListingParams } from '@/types/listings';
import { fetchYoutubeListings } from '@/lib/api/youtubeListings';
import { fetchYoutubeCategories, YoutubeCategory } from '@/lib/api/youtubeCategories';
import ListingCard from './ListingCard';
import FilterButton from './FilterButton';
import FilterTags from './FilterTags';
import FilterModal from './FilterModal';
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
  gap: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;

  ${mediaQueries.sm} {
    padding: ${theme.spacing[6]};
  }

  ${mediaQueries.lg} {
    padding: ${theme.spacing[8]};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};
  align-items: flex-start;
  
  ${mediaQueries.md} {
    flex-direction: row;
    align-items: center;
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
  const [error, setError] = useState<Error | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ListingParams>({
    sort: ['createdAt,desc']
  });
  const [categories, setCategories] = useState<YoutubeCategory[]>([]);

  useEffect(() => {
    const loadListings = async () => {
      try {
        setIsLoading(true);
        const response = await fetchYoutubeListings(filters);
        setListings(response.content ?? []);
      } catch (err) {
        setError(err as Error);
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  useEffect(() => {
    fetchYoutubeCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleFilterChange = (newFilters: ListingParams) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  const handleRemoveFilter = (key: keyof ListingParams, value?: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (key === 'categoryIds' && value) {
        newFilters.categoryIds = (newFilters.categoryIds ?? []).filter(id => id !== value);
        if (newFilters.categoryIds.length === 0) delete newFilters.categoryIds;
      } else {
        delete newFilters[key];
      }
      // 기본 정렬값 유지
      if (!newFilters.sort) {
        newFilters.sort = ['createdAt,desc'];
      }
      return newFilters;
    });
  };

  if (isLoading) {
    return <LoadingMessage>로딩 중...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>데이터를 불러오는 중 오류가 발생했습니다.</ErrorMessage>;
  }

  return (
    <GridContainer>
      <FilterContainer>
        <FilterButton onClick={() => setIsFilterModalOpen(true)} />
        <FilterTags filters={filters} onRemoveFilter={handleRemoveFilter} categories={categories} />
      </FilterContainer>
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