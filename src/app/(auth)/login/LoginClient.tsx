// src/app/(auth)/login/LoginClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import LoginModal from '@/components/auth/LoginModal';

export default function LoginClient() {
  const router = useRouter();
  return (
    <LoginModal 
      isOpen={true} 
      onClose={() => router.push('/')} 
    />
  );
} 