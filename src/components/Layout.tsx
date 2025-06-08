'use client'

import { useTheme } from './ThemeContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()

  return (
    <div className="relative">
      {children}
    </div>
  )
} 