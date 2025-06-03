# SEO 가이드라인

## 1. 메타데이터 구현 전략

### 1.1 기본 메타데이터 구조
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: '채널링크',
    template: '%s | 채널링크'
  },
  description: '믿을 수 있는 채널 거래의 시작, 채널링크',
  keywords: [
      // 기존 핵심 키워드
      '유튜브 채널 거래', '계정거래', '채널링크', '계정마켓', '채널거래',
      // 사용자의 구체적인 질문/의도 키워드 (롱테일)
      '유튜브 채널 사는곳', '유튜브 채널 파는법', '유튜브 채널 가격',
      '유튜브 구독자 거래', '수익창출 채널 구매', '안전한 유튜브 거래',
      // 잠재 고객이 관심을 가질만한 키워드
      '유튜브 채널 가치평가', '채널 양도양수'
    ],
  authors: [{ name: '채널링크' }],
  creator: '채널링크',
  publisher: '채널링크',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://channellink.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '채널링크 - 유튜브 채널 거래 플랫폼',
    description: '믿을 수 있는 채널 거래의 시작, 채널링크',
    url: 'https://channellink.com',
    siteName: '채널링크',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '채널링크',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '채널링크 - 유튜브 채널 거래 플랫폼',
    description: '믿을 수 있는 채널 거래의 시작, 채널링크',
    images: ['/twitter-image.png'],
    creator: '@channellink',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    naver: 'naver-site-verification-code',
  },
}
```

### 1.2 페이지별 메타데이터 구현
```typescript
// src/app/(auth)/login/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '로그인',
  description: '채널링크 로그인 페이지입니다. 유튜브 채널 거래 플랫폼 채널링크에 로그인하세요.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '로그인 | 채널링크',
    description: '채널링크 로그인 페이지입니다. 유튜브 채널 거래 플랫폼 채널링크에 로그인하세요.',
  },
}
```

### 1.3 동적 라우트 메타데이터
```typescript
// src/app/listings/[id]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListing(params.id)
  
  return {
    title: listing.title,
    description: listing.description,
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: [
        {
          url: listing.imageUrl,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
  }
}
```

## 2. 구조화된 데이터 (Schema.org)

### 2.1 웹사이트 스키마
```typescript
// src/app/layout.tsx
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: '채널링크',
  url: 'https://channellink.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://channellink.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}
```

### 2.2 상품 스키마
```typescript
// src/app/listings/[id]/page.tsx
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: listing.title,
  description: listing.description,
  image: listing.imageUrl,
  offers: {
    '@type': 'Offer',
    price: listing.price,
    priceCurrency: 'KRW',
    availability: listing.isAvailable 
      ? 'https://schema.org/InStock' 
      : 'https://schema.org/OutOfStock',
  },
}
```

## 3. SEO 최적화 체크리스트

### 3.1 기술적 SEO
- [ ] 메타데이터 구현
  - [ ] 기본 메타데이터 (title, description)
  - [ ] Open Graph 태그
  - [ ] Twitter 카드
  - [ ] 로봇 메타 태그
  - [ ] 캐노니컬 URL

- [ ] 구조화된 데이터
  - [ ] 웹사이트 스키마
  - [ ] 상품 스키마
  - [ ] 브레드크럼 스키마

- [ ] 성능 최적화
  - [ ] 이미지 최적화 (next/image 사용)
  - [ ] 코드 스플리팅
  - [ ] 지연 로딩
  - [ ] 캐싱 전략

### 3.2 콘텐츠 SEO
- [ ] 페이지별 최적화
  - [ ] 고유한 타이틀과 설명
  - [ ] 적절한 헤딩 구조 (h1, h2, h3)
  - [ ] 이미지 대체 텍스트
  - [ ] 내부 링크 구조

- [ ] URL 구조
  - [ ] SEO 친화적인 URL
  - [ ] 계층적 구조
  - [ ] 키워드 포함

### 3.3 모니터링 및 분석
- [ ] Google Search Console 설정
- [ ] Google Analytics 설정
- [ ] 사이트맵 생성
- [ ] robots.txt 설정

## 4. 구현 예시

### 4.1 메타데이터 컴포넌트
```typescript
// src/components/common/Metadata.tsx
import { Metadata } from 'next'

interface MetadataProps {
  title: string
  description: string
  image?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
}: MetadataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    robots: {
      index: !noIndex,
      follow: true,
    },
  }
}
```

### 4.2 사이트맵 생성
```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://channellink.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://channellink.com/listings',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    // ... 추가 URL
  ]
}
```

### 4.3 robots.txt 생성
```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/api/',
        '/admin/',
      ],
    },
    sitemap: 'https://channellink.com/sitemap.xml',
  }
}
```

## 5. 모니터링 및 유지보수

### 5.1 정기적인 체크리스트
- [ ] Google Search Console 모니터링
  - [ ] 색인 상태 확인
  - [ ] 모바일 사용성 검사
  - [ ] 코어 웹 바이탈 모니터링

- [ ] 콘텐츠 업데이트
  - [ ] 오래된 콘텐츠 갱신
  - [ ] 새로운 키워드 연구
  - [ ] 경쟁사 분석

- [ ] 기술적 검사
  - [ ] 페이지 로딩 속도
  - [ ] 모바일 최적화
  - [ ] 구조화된 데이터 유효성

### 5.2 성능 최적화
- [ ] 이미지 최적화
  - [ ] WebP 포맷 사용
  - [ ] 적절한 이미지 크기
  - [ ] 지연 로딩 적용

- [ ] 코드 최적화
  - [ ] 번들 크기 최소화
  - [ ] 불필요한 JavaScript 제거
  - [ ] CSS 최적화

## 6. 추가 리소스

### 6.1 유용한 도구
- Google Search Console
- Google Analytics
- Google PageSpeed Insights
- Schema.org Validator
- Mobile-Friendly Test

### 6.2 참고 문서
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)

## 7. 플레이스홀더 이미지 컨벤션

- 썸네일, og:image 등 외부 이미지가 없거나 로드에 실패할 경우, 반드시 플레이스홀더 이미지를 사용한다.
- 플레이스홀더 이미지는 `https://placehold.co/` 서비스를 기본으로 하며, 예시:
  - 썸네일: `https://placehold.co/400x225?text=No+Image&font=roboto`
  - og:image: `https://placehold.co/1200x630?text=No+Image&font=roboto`
- next/image 사용 시, 해당 도메인이 next.config.ts의 remotePatterns에 등록되어 있어야 한다.
- 플레이스홀더 이미지는 alt 속성에 "No Image" 또는 적절한 대체 텍스트를 반드시 포함한다.
- 실제 이미지가 존재할 경우에는 플레이스홀더가 아닌 실제 이미지를 우선적으로 사용한다. 