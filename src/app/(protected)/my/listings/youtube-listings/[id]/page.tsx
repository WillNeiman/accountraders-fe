import { getYoutubeListingDetail } from '@/services/api/youtubeListings';
import { notFound } from 'next/navigation';
import MyYoutubeListingDetailClient from './MyYoutubeListingDetailClient';
import { getCurrentUser } from '@/services/auth';

export default async function MyYoutubeListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listing = await getYoutubeListingDetail(id);
    const user = await getCurrentUser().catch(() => null);

    // 본인 상품이 아닐 경우 404 처리
    if (!user || user.userId !== listing.seller.userId) {
      notFound();
    }

    return <MyYoutubeListingDetailClient listing={listing} />;
  } catch {
    notFound();
  }
} 