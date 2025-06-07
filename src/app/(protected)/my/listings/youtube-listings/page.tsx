export const metadata = {
  title: '내 채널 관리 | 채널링크',
  description: '회원님의 채널을 관리하세요.',
  openGraph: {
    title: '내 채널 관리 | 채널링크',
    description: '회원님의 채널을 관리하세요.',
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

import MyYoutubeListingsClient from './MyYoutubeListingsClient';

export default function YoutubeListingsPage() {
  return <MyYoutubeListingsClient />;
} 