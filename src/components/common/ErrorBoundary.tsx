'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import styled from '@emotion/styled'
import { colors } from '@/styles/theme/colors'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: ${colors.background.default};
`

const ErrorMessage = styled.p`
  color: ${colors.error};
  margin: 1rem 0;
`

const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${colors.primary[600]};
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${colors.primary[700]};
  }
`

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer role="alert">
          <h1>오류가 발생했습니다</h1>
          <ErrorMessage>{this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}</ErrorMessage>
          <RetryButton onClick={this.handleReset} aria-label="다시 시도">
            다시 시도
          </RetryButton>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
} 