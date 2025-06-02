export const metadata = {
  title: '로그인 | 채널링크',
  description: '채널링크 로그인 페이지입니다. 유튜브 채널 거래 플랫폼 채널링크에 로그인하세요.',
  openGraph: {
    title: '로그인 | 채널링크',
    description: '채널링크 로그인 페이지입니다. 유튜브 채널 거래 플랫폼 채널링크에 로그인하세요.',
    url: 'https://channelink.vercel.app/auth/login',
    siteName: '채널링크',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 로그인',
      },
    ],
    type: 'website',
  },
};

import LoginClient from './LoginClient';

export default function LoginPage() {
  return <LoginClient />;
} 