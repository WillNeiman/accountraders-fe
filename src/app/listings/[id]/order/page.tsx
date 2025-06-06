// src/app/listings/[id]/order/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderClient from './OrderClient';
import { getYoutubeListingDetail } from '@/services/api/youtubeListings';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const listing = await getYoutubeListingDetail(id);
    return {
      title: `${listing.listingTitle} - 주문하기 | 채널링크`,
      description: `${listing.listingTitle} 상품을 주문하고 안전하게 거래하세요.`,
      openGraph: {
        title: `${listing.listingTitle} - 주문하기 | 채널링크`,
        description: `채널링크에서 안전하게 ${listing.listingTitle} 상품을 구매하세요.`,
        images: [
          {
            url: listing.thumbnailUrl,
            width: 800,
            height: 600,
            alt: `${listing.listingTitle} 썸네일`,
          },
        ],
      },
    };
  } catch {
    return {
      title: '주문하기 | 채널링크',
      description: '채널링크에서 안전하게 거래하세요.',
    };
  }
}

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const listing = await getYoutubeListingDetail(id);
    return <OrderClient listing={listing} />;
  } catch {
    notFound();
  }
} 