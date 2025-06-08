'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

type Page = {
  id: string;
  component: React.ReactNode;
  next: string;
  prev: string;
}

type PageContextType = {
  currentPage: string;
  isTransitioning: boolean;
  direction: 'up' | 'down' | null;
  navigateToPage: (direction: 'up' | 'down') => void;
}

const PageContext = createContext<PageContextType>({
  currentPage: 'hero',
  isTransitioning: false,
  direction: null,
  navigateToPage: () => {},
})

export const pages: Record<string, Page> = {
  hero: {
    id: 'hero',
    component: null, // We'll set this when using the provider
    next: 'projects',
    prev: 'contact'
  },
  projects: {
    id: 'projects',
    component: null,
    next: 'contact',
    prev: 'hero'
  },
  contact: {
    id: 'contact',
    component: null,
    next: 'hero',
    prev: 'projects'
  }
}

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(() => {
    // Initialize from localStorage if available, otherwise default to 'hero'
    if (typeof window !== 'undefined') {
      const savedPage = localStorage.getItem('currentPage')
      return savedPage || 'hero'
    }
    return 'hero'
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastScrollTime = useRef(Date.now())
  const scrollCooldown = 600 // Reduced cooldown for springy animations

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPage', currentPage)
    }
  }, [currentPage])

  const navigateToPage = useCallback((direction: 'up' | 'down') => {
    if (isTransitioning) return

    const now = Date.now()
    if (now - lastScrollTime.current < scrollCooldown) return
    lastScrollTime.current = now

    setIsTransitioning(true)
    setDirection(direction)

    const nextPageId = direction === 'up' 
      ? pages[currentPage].prev 
      : pages[currentPage].next

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    // Set the next page
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentPage(nextPageId)
      setIsTransitioning(false)
      setDirection(null)
    }, 500)
  }, [currentPage, isTransitioning])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  return (
    <PageContext.Provider value={{ 
      currentPage, 
      isTransitioning, 
      direction,
      navigateToPage 
    }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePage() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePage must be used within a PageProvider')
  }
  return context
} 