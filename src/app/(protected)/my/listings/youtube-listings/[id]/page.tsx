import { Metadata } from 'next';
import MyYoutubeListingDetailClient from './MyYoutubeListingDetailClient';

export const metadata: Metadata = {
  title: '채널 상세 정보 | 채널링크',
  description: '채널의 상세 정보를 확인하세요.',
  openGraph: {
    title: '채널 상세 정보 | 채널링크',
    description: '채널의 상세 정보를 확인하세요.',
    url: 'https://channelink.vercel.app/protected/my/listings/youtube-listings',
    siteName: '채널링크',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 마이페이지',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function YoutubeListingDetailPage({ params }: Props) {
  const { id } = await params;
  return <MyYoutubeListingDetailClient id={id} />;
} 