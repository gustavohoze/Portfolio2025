'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export const pages = {
  hero: {
    next: 'projects',
    prev: 'contact'
  },
  projects: {
    next: 'contact',
    prev: 'hero'
  },
  contact: {
    next: 'hero',
    prev: 'projects'
  }
} as const

type PageType = keyof typeof pages
type DirectionType = 'up' | 'down' | PageType

interface PageContextType {
  currentPage: PageType
  isTransitioning: boolean
  direction: 'up' | 'down'
  navigateToPage: (direction: DirectionType) => void
}

const PageContext = createContext<PageContextType | null>(null)

export function PageProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('hero')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<'up' | 'down'>('down')

  const navigateToPage = useCallback((input: DirectionType) => {
    if (isTransitioning) return

    let nextPage: PageType
    let newDirection: 'up' | 'down'

    if (input === 'up' || input === 'down') {
      nextPage = input === 'up' ? pages[currentPage].prev : pages[currentPage].next
      newDirection = input
    } else {
      // Handle direct page navigation
      if (input === currentPage) return
      
      // Find the shortest path to the target page
      const pageOrder = ['hero', 'projects', 'contact'] as const
      const currentIndex = pageOrder.indexOf(currentPage)
      const targetIndex = pageOrder.indexOf(input)
      
      // Determine if going up or down would be shorter
      const distanceDown = (targetIndex - currentIndex + pageOrder.length) % pageOrder.length
      const distanceUp = (currentIndex - targetIndex + pageOrder.length) % pageOrder.length
      
      if (distanceDown <= distanceUp) {
        nextPage = input
        newDirection = 'down'
      } else {
        nextPage = input
        newDirection = 'up'
      }
    }

    setIsTransitioning(true)
    setDirection(newDirection)
    setCurrentPage(nextPage)

    // Reset transition state after animation
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 300) // Match animation duration

    return () => clearTimeout(timer)
  }, [currentPage, isTransitioning])

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