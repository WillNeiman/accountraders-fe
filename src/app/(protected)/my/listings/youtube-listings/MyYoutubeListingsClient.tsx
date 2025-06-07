'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import { YoutubeListingResponse, ListingStatus, MyYoutubeListingParams } from '@/types/features/listings/listing';
import { fetchMyYoutubeListings } from '@/services/api/youtubeListings';
import SidebarNav from '@/components/mypage/SidebarNav';
import ListingsInfo from '@/components/mypage/ListingsInfo';
import { MyContainer, PageHeader, PageTitle, PageDescription, ContentGrid, Sidebar, MainContent } from '@/components/common/styles/MyPageLayout';
import { useCallback, useEffect, useState } from 'react';

const StyledMainContent = styled(MainContent)`
  padding: 2rem;
`;

export default function MyYoutubeListingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listingsData, setListingsData] = useState<YoutubeListingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statuses = searchParams.get('statuses')
          ? (Array.isArray(searchParams.getAll('statuses')) ? searchParams.getAll('statuses') : [searchParams.get('statuses')]) as ListingStatus[]
          : [];
          
        const params: MyYoutubeListingParams = {
          page: searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0,
          size: 10,
          sort: searchParams.get('sort') ? [searchParams.get('sort')!] : ['createdAt,desc'],
          statuses: statuses.length > 0 ? statuses : undefined,
        };

        const data = await fetchMyYoutubeListings(params);
        setListingsData(data);
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleStatusChange = useCallback((status: ListingStatus | 'ALL') => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === 'ALL') {
      params.delete('statuses');
    } else {
      params.set('statuses', status);
    }
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page + 1));
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const currentStatus = searchParams.get('statuses') || 'ALL';

  if (isLoading || !listingsData) {
    return <div>Loading...</div>;
  }

  return (
    <MyContainer>
      <PageHeader>
        <PageTitle>내 채널 관리</PageTitle>
        <PageDescription>등록한 채널을 관리하고 상태를 변경하세요.</PageDescription>
      </PageHeader>
      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <StyledMainContent>
          <ListingsInfo
            listingsData={listingsData}
            currentStatus={currentStatus as ListingStatus | 'ALL'}
            onStatusChange={handleStatusChange}
            onPageChange={handlePageChange}
          />
        </StyledMainContent>
      </ContentGrid>
    </MyContainer>
  );
} 