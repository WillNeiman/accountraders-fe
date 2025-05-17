'use client'

import { useRouter } from 'next/navigation'
import { login, getCurrentUser } from '@/services/auth'
import LoginContent from '@/components/auth/LoginContent'
import styled from '@emotion/styled'

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 40px;
`;

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password })
      const user = await getCurrentUser()
      console.log('로그인한 사용자 정보:', user)
      router.push('/')
    } catch (error) {
      console.error('로그인 실패:', error)
    }
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <LoginContent onSubmit={handleLogin} />
      </ContentWrapper>
    </PageContainer>
  )
} 