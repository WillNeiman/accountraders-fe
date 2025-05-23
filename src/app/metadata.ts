import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '채널링크 - 계정거래 플랫폼',
  description: '안전하고 신뢰할 수 있는 계정거래 플랫폼 채널링크입니다. 다양한 계정을 거래하고 안전하게 거래하세요.',
  openGraph: {
    title: '채널링크 - 계정거래 플랫폼',
    description: '안전하고 신뢰할 수 있는 계정거래 플랫폼 채널링크입니다. 다양한 계정을 거래하고 안전하게 거래하세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 메인',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '채널링크 - 계정거래 플랫폼',
    description: '안전하고 신뢰할 수 있는 계정거래 플랫폼 채널링크입니다. 다양한 계정을 거래하고 안전하게 거래하세요.',
    images: ['/og-image.png'],
  },
} 