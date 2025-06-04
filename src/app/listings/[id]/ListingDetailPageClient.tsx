// src/app/listings/[id]/ListingDetailPageClient.tsx
'use client';

import PageHeader from '@/components/common/PageHeader';
import ListingDetail from '@/components/listings/ListingDetail';
import { YoutubeListingDetail } from '@/types/listings';
import { useRouter } from 'next/navigation';

interface Props {
  listing: YoutubeListingDetail;
}

export default function ListingDetailPageClient({ listing }: Props) {
  const router = useRouter();
  return (
    <>
      <PageHeader
        title="채널 상세 정보"
        showBack
        backText="채널 목록으로 돌아가기"
        onBack={() => router.back()}
      />
      <ListingDetail listing={listing} />
    </>
  );
} 