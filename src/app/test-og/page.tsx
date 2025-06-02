// app/test-og/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OG Test Page | 채널링크',
  description: 'This is a test page for Open Graph.',
  openGraph: {
    title: 'OG Test Page | 채널링크',
    description: 'This is a test page for Open Graph.',
    url: 'https://channelink.vercel.app/test-og',
    images: [
      {
        url: 'https://channelink.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Test OG Image',
      },
    ],
    type: 'website',
  },
};

export default function TestOgPage() {
  return <h1>OG Test Page</h1>;
}