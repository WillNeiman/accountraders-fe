# CSS 스타일링 가이드라인

## 관련 문서
- [반응형 디자인 가이드라인](./responsive.md) - 반응형 스타일링 관련 내용
- [컴포넌트 구조 가이드라인](../architecture/component-route.md) - 컴포넌트 스타일링 관련 내용
- [SEO 가이드라인](../optimization/seo.md) - 성능 최적화 관련 내용
- [프로젝트 체크리스트](../CHECKLIST.md) - 전체 체크리스트

## 1. 테마 시스템

### 1.1 기본 구조
모든 스타일링은 `src/styles/theme` 디렉토리의 테마 시스템을 기반으로 합니다.

```typescript
// 테마 시스템 사용 예시
import { colors, spacing, typography } from '@/styles/theme';
```

### 1.2 테마 변수
테마 변수는 일관성과 유지보수성을 위해 중앙 집중식으로 관리됩니다.

```typescript
// spacing 예시
const spacing = {
  0: '0px',
  1: '4px',    // 기본 단위
  2: '8px',    // 2배
  3: '12px',   // 3배
  4: '16px',   // 4배
  5: '20px',   // 5배
  6: '24px',   // 6배
  8: '32px',   // 8배
  10: '40px',  // 10배
  12: '48px',  // 12배
  16: '64px',  // 16배
  20: '80px',  // 20배
  24: '96px',  // 24배
  32: '128px', // 32배
  40: '160px', // 40배
  48: '192px', // 48배
  56: '224px', // 56배
  64: '256px', // 64배
} as const;

// typography 예시
const typography = {
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// mediaQueries 예시
const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;
```

### 1.3 테마 확장 가이드라인
- 새로운 색상 추가 시 기존 색상과의 조화 고려
- spacing은 4px 단위를 기본으로 하여 일관성 유지
- typography는 디자인 시스템의 규칙을 준수
- breakpoints는 일반적인 디바이스 크기를 고려하여 설정

## 2. 스타일링 방식

### 2.1 기본 원칙
- `@emotion/styled`를 기본 스타일링 방식으로 사용
- CSS 모듈은 다음 경우에만 사용:
  - 레거시 CSS 통합 시
  - 서드파티 라이브러리와의 호환성 문제 시
  - 특정 컴포넌트의 스타일 격리가 필요한 경우

### 2.2 네이밍 컨벤션
```typescript
// 컴포넌트 스타일
const StyledButton = styled.button`...`;
const ButtonWrapper = styled.div`...`;

// 유틸리티 스타일
const FlexCenter = styled.div`...`;
const GridContainer = styled.div`...`;

// 변형 스타일
const PrimaryButton = styled(Button)`...`;
const SecondaryButton = styled(Button)`...`;
```

### 2.3 스타일 구조화
```typescript
const Component = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  gap: ${spacing[2]};

  /* Box Model */
  padding: ${spacing[4]};
  margin: ${spacing[2]};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${spacing[2]};

  /* Visual */
  background-color: ${colors.primary[50]};

  /* Typography */
  font-size: ${typography.fontSize.base};
  color: ${colors.text.primary};

  /* Others */
  transition: all 0.2s;
`;
```

## 3. 스타일 속성 순서

### 3.1 기본 순서
속성 순서는 가독성과 유지보수성을 위해 중요합니다. stylelint-order를 사용하여 강제합니다.

1. Layout (레이아웃)
   - display
   - position
   - flex/grid 관련
   - gap

2. Box Model (박스 모델)
   - width/height
   - padding
   - margin
   - border
   - border-radius

3. Visual (시각적)
   - background
   - box-shadow
   - opacity
   - transform

4. Typography (타이포그래피)
   - font-size
   - font-weight
   - color
   - text-align
   - line-height

5. Others (기타)
   - cursor
   - transition
   - animation
   - z-index

### 3.2 주석 처리
각 섹션은 주석으로 구분하여 가독성을 높입니다.

## 4. 반응형 디자인

### 4.1 브레이크포인트
```typescript
const breakpoints = {
  sm: '640px',  // 모바일
  md: '768px',  // 태블릿
  lg: '1024px', // 작은 데스크탑
  xl: '1280px', // 데스크탑
  '2xl': '1536px', // 와이드 데스크탑
} as const;
```

### 4.2 반응형 스타일링
```typescript
const Component = styled.div`
  // 모바일 퍼스트 (기본 스타일)
  padding: ${spacing[4]};
  font-size: ${typography.fontSize.sm};

  // 태블릿
  @media (min-width: ${breakpoints.md}) {
    padding: ${spacing[6]};
    font-size: ${typography.fontSize.base};
  }

  // 데스크탑
  @media (min-width: ${breakpoints.lg}) {
    padding: ${spacing[8]};
    font-size: ${typography.fontSize.lg};
  }
`;
```

### 4.3 반응형 유틸리티
```typescript
// useMediaQuery 훅 예시
const useMediaQuery = (breakpoint: keyof typeof breakpoints) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
};
```

## 5. 컴포넌트 스타일링

### 5.1 공통 컴포넌트
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const Button = styled.button<ButtonProps>`
  /* 기본 스타일 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${spacing[2]};
  transition: all 0.2s;

  /* Variant 스타일 */
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${colors.primary[600]};
          color: white;
        `;
      case 'secondary':
        return `
          background-color: ${colors.gray[100]};
          color: ${colors.gray[800]};
        `;
      case 'outline':
        return `
          background: none;
          border: 1px solid ${colors.primary[600]};
          color: ${colors.primary[600]};
        `;
    }
  }}

  /* Size 스타일 */
  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          padding: ${spacing[2]} ${spacing[3]};
          font-size: ${typography.fontSize.sm};
        `;
      case 'large':
        return `
          padding: ${spacing[3]} ${spacing[6]};
          font-size: ${typography.fontSize.lg};
        `;
      default:
        return `
          padding: ${spacing[2]} ${spacing[4]};
          font-size: ${typography.fontSize.base};
        `;
    }
  }}

  /* FullWidth 스타일 */
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}
`;
```

### 5.2 스타일 상속 및 오버라이드
```typescript
// 기본 버튼 스타일 상속
const PrimaryButton = styled(Button)`
  background-color: ${colors.primary[600]};
  color: white;

  &:hover {
    background-color: ${colors.primary[700]};
  }
`;

// 특정 컨텍스트에서의 스타일 오버라이드
const PageSpecificButton = styled(Button)`
  @media (min-width: ${breakpoints.md}) {
    background-color: ${colors.secondary[500]};
  }
`;
```

## 6. 성능 최적화

### 6.1 스타일 최적화
- 동적 스타일 최소화
- 공통 스타일 추출
- 불필요한 중첩 제거

```typescript
// 좋은 예시
const commonStyles = css`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
`;

const Component1 = styled.div`
  ${commonStyles}
  background: ${colors.primary[50]};
`;

const Component2 = styled.div`
  ${commonStyles}
  background: ${colors.secondary[50]};
`;
```

### 6.2 렌더링 최적화
- 조건부 스타일링 최소화
- CSS-in-JS 최적화
- 코드 스플리팅 활용

## 7. 유지보수성

### 7.1 코드 구조
- 명확한 주석
- 일관된 네이밍
- 모듈화된 구조

### 7.2 문서화
- 복잡한 로직 설명
- 재사용 패턴 문서화
- 변경 이력 관리

## 8. 접근성

### 8.1 색상 대비
- WCAG 2.1 기준 준수
- 테마 시스템 활용

### 8.2 키보드 네비게이션
```typescript
const AccessibleButton = styled.button`
  // 기본 스타일

  &:focus {
    outline: 2px solid ${colors.primary[500]};
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
```

## 9. 디버깅

### 9.1 개발자 도구
- Emotion DevTools 활용
- Source Maps 설정
- 스타일 오버라이드 확인

### 9.2 문제 해결
- 스타일 충돌 해결
- 성능 이슈 대응
- 크로스 브라우징

## 10. 유틸리티

### 10.1 공통 유틸리티
```typescript
// 시각적으로 숨기기
const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// Flex 유틸리티
const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
```

### 10.2 애니메이션
```typescript
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FadeInComponent = styled.div`
  animation: ${fadeIn} 0.3s ease-in-out;
`;
```

## 11. 안티패턴

### 11.1 피해야 할 패턴
- !important 사용
- 과도한 선택자 중첩
- 하드코딩된 값
- 인라인 스타일
- 과도한 동적 스타일

### 11.2 대안
- 테마 시스템 활용
- 컴포넌트 분리
- 유틸리티 함수 사용
- CSS-in-JS 기능 활용

## 12. 컨벤션 업데이트

### 12.1 업데이트 절차
1. 변경 사항 제안
2. 팀 리뷰
3. 문서화
4. 적용 및 테스트
5. 팀 공유

### 12.2 변경 이력
- 주요 변경 사항 기록
- 변경 이유 문서화
- 마이그레이션 가이드 제공 