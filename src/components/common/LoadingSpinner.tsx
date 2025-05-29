'use client'

import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { colors } from '@/styles/theme/colors'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${colors.gray[200]};
  border-top: 4px solid ${colors.primary[600]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

export default function LoadingSpinner() {
  return (
    <SpinnerContainer role="status" aria-label="로딩 중">
      <Spinner />
    </SpinnerContainer>
  )
} 