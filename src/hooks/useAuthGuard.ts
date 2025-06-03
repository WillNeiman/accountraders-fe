'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Role, UserStatus } from '@/types/auth';
import { validateAuth } from '@/utils/auth';
import { useToast } from '@/contexts/ToastContext';

interface UseAuthGuardOptions {
  requiredRoles?: Role[];
  requiredStatus?: UserStatus;
  requireActive?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const validationResult = useMemo(() => {
    if (isLoading) {
      return { isValid: true };
    }
    return validateAuth(user, {
      requiredRoles: options.requiredRoles,
      requiredStatus: options.requiredStatus,
      requireActive: options.requireActive,
    });
  }, [user, isLoading, options.requiredRoles, options.requiredStatus, options.requireActive]);

  useEffect(() => {
    if (!isLoading && user && !validationResult.isValid && validationResult.reason) {
      // 로그인은 되어있지만 권한이 없는 경우
      showToast(validationResult.reason);
      router.back();
    }
  }, [isLoading, user, validationResult.isValid, validationResult.reason, router, showToast]);

  return {
    isLoading,
    isValid: validationResult.isValid,
    reason: validationResult.reason,
  };
}; 