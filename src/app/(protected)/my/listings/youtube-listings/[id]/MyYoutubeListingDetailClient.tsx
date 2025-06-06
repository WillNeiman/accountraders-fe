'use client';

import ListingDetail from '@/components/listings/ListingDetail';
import { YoutubeListingDetail } from '@/types/features/listings/listing';
import PageHeader from '@/components/common/PageHeader';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';

interface Props {
  listing: YoutubeListingDetail;
}

export default function MyYoutubeListingDetailClient({ listing }: Props) {
  const router = useRouter();

  // TODO: 수정 페이지로 이동하는 로직 구현
  const handleEditClick = () => {
    alert('수정 기능은 현재 준비중입니다.');
  };

  return (
    <>
      <PageHeader
        title="내 상품 상세 정보"
        showBack
        backText="목록으로 돌아가기"
        onBack={() => router.push('/my/listings/youtube-listings')}
      >
        <Button variant="primary" onClick={handleEditClick}>
          수정하기
        </Button>
      </PageHeader>
      <ListingDetail listing={listing} />
    </>
  );
} 