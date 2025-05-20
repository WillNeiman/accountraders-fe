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
  max-width: 1280px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  padding: ${spacing[6]} ${spacing[4]};
  background: white;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.text.secondary};
`;

const MainContent = styled.div`
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

      <MainContent>
        <ListingGrid
          listings={dummyListings}
          onOpenFilter={() => setIsFilterModalOpen(true)}
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
        />
      </MainContent>
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterChange={handleFilterSubmit}
        initialFilters={filters}
      />
    </PageContainer>
  );
}
