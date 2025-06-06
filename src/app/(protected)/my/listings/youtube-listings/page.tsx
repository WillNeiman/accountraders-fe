'use client';

import { Suspense } from 'react';
import MyYoutubeListingsClient from './MyYoutubeListingsClient';
import PageHeader from '@/components/common/PageHeader';
import { MyYoutubeListingParams, ListingStatus } from '@/types/features/listings/listing';
import { useSearchParams } from 'next/navigation';

export default function MyYoutubeListingsPage() {
  const searchParams = useSearchParams();
  const statuses = searchParams.get('statuses')
    ? (Array.isArray(searchParams.getAll('statuses')) ? searchParams.getAll('statuses') : [searchParams.get('statuses')]) as ListingStatus[]
    : [];
    
  const params: MyYoutubeListingParams = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0,
    size: 10,
    sort: searchParams.get('sort') ? [searchParams.get('sort')!] : ['createdAt,desc'],
    statuses: statuses.length > 0 ? statuses : undefined,
  };

  return (
    <main>
      <PageHeader title="내 상품 관리" />
      <Suspense fallback={<div>Loading...</div>}>
        <MyYoutubeListingsClient initialData={params} />
      </Suspense>
    </main>
  );
} 