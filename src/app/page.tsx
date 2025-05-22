// page.tsx
"use client";

import styled from '@emotion/styled';
import { spacing } from '@/styles/theme/spacing';
import { colors } from '@/styles/theme/colors';
import { typography } from '@/styles/theme/typography';
import ListingGrid from '@/components/listings/ListingGrid';
import FilterModal from '@/components/listings/FilterModal';
import { useState } from 'react';
import { generateDummyListings } from '@/lib/dummyData';

const PageContainer = styled.div`
  /* Box Model */
  max-width: 1280px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  /* Box Model */
  padding: ${spacing[6]} ${spacing[4]};

  /* Visual */
  background: white;
`;

const Title = styled.h1`
  /* Typography */
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};

  /* Box Model */
  margin-bottom: ${spacing[2]};
`;

const Subtitle = styled.p`
  /* Typography */
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
`;

const PageContent = styled.div`
  /* Box Model */
  padding: ${spacing[4]};
`;

interface Filters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minSubscribers?: number;
  maxSubscribers?: number;
  sortBy?: 'price' | 'subscribers' | 'views' | 'recent';
}

export default function Home() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
  const [dummyListings] = useState(() => generateDummyListings(30));

  const handleFilterSubmit = (newFilters: Filters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  const handleRemoveFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key as keyof Filters];
    setFilters(newFilters);
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>유튜브 채널 매물</Title>
        <Subtitle>검증된 유튜브 채널을 안전하게 거래하세요</Subtitle>
      </PageHeader>

      <PageContent>
        <ListingGrid
          listings={dummyListings}
          onOpenFilter={() => setIsFilterModalOpen(true)}
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
        />
      </PageContent>
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterChange={handleFilterSubmit}
        initialFilters={filters}
      />
    </PageContainer>
  );
}
