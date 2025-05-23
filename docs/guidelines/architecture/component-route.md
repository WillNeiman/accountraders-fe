# 컴포넌트 및 라우트 구조 가이드라인

## 관련 문서
- [CSS 스타일링 가이드라인](../styling/css.md) - 컴포넌트 스타일링 관련 내용
- [반응형 디자인 가이드라인](../styling/responsive.md) - 반응형 컴포넌트 구현 관련 내용
- [SEO 가이드라인](../optimization/seo.md) - 성능 최적화 관련 내용
- [프로젝트 체크리스트](../CHECKLIST.md) - 전체 체크리스트

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

---

이 문서는 CSS 컨벤션과 별개의 파일로 관리하는 것이 좋습니다. 각 문서는 특정 주제에 집중하여 가독성과 유지보수성을 높일 수 있습니다. 