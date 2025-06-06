// src/app/listings/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getYoutubeListingDetail } from '@/services/api/youtubeListings';
import ListingDetailPageClient from './ListingDetailPageClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any) {
  try {
    const listing = await getYoutubeListingDetail(params.id);
    return {
      title: `${listing.listingTitle} | 채널링크`,
      description: listing.listingDescription,
      openGraph: {
        title: listing.listingTitle,
        description: listing.listingDescription,
        images: [
          {
            url: listing.thumbnailUrl,
            width: 800,
            height: 600,
            alt: listing.listingTitle,
          },
        ],
      },
    };
  } catch {
    return {
      title: '상품을 찾을 수 없습니다 | 채널링크',
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ListingDetailPage({ params }: any) {
  try {
    const listing = await getYoutubeListingDetail(params.id);
    return <ListingDetailPageClient listing={listing} />;
  } catch {
    notFound();
  }
} 