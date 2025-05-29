'use client'

import { ErrorProps } from '@/types/layout'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function Error({ reset }: ErrorProps) {
  return (
    <ErrorBoundary onReset={reset}>
      <div>오류가 발생했습니다</div>
    </ErrorBoundary>
  )
} 