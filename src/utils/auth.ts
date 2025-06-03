import { Role, UserStatus } from '@/types/auth';
import { User } from '@/types/user';

// 단일 역할 체크
export const hasRole = (user: User | null, role: Role): boolean => {
  if (!user) return false;
  return user.roles.includes(role);
};

// 여러 역할 중 하나라도 있는지 체크
export const hasAnyRole = (user: User | null, roles: Role[]): boolean => {
  if (!user) return false;
  return roles.some(role => user.roles.includes(role));
};

// 모든 역할을 가지고 있는지 체크
export const hasAllRoles = (user: User | null, roles: Role[]): boolean => {
  if (!user) return false;
  return roles.every(role => user.roles.includes(role));
};

// 사용자 상태 체크
export const hasStatus = (user: User | null, status: UserStatus): boolean => {
  if (!user) return false;
  return user.status === status;
};

// 활성 상태인지 체크
export const isActiveUser = (user: User | null): boolean => {
  return hasStatus(user, UserStatus.ACTIVE);
};

// 구매자 권한이 있는 활성 사용자인지 체크
export const isActiveBuyer = (user: User | null): boolean => {
  return isActiveUser(user) && hasRole(user, Role.BUYER);
};

// 판매자 권한이 있는 활성 사용자인지 체크
export const isActiveSeller = (user: User | null): boolean => {
  return isActiveUser(user) && hasRole(user, Role.SELLER);
};

// 관리자 권한이 있는 활성 사용자인지 체크
export const isActiveAdmin = (user: User | null): boolean => {
  return isActiveUser(user) && hasRole(user, Role.ADMIN);
};

// 권한 및 상태 검증 결과 타입
export interface AuthValidationResult {
  isValid: boolean;
  reason?: string;
}

// 권한 및 상태 검증 함수
export const validateAuth = (
  user: User | null,
  options: {
    requiredRoles?: Role[];
    requiredStatus?: UserStatus;
    requireActive?: boolean;
  } = {}
): AuthValidationResult => {
  const { requiredRoles, requiredStatus, requireActive = true } = options;

  // 사용자가 없는 경우
  if (!user) {
    return { isValid: false, reason: '로그인이 필요합니다.' };
  }

  // 활성 상태 체크
  if (requireActive && !isActiveUser(user)) {
    return { isValid: false, reason: '비활성화된 계정입니다.' };
  }

  // 특정 상태 체크
  if (requiredStatus && !hasStatus(user, requiredStatus)) {
    return { isValid: false, reason: '잘못된 접근입니다.' };
  }

  // 역할 체크
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAllRoles(user, requiredRoles)) {
      return { isValid: false, reason: '접근 권한이 없습니다.' };
    }
  }

  return { isValid: true };
}; 