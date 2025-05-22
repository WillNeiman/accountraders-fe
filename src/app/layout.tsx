// layout.tsx

import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import ClientLayout from '@/components/layout/ClientLayout'
import { AuthProvider } from '@/contexts/AuthContext'

const notoSansKr = Noto_Sans_KR({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '채널링크',
  description: '채널링크 - 계정거래 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
    lang="ko"
    suppressHydrationWarning
    >
      <body className={notoSansKr.className}>
        <ToastProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
