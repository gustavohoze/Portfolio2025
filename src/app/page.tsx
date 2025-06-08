'use client'

import { ThemeProvider } from '@/components/ThemeContext'
import Hero from '@/components/Hero'

export default function Home() {
  return (
    <ThemeProvider>
      <Hero />
    </ThemeProvider>
  )
} 