import GuideClient from './GuideClient';

export const metadata = {
  title: '서비스 안내 | 채널링크',
  description: '채널링크의 안전한 유튜브 채널 거래, 검증, 에스크로, 분쟁해결 등 서비스 안내 페이지입니다.',
  openGraph: {
    title: '서비스 안내 | 채널링크',
    description: '채널링크의 안전한 유튜브 채널 거래, 검증, 에스크로, 분쟁해결 등 서비스 안내 페이지입니다.',
    url: 'https://channelink.vercel.app/guide',
    siteName: '채널링크',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 서비스 안내',
      },
    ],
    type: 'website',
  },
};

export default function GuidePage() {
  return <GuideClient />;
} 