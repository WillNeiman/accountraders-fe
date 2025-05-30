import { notFound } from 'next/navigation';
import { getListingDetail } from '@/services/api/listings';
import ListingDetailPageClient from './ListingDetailPageClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any) {
  try {
    const listing = await getListingDetail(params.id);
    return {
      title: `${listing.title} | 채널링크`,
      description: listing.youtubeChannel?.description,
      openGraph: {
        title: listing.title,
        description: listing.youtubeChannel?.description,
        images: [
          {
            url: listing.youtubeChannel?.thumbnailUrl,
            width: 1200,
            height: 630,
            alt: listing.title,
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
    const listing = await getListingDetail(params.id);
    return <ListingDetailPageClient listing={listing} />;
  } catch {
    notFound();
  }
} 