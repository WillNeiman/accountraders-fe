import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderClient from './OrderClient';
import { getListingDetail } from '@/services/api/listings';

const PLACEHOLDER_THUMBNAIL = 'https://placeholderjs.com/1200x630&text=No+Image&background=_F5F6FA&color=_888888&fontsize=48';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const id = params.id;
  try {
    const listing = await getListingDetail(id);
    return {
      title: `${listing.title} - 주문하기 | 채널링크`,
      description: `${listing.title} 상품을 주문하고 안전하게 거래하세요.`,
      openGraph: {
        title: `${listing.title} - 주문하기 | 채널링크`,
        description: `${listing.title} 상품을 주문하고 안전하게 거래하세요.`,
        images: ['https://placeholderjs.com/1200x630&text=Channel+Link'],
      },
    };
  } catch {
    return {
      title: '주문하기 | 채널링크',
      description: '채널링크에서 안전하게 거래하세요.',
    };
  }
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const listing = await getListingDetail(id);
    return <OrderClient listing={listing} />;
  } catch {
    notFound();
  }
} 