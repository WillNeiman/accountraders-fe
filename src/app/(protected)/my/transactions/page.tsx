export const metadata = {
  title: '거래 내역 | 채널링크',
  description: '회원님의 거래 내역을 확인할 수 있습니다.',
  openGraph: {
    title: '거래 내역 | 채널링크',
    description: '회원님의 거래 내역을 확인할 수 있습니다.',
    url: 'https://channelink.vercel.app/protected/my/transactions',
    siteName: '채널링크',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 거래내역',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

import TransactionsClient from './TransactionsClient';

export default function TransactionsPage() {
  return <TransactionsClient />;
} 