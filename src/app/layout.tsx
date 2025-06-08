import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/ThemeContext'
import { PageProvider } from '@/components/PageContext'
import RootLayoutContent from '@/components/RootLayoutContent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gustavo - Software Engineer',
  description: 'Personal portfolio showcasing my work as a software engineer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ThemeProvider>
          <PageProvider>
            <RootLayoutContent>
              {children}
            </RootLayoutContent>
          </PageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 