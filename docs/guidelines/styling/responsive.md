# 반응형 웹 디자인 가이드라인

## 관련 문서
- [CSS 스타일링 가이드라인](./css.md) - 기본 스타일링 관련 내용
- [컴포넌트 구조 가이드라인](../architecture/component-route.md) - 컴포넌트 반응형 구현 관련 내용
- [SEO 가이드라인](../optimization/seo.md) - 이미지 최적화 관련 내용
- [프로젝트 체크리스트](../CHECKLIST.md) - 전체 체크리스트

## 1. 브레이크포인트 정의

### 1.1 기본 브레이크포인트
```typescript
// src/styles/theme/breakpoints.ts
export const breakpoints = {
  sm: '640px',    // 모바일
  md: '768px',    // 태블릿
  lg: '1024px',   // 작은 데스크탑
  xl: '1280px',   // 데스크탑
  '2xl': '1536px' // 와이드 데스크탑
} as const;

export type Breakpoint = keyof typeof breakpoints;
```

### 1.2 미디어 쿼리 유틸리티
```typescript
// src/styles/theme/mediaQueries.ts
import { breakpoints } from './breakpoints';

export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;
```

### 1.3 브레이크포인트 사용 가이드
- `sm` (640px): 작은 모바일 기기
- `md` (768px): 태블릿 및 큰 모바일 기기
- `lg` (1024px): 작은 데스크톱 화면
- `xl` (1280px): 일반 데스크톱 화면
- `2xl` (1536px): 와이드 데스크톱 화면

## 2. 스타일링 컨벤션

### 2.1 컴포넌트 스타일링
```typescript
// 예시: ListingGrid.tsx
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing[4]};

  ${mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${mediaQueries.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${mediaQueries.wide} {
    grid-template-columns: repeat(4, 1fr);
  }
`;
```

### 2.2 레이아웃 스타일링
```typescript
// 예시: ClientLayout.tsx
const HeaderContainer = styled.header`
  padding: ${spacing[4]};

  ${mediaQueries.mobile} {
    padding: ${spacing[2]};
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;

  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: ${spacing[2]};
  }
`;
```

## 3. 반응형 디자인 원칙

### 3.1 모바일 퍼스트 접근
- 기본 스타일은 모바일 환경을 기준으로 작성
- 미디어 쿼리를 사용하여 더 큰 화면에 대한 스타일 추가
- 점진적 향상(Progressive Enhancement) 방식 적용

### 3.2 유동적 그리드 시스템
- 고정 픽셀값 대신 상대적 단위 사용
  - `px` → `rem`, `em`, `%`, `vh`, `vw`
- Flexbox와 Grid를 활용한 레이아웃 구성
- 컨테이너 최대 너비 설정

### 3.3 타이포그래피
```typescript
const Text = styled.p`
  font-size: 1rem;
  line-height: 1.5;

  ${mediaQueries.tablet} {
    font-size: 1.125rem;
  }

  ${mediaQueries.desktop} {
    font-size: 1.25rem;
  }
`;
```

### 3.4 이미지 처리
```typescript
const ResponsiveImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
`;

// Next.js Image 컴포넌트 사용
const OptimizedImage = styled(Image)`
  width: 100%;
  height: auto;
`;
```

## 4. 성능 최적화

### 4.1 이미지 최적화
- WebP 포맷 사용
- 적절한 이미지 크기 제공
- 지연 로딩 적용
```typescript
<Image
  src="/image.webp"
  alt="설명"
  width={800}
  height={600}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### 4.2 코드 최적화
- 조건부 렌더링
- 컴포넌트 지연 로딩
```typescript
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

## 5. 접근성 고려사항

### 5.1 터치 타겟 크기
```typescript
const TouchButton = styled.button`
  min-width: 44px;
  min-height: 44px;
  padding: ${spacing[2]};
`;
```

### 5.2 키보드 네비게이션
```typescript
const FocusableElement = styled.div`
  &:focus-visible {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }
`;
```

## 6. 테스트 체크리스트

### 6.1 반응형 테스트
- [ ] 모바일 (320px ~ 767px)
- [ ] 태블릿 (768px ~ 1023px)
- [ ] 데스크톱 (1024px ~ 1279px)
- [ ] 와이드 (1280px 이상)

### 6.2 디바이스 테스트
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 데스크톱 Chrome
- [ ] 데스크톱 Firefox
- [ ] 데스크톱 Safari

### 6.3 성능 테스트
- [ ] 모바일 네트워크 환경
- [ ] 3G/4G/5G 환경
- [ ] 오프라인 상태
- [ ] 배터리 절약 모드

## 7. 유용한 도구

### 7.1 개발 도구
- Chrome DevTools Device Mode
- React Developer Tools
- Lighthouse
- WebPageTest

### 7.2 테스트 도구
- BrowserStack
- Responsively App
- Am I Responsive

## 8. 참고 문서
- [MDN 반응형 디자인](https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Next.js 이미지 최적화](https://nextjs.org/docs/basic-features/image-optimization)
- [CSS-Tricks 반응형 디자인](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/) 