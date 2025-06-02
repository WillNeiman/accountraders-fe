export const metadata = {
  title: '계정 관리 | 채널링크',
  description: '회원님의 계정 정보를 안전하게 관리하세요.',
  openGraph: {
    title: '계정 관리 | 채널링크',
    description: '회원님의 계정 정보를 안전하게 관리하세요.',
    url: 'https://channelink.vercel.app/protected/my/account',
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

import AccountClient from './AccountClient';

export default function AccountPage() {
  return <AccountClient />;
} 