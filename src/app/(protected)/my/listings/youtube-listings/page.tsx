import { Suspense } from 'react';
import { fetchMyYoutubeListings } from '@/services/api/youtubeListings';
import MyYoutubeListingsClient from './MyYoutubeListingsClient';
import PageHeader from '@/components/common/PageHeader';
import { MyYoutubeListingParams, ListingStatus } from '@/types/features/listings/listing';

export default async function MyYoutubeListingsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const statuses = resolvedSearchParams.statuses 
    ? (Array.isArray(resolvedSearchParams.statuses) ? resolvedSearchParams.statuses : [resolvedSearchParams.statuses]) as ListingStatus[]
    : [];
    
  const params: MyYoutubeListingParams = {
    page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) - 1 : 0,
    size: 10,
    sort: typeof resolvedSearchParams.sort === 'string' ? [resolvedSearchParams.sort] : ['createdAt,desc'],
    statuses: statuses.length > 0 ? statuses : undefined,
  };

  const listingsData = await fetchMyYoutubeListings(params);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageHeader title="내 상품 관리" />
      <MyYoutubeListingsClient initialData={listingsData} />
    </Suspense>
  );
} 