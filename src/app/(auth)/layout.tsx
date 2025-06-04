// src/app/(auth)/layout.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import styled from '@emotion/styled'
import { LayoutProps } from '@/types/layout'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const AuthLayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  role: 'main';
  tabIndex: 0;
`

export default function AuthLayout({ children }: LayoutProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && user) {
      router.push('/')
    }
  }, [mounted, user, router])

  if (!mounted) {
    return <LoadingSpinner />
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthLayoutContainer>{children}</AuthLayoutContainer>
    </Suspense>
  )
} 