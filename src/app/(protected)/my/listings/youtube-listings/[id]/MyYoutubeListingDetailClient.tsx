'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { YoutubeListing, ListingStatus } from '@/types/features/listings/listing';
import { getYoutubeListingDetail, deleteYoutubeListing, updateYoutubeListing } from '@/services/api/youtubeListings';
import { useToast } from '@/contexts/ToastContext';
import SidebarNav from '@/components/mypage/SidebarNav';
import ListingDetail from '@/components/mypage/ListingDetail';
import { MyContainer, PageHeader, PageTitle, PageDescription, ContentGrid, Sidebar, MainContent } from '@/components/common/styles/MyPageLayout';

const StyledMainContent = styled(MainContent)`
  padding: 2rem;
`;

interface Props {
  id: string;
}

export default function MyYoutubeListingDetailClient({ id }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [listing, setListing] = useState<YoutubeListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await getYoutubeListingDetail(id);
        setListing(data);
      } catch {
        showToast('채널 정보를 불러오는데 실패했습니다.', 3000);
        router.push('/my/listings/youtube-listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, router, showToast]);

  const handleDelete = async () => {
    if (!listing) return;

    if (!window.confirm('정말로 이 채널을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteYoutubeListing(listing.listingId);
      showToast('채널이 삭제되었습니다.', 3000);
      router.push('/my/listings/youtube-listings');
    } catch {
      showToast('채널 삭제에 실패했습니다.', 3000);
    }
  };

  const handleStatusChange = async (newStatus: ListingStatus) => {
    if (!listing) return;

    try {
      await updateYoutubeListing(listing.listingId, { status: newStatus });
      setListing(prev => prev ? { ...prev, status: newStatus } : null);
      showToast('채널 상태가 변경되었습니다.', 3000);
    } catch {
      showToast('채널 상태 변경에 실패했습니다.', 3000);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!listing) {
    return <div>채널을 찾을 수 없습니다.</div>;
  }

  return (
    <MyContainer>
      <PageHeader>
        <PageTitle>채널 상세 정보</PageTitle>
        <PageDescription>채널의 상세 정보를 확인하고 관리하세요.</PageDescription>
      </PageHeader>
      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <StyledMainContent>
          <ListingDetail
            listing={listing}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </StyledMainContent>
      </ContentGrid>
    </MyContainer>
  );
} 