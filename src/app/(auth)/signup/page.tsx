export const metadata = {
  title: '회원가입 | 채널링크',
  description: '채널링크 회원가입 페이지입니다. 안전한 유튜브 채널 거래 플랫폼 채널링크에 가입하세요.',
  openGraph: {
    title: '회원가입 | 채널링크',
    description: '채널링크 회원가입 페이지입니다. 안전한 유튜브 채널 거래 플랫폼 채널링크에 가입하세요.',
    url: 'https://channelink.vercel.app/auth/signup',
    siteName: '채널링크',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크 회원가입',
      },
    ],
    type: 'website',
  },
};

import SignupClient from './SignupClient';

export default function SignupPage() {
  return <SignupClient />;
} 