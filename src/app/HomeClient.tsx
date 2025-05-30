'use client';

import PageHeader from '@/components/common/PageHeader';
import { ListingGrid } from '@/components/listings/ListingGrid';

export default function HomeClient() {
  return (
    <>
      <PageHeader title="채널 목록" />
      <ListingGrid />
    </>
  );
} 