'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import { YoutubeListingDetail } from '@/types/features/listings/listing';
import { getYoutubeListingDetail, updateYoutubeListing } from '@/services/api/youtubeListings';
import { useToast } from '@/contexts/ToastContext';
import SidebarNav from '@/components/mypage/SidebarNav';
import ListingEdit from '@/components/mypage/ListingEdit';
import { MyContainer, PageHeader, PageTitle, PageDescription, ContentGrid, Sidebar, MainContent } from '@/components/common/styles/MyPageLayout';

const StyledMainContent = styled(MainContent)`
  padding: 2rem;
`;

interface Props {
  id: string;
}

export default function MyYoutubeListingEditClient({ id }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const [listing, setListing] = useState<YoutubeListingDetail | null>(null);
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

  const handleSubmit = async (formData: Partial<YoutubeListingDetail>) => {
    try {
      await updateYoutubeListing(id, formData);
      showToast('채널 정보가 수정되었습니다.', 3000);
      router.push(`/my/listings/youtube-listings/${id}`);
    } catch {
      showToast('채널 정보를 저장하는데 실패했습니다.', 3000);
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
        <PageTitle>채널 정보 수정</PageTitle>
        <PageDescription>채널 정보를 수정하세요.</PageDescription>
      </PageHeader>
      <ContentGrid>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <StyledMainContent>
          <ListingEdit listing={listing} onSubmit={handleSubmit} />
        </StyledMainContent>
      </ContentGrid>
    </MyContainer>
  );
} 
