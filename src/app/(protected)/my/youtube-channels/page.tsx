export const metadata = {
  title: '유튜브 채널 관리 | 채널링크',
  description: '등록된 유튜브 채널을 안전하게 관리하세요.',
  openGraph: {
    title: '유튜브 채널 관리 | 채널링크',
    description: '등록된 유튜브 채널을 안전하게 관리하세요.',
    url: 'https://channelink.vercel.app/protected/my/youtube-channels',
    siteName: '채널링크',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 유튜브 채널 관리',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

import YoutubeChannelsClient from './YoutubeChannelsClient';

export default function YoutubeChannelsPage() {
  return <YoutubeChannelsClient />;
} 