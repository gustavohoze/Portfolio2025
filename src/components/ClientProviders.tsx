'use client'

import { ThemeProvider } from './ThemeContext'
import { PageProvider } from './PageContext'
import RootLayoutContent from './RootLayoutContent'
import { useEffect, useState } from 'react'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#030304]" />
    )
  }

  return (
    <ThemeProvider>
      <PageProvider>
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
      </PageProvider>
    </ThemeProvider>
  )
} 