# 컴포넌트 및 라우트 구조 가이드라인

## 1. 컴포넌트 구조

### 1.1 컴포넌트 디렉토리 구조
```
src/
├── components/
│   ├── common/          # 재사용 가능한 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── ErrorBoundary.tsx
│   ├── layout/         # 레이아웃 관련 컴포넌트
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   ├── auth/          # 인증 관련 컴포넌트
│   │   ├── LoginForm/
│   │   └── SignupForm/
│   └── [feature]/     # 기능별 컴포넌트
       └── [Component]/
```

### 1.2 컴포넌트 작성 규칙

#### 1.2.1 파일 구조
- **단일 파일 구조**: 작은 규모의 컴포넌트는 단일 파일로 관리
  ```typescript
  // Button.tsx
  import styled from '@emotion/styled';
  import { ButtonProps } from '@/types/components';
  
  const StyledButton = styled.button<ButtonProps>`
    // 스타일 정의
  `;
  
  const Button = ({ children, ...props }: ButtonProps) => {
    return <StyledButton {...props}>{children}</StyledButton>;
  };
  
  export default Button;
  ```

- **디렉토리 구조**: 복잡한 컴포넌트는 디렉토리로 관리
  ```
  ComplexComponent/
  ├── index.tsx
  ├── ComplexComponent.tsx
  ├── ComplexComponent.styles.ts
  └── types.ts
  ```

#### 1.2.2 컴포넌트 구현 원칙
- **접근성**: ARIA 속성과 키보드 네비게이션 지원
- **상태 관리**: 로딩, 에러, 비활성화 상태 처리
- **테마 시스템**: @emotion/styled와 테마 변수 활용
- **타입 안정성**: TypeScript 타입 정의 필수
- **재사용성**: props를 통한 유연한 커스터마이징

#### 1.2.3 성능 최적화
- **메모이제이션**
  ```typescript
  // 컴포넌트 메모이제이션
  const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    // 컴포넌트 구현
  }));

  // 이벤트 핸들러 메모이제이션
  const handleClick = useCallback((e: React.MouseEvent) => {
    // 이벤트 처리
  }, [/* 의존성 배열 */]);
  ```

- **불필요한 리렌더링 방지**
  ```typescript
  // 컴포넌트 분리
  const Header = memo(() => {
    // 헤더 구현
  });

  const ClientLayout = memo(({ children }) => {
    return (
      <>
        <Header />
        {children}
      </>
    );
  });
  ```

#### 1.2.4 스타일 작성 규칙
```typescript
const StyledComponent = styled.div`
  /* Layout */
  display: flex;
  align-items: center;
  
  /* Box Model */
  padding: ${spacing[2]};
  margin: ${spacing[1]};
  
  /* Typography */
  font-size: ${typography.fontSize.base};
  
  /* Visual */
  background-color: ${colors.background.default};
  
  /* States */
  &:hover {
    // hover 스타일
  }
  
  /* Media Queries */
  ${mediaQueries.mobile} {
    // 모바일 스타일
  }
`;
```

#### 1.2.5 상수 및 유틸리티 관리
- 상수는 `src/constants` 디렉토리에서 관리
  ```typescript
  // src/constants/filters.ts
  export const SORT_OPTIONS = {
    'createdAt,desc': '최신순',
    'createdAt,asc': '오래된순',
    // ...
  } as const;
  ```

- 유틸리티 함수는 `src/utils` 디렉토리에서 관리
  ```typescript
  // src/utils/formatters.ts
  export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(price);
  };
  ```

- 컴포넌트 내부에서만 사용되는 상수/유틸리티가 아닌 경우 반드시 분리
- 하이드레이션 오류 방지를 위해 날짜, 숫자 포맷팅 등의 유틸리티는 클라이언트 사이드에서만 실행되도록 처리

#### 1.2.6 성능 최적화
- 자주 리렌더링되는 컴포넌트는 `memo` 사용
  ```typescript
  const FilterTags = memo(({ filters, onRemoveFilter, categories }: FilterTagsProps) => {
    // 컴포넌트 구현
  });
  ```

- 이벤트 핸들러는 `useCallback` 사용
  ```typescript
  const handleRemoveFilter = useCallback((key: keyof ListingParams, value?: string) => {
    // 핸들러 구현
  }, [/* 의존성 배열 */]);
  ```

- 복잡한 계산은 `useMemo` 사용
  ```typescript
  const formattedTags = useMemo(() => {
    // 태그 포맷팅 로직
  }, [filters, categories]);
  ```

#### 1.2.7 접근성
- 모든 인터랙티브 요소에 적절한 ARIA 속성 추가
  ```typescript
  <button
    onClick={handleClick}
    aria-label="필터 제거"
    role="button"
  >
    <span className="sr-only">필터 제거</span>
    <XIcon />
  </button>
  ```

- 키보드 네비게이션 지원
  ```typescript
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };
  ```

- 스크린 리더 지원을 위한 적절한 role 속성 사용
  ```typescript
  <div role="list">
    {items.map(item => (
      <div key={item.id} role="listitem">
        {item.content}
      </div>
    ))}
  </div>
  ```

#### 1.2.8 스타일 컴포넌트 네이밍
- 컴포넌트 이름을 prefix로 사용
  ```typescript
  const FilterTagsContainer = styled.div`...`;
  const FilterTag = styled.div`...`;
  const FilterTagLabel = styled.span`...`;
  ```

- 유틸리티 스타일은 목적을 명확히 표현
  ```typescript
  const FlexCenter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  ```

- 스타일 컴포넌트는 관련 컴포넌트와 함께 배치
  ```typescript
  // FilterTags.tsx
  const FilterTagsContainer = styled.div`...`;
  const FilterTag = styled.div`...`;
  
  const FilterTags = () => {
    // 컴포넌트 구현
  };
  ```

### 1.3 에러 처리

#### 1.3.1 전역 에러 처리
```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

#### 1.3.2 에러 핸들러
```typescript
// errorHandler.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  const { showToast } = useToast();
  
  if (error instanceof AppError) {
    showToast(error.message);
  } else if (error instanceof Error) {
    showToast('알 수 없는 오류가 발생했습니다');
  } else {
    showToast('알 수 없는 오류가 발생했습니다');
  }
};

// 에러 핸들링 래퍼
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error);
      throw error;
    }
  };
};
```

### 1.4 상태 관리
- **로컬 상태**: useState, useReducer
- **전역 상태**: 
  - 인증/사용자 정보: AuthContext
  - UI 상태: UIStateContext
  - 테마: ThemeContext
- **서버 상태**: React Query 사용

## 2. 라우트 구조

### 2.1 App Router 구조
```
src/
├── app/
│   ├── (auth)/                # 인증 관련 라우트 그룹
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── signup/
│   │       ├── page.tsx
│   │       └── error.tsx
│   ├── (dashboard)/          # 대시보드 라우트 그룹
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── api/                  # API 라우트
│   │   └── auth/
│   │       └── route.ts
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 홈페이지
```

### 2.2 라우트 작성 규칙

#### 2.2.1 페이지 컴포넌트
```typescript
// app/(dashboard)/page.tsx
import { Suspense } from 'react';
import { DashboardContent } from '@/components/pages/dashboard';
import { LoadingSpinner } from '@/components/atoms';

export default async function DashboardPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
```

#### 2.2.2 레이아웃 컴포넌트
```typescript
// app/(dashboard)/layout.tsx
import { DashboardLayout } from '@/components/templates';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

### 2.3 라우트 보호
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 2.4 데이터 페칭
```typescript
// app/(dashboard)/page.tsx
import { getDashboardData } from '@/services/api';

export default async function DashboardPage() {
  const data = await getDashboardData();
  
  return (
    <DashboardContent data={data} />
  );
}
```

### 2.5 에러 처리
```typescript
// app/(dashboard)/error.tsx
'use client';

import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/molecules';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorBoundary onReset={reset} />;
}
```

## 3. 모범 사례

### 3.1 컴포넌트 설계
- **Props 인터페이스**: 명확한 타입 정의와 문서화
- **이벤트 핸들링**: 일관된 네이밍 컨벤션 (handle, on 접두사)
- **스타일링**: CSS-in-JS와 테마 시스템 활용
- **성능**: 불필요한 리렌더링 방지

### 3.2 라우트 설계
- **라우트 그룹화**: 기능별 논리적 그룹화
- **레이아웃 재사용**: 중첩 레이아웃 활용
- **동적 라우트**: 적절한 파라미터 처리
- **미들웨어**: 인증/인가 처리

### 3.3 코드 품질
- **타입 안정성**: TypeScript strict 모드 사용
- **성능 최적화**: React.memo, useCallback, useMemo 적절히 사용
- **에러 처리**: ErrorBoundary와 전역 에러 핸들러 활용
- **린트/포맷팅**: ESLint + Prettier

## 4. 추가 문서화 필요성

### 4.1 프로젝트 README.md
- 프로젝트 소개, 설치 방법, 개발 환경, 빌드 방법 등 기본 정보를 포함합니다.
- 코드 컨벤션, 컴포넌트 구조, 라우트 구조 등 개발 가이드라인을 포함합니다.

### 4.2 개발 가이드라인 문서
- 코드 컨벤션, 컴포넌트 구조, 라우트 구조 등 상세 가이드라인을 포함합니다.
- 예시 코드, 안티패턴, 모범 사례 등을 포함합니다.

### 4.3 API 문서
- 백엔드 API 연동 방법, 엔드포인트, 요청/응답 형식 등을 문서화합니다.

## 9. 타입 관리 컨벤션

### 9.1 타입 디렉토리 구조
```
src/
└── types/
    ├── common/           # 공통 타입
    │   ├── api.ts       # API 응답/요청 타입
    │   ├── user.ts      # 사용자 관련 타입
    │   └── pagination.ts # 페이지네이션 타입
    ├── features/        # 기능별 타입
    │   ├── listings/    # 리스팅 관련 타입
    │   │   ├── index.ts
    │   │   ├── listing.ts
    │   │   ├── filter.ts
    │   │   └── sort.ts
    │   └── auth/        # 인증 관련 타입
    │       ├── index.ts
    │       ├── user.ts
    │       └── session.ts
    └── index.ts         # 타입 재내보내기
```

### 9.2 타입 파일 구조
- 각 도메인별로 타입을 분리하여 관리
- 관련된 타입들은 하나의 파일에 그룹화
- 공통으로 사용되는 타입은 common 디렉토리에 위치
- 각 기능별 타입은 features 디렉토리 하위에 위치

### 9.3 타입 네이밍 컨벤션
- 인터페이스: PascalCase (예: `UserProfile`)
- 타입 별칭: PascalCase (예: `UserRole`)
- 제네릭 타입: PascalCase (예: `ApiResponse<T>`)
- 타입 가드: is 접두사 사용 (예: `isUser`)

### 9.4 타입 재사용 및 확장
- 공통 타입은 base 타입으로 정의하고 확장
- 타입 가드를 활용한 런타임 타입 체크
- 유틸리티 타입을 활용한 타입 변환

### 9.5 타입 내보내기
- 각 기능 디렉토리의 index.ts에서 타입 재내보내기
- 공통 타입은 types/index.ts에서 재내보내기
- 필요한 경우에만 개별 타입 import 허용

### 9.6 타입 문서화
- 복잡한 타입은 JSDoc을 사용하여 문서화
- 타입의 용도와 사용 예시를 주석으로 설명
- 제네릭 타입의 경우 타입 파라미터 설명 추가

---

이 문서는 CSS 컨벤션과 별개의 파일로 관리하는 것이 좋습니다. 각 문서는 특정 주제에 집중하여 가독성과 유지보수성을 높일 수 있습니다. 