'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignupModal from '@/components/auth/SignupModal'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // 이미 로그인된 사용자는 홈으로 리다이렉트
    if (user) {
      router.push('/')
    }
  }, [user, router])

  return (
    <SignupModal 
      isOpen={true} 
      onClose={() => router.push('/')}
    />
  )
} 