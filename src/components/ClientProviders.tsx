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
    // Use requestAnimationFrame to ensure smooth mounting
    const frame = requestAnimationFrame(() => {
      setMounted(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  // Show a minimal loading state
  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#030304] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 rounded-full animate-spin border-t-transparent" />
      </div>
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