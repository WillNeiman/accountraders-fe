# 권한 및 인증 체계 가이드라인

## 1. 권한 체계

### 1.1 역할(Role) 정의
```typescript
// src/types/auth.ts
export enum Role {
  USER = 'ROLE_USER',    // 일반 사용자 (기본 역할)
  BUYER = 'ROLE_BUYER',  // 구매자 역할
  SELLER = 'ROLE_SELLER', // 판매자 역할
  ADMIN = 'ROLE_ADMIN'   // 관리자 역할
}

export type RoleType = keyof typeof Role;
```

### 1.2 사용자 상태(UserStatus) 정의
```typescript
// src/types/auth.ts
export enum UserStatus {
  ACTIVE = 'ACTIVE',       // 활성 상태
  INACTIVE = 'INACTIVE',   // 비활성 상태
  BLOCKED = 'BLOCKED',     // 차단 상태
  WITHDRAWN = 'WITHDRAWN'  // 탈퇴 상태
}

export type UserStatusType = keyof typeof UserStatus;
```

### 1.3 권한 체크 유틸리티
```typescript
// src/utils/auth.ts
import { Role, UserStatus } from '@/types/auth';

export const hasRole = (userRoles: string[], role: Role): boolean => {
  return userRoles.includes(role);
};

export const hasAnyRole = (userRoles: string[], roles: Role[]): boolean => {
  return roles.some(role => userRoles.includes(role));
};

export const hasAllRoles = (userRoles: string[], roles: Role[]): boolean => {
  return roles.every(role => userRoles.includes(role));
};

export const isActiveUser = (status: UserStatus): boolean => {
  return status === UserStatus.ACTIVE;
};
```

## 2. 권한 기반 컴포넌트

### 2.1 권한 체크 컴포넌트
```typescript
// src/components/auth/RoleGuard.tsx
'use client';

import { ReactNode } from 'react';
import { Role } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  roles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleGuard = ({ roles, children, fallback = null }: RoleGuardProps) => {
  const { user } = useAuth();
  
  if (!user || !hasAnyRole(user.roles, roles)) {
    return fallback;
  }

  return <>{children}</>;
};
```

### 2.2 상태 체크 컴포넌트
```typescript
// src/components/auth/StatusGuard.tsx
'use client';

import { ReactNode } from 'react';
import { UserStatus } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';

interface StatusGuardProps {
  status: UserStatus;
  children: ReactNode;
  fallback?: ReactNode;
}

export const StatusGuard = ({ status, children, fallback = null }: StatusGuardProps) => {
  const { user } = useAuth();
  
  if (!user || user.status !== status) {
    return fallback;
  }

  return <>{children}</>;
};
```

## 3. 권한 기반 라우트 보호

### 3.1 미들웨어 구현
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  // 인증이 필요한 경로 체크
  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 보호된 경로 목록
const protectedRoutes = [
  '/admin',
  '/seller',
  '/buyer',
  '/profile',
  '/settings'
];

const isProtectedRoute = (pathname: string): boolean => {
  return protectedRoutes.some(route => pathname.startsWith(route));
};

export const config = {
  matcher: [
    '/admin/:path*',
    '/seller/:path*',
    '/buyer/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ],
};
```

## 4. 권한 기반 API 호출

### 4.1 API 클라이언트
```typescript
// src/services/api/client.ts
export const apiClient = {
  get: async (url: string) => {
    const response = await fetch(url, {
      credentials: 'include',
    });
    return response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  // ... 다른 HTTP 메서드들
};
```

## 5. 권한 기반 UI 렌더링

### 5.1 조건부 렌더링 훅
```typescript
// src/hooks/useAuthorization.ts
import { useAuth } from '@/contexts/AuthContext';
import { Role, UserStatus } from '@/types/auth';
import { hasRole, isActiveUser } from '@/utils/auth';

export const useAuthorization = () => {
  const { user } = useAuth();

  return {
    canAccess: (role: Role) => user && hasRole(user.roles, role),
    canAccessAny: (roles: Role[]) => user && hasAnyRole(user.roles, roles),
    canAccessAll: (roles: Role[]) => user && hasAllRoles(user.roles, roles),
    isActive: () => user && isActiveUser(user.status),
  };
};
```

### 5.2 사용 예시
```typescript
// src/components/SomeComponent.tsx
'use client';

import { useAuthorization } from '@/hooks/useAuthorization';
import { Role } from '@/types/auth';

export const SomeComponent = () => {
  const { canAccess, isActive } = useAuthorization();

  if (!isActive()) {
    return <InactiveUserMessage />;
  }

  return (
    <div>
      {canAccess(Role.ADMIN) && <AdminPanel />}
      {canAccess(Role.SELLER) && <SellerDashboard />}
      {canAccess(Role.BUYER) && <BuyerDashboard />}
    </div>
  );
};
```

## 6. 권한 관리 모범 사례

### 6.1 권한 체크 원칙
- 클라이언트 측 권한 체크는 UI/UX 목적으로만 사용
- 모든 중요한 권한 체크는 서버 측에서 수행
- 권한이 필요한 작업은 항상 서버 측에서 재검증
- 클라이언트는 서버로부터 받은 역할 정보를 신뢰하고 사용

### 6.2 상태 관리
- 사용자 상태 변경은 항상 서버 측에서 수행
- 상태 변경 시 적절한 이벤트 발생 및 UI 업데이트
- 상태 변경에 따른 리다이렉션 처리

### 6.3 에러 처리
- 권한 부족 시 적절한 에러 메시지 표시
- 상태 변경 실패 시 사용자에게 명확한 피드백 제공
- 권한 관련 에러 로깅 및 모니터링

## 7. 보안 고려사항

### 7.1 토큰 관리
- JWT 토큰은 HttpOnly 쿠키로 저장
- 토큰 만료 시간 적절히 설정
- 리프레시 토큰 사용 시 보안 강화

### 7.2 권한 정보 보호
- 민감한 권한 정보는 클라이언트에 노출하지 않음
- 권한 체크는 서버 측에서 수행
- 권한 정보는 암호화하여 전송

### 7.3 세션 관리
- 세션 타임아웃 적절히 설정
- 동시 로그인 제한
- 비정상적인 접근 시도 모니터링

## 8. Spring Security 연동

### 8.1 인증 토큰 관리
```typescript
// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Role, UserStatus } from '@/types/auth';

interface User {
  userId: string;
  nickname: string;
  email: string;
  status: UserStatus;
  roles: Role[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 8.2 API 요청 처리
```typescript
// src/services/api/client.ts
export const createApiClient = () => {
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      if (response.status === 401) {
        // 인증 실패 시 로그인 페이지로 리다이렉트
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        // 권한 부족 시 에러 처리
        throw new Error('Forbidden');
      }
      throw new Error('API request failed');
    }
    return response.json();
  };

  return {
    get: async (url: string) => {
      const response = await fetch(url, {
        credentials: 'include',
      });
      return handleResponse(response);
    },
    post: async (url: string, data: any) => {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },
    // ... 다른 HTTP 메서드들
  };
};
``` 