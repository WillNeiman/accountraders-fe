export const metadata = {
  title: '판매자 관리 | 채널링크',
  description: '판매자 정보를 안전하게 관리하세요.',
  openGraph: {
    title: '판매자 관리 | 채널링크',
    description: '판매자 정보를 안전하게 관리하세요.',
    url: 'https://channelink.vercel.app/protected/my/seller-profile',
    siteName: '채널링크',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 판매자 관리',
      },
    ],
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

import SellerProfileClient from './SellerProfileClient';

export default function SellerProfilePage() {
  return <SellerProfileClient />;
} 