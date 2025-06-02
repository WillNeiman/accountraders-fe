// layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '채널링크',
  description: '믿을 수 있는 채널 거래의 시작, 채널링크. 유튜브 채널을 안전하게 사고팔 수 있는 신뢰받는 거래 플랫폼입니다. 전문 검증과 안전 결제 시스템으로 안심하고 거래하세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
