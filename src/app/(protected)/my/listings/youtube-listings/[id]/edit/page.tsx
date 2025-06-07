import { Metadata } from 'next';
import MyYoutubeListingEditClient from './MyYoutubeListingEditClient';

// 메타데이터 설정
export const metadata: Metadata = {
  title: '채널 정보 수정 | 채널링크',
  description: '채널 정보를 수정하세요.',
  openGraph: {
    title: '채널 정보 수정 | 채널링크',
    description: '채널 정보를 수정하세요.',
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

// 페이지 컴포넌트의 props 타입 정의
interface Props {
  params: Promise<{
    id: string;
  }>;
}

// 채널 정보 수정 페이지 컴포넌트
export default async function YoutubeListingEditPage({ params }: Props) {
  const { id } = await params;
  return <MyYoutubeListingEditClient id={id} />;
} 