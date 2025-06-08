'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePage } from './PageContext'
import { useTheme } from './ThemeContext'
import { pages } from './PageContext'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { currentPage, isTransitioning, direction, navigateToPage } = usePage()
  const { isDark } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Get next and previous page names
  const nextPageName = pages[currentPage].next.charAt(0).toUpperCase() + pages[currentPage].next.slice(1)
  const prevPageName = pages[currentPage].prev.charAt(0).toUpperCase() + pages[currentPage].prev.slice(1)
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let touchStartY = 0
    const minSwipeDistance = 50

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 30) return
      
      const direction = e.deltaY > 0 ? 'down' : 'up'
      navigateToPage(direction)
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touchEndY = e.touches[0].clientY
      const distance = touchStartY - touchEndY

      if (Math.abs(distance) >= minSwipeDistance) {
        const direction = distance > 0 ? 'down' : 'up'
        navigateToPage(direction)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
    }
  }, [navigateToPage])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      {/* Up Navigation */}
      <div className="fixed inset-x-0 top-8 z-40 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: direction === 'up' ? 1 : 0.6,
            y: 0,
            scale: direction === 'up' ? 1.05 : 1
          }}
          className={`px-4 py-2 rounded-full ${
            isDark 
              ? 'bg-gray-800/80 text-gray-200' 
              : 'bg-white/80 text-gray-800'
          } backdrop-blur-sm flex items-center gap-2`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>Scroll up for {prevPageName}</span>
        </motion.div>
      </div>

      {/* Down Navigation */}
      <div className="fixed inset-x-0 bottom-8 z-40 flex justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: direction === 'down' ? 1 : 0.6,
            y: 0,
            scale: direction === 'down' ? 1.05 : 1
          }}
          className={`px-4 py-2 rounded-full ${
            isDark 
              ? 'bg-gray-800/80 text-gray-200' 
              : 'bg-white/80 text-gray-800'
          } backdrop-blur-sm flex items-center gap-2`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <span>Scroll down for {nextPageName}</span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentPage}
          initial={{ 
            opacity: 0,
            y: direction === 'up' ? 100 : -100
          }}
          animate={{ 
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.3 }
            }
          }}
          exit={{ 
            opacity: 0,
            y: direction === 'up' ? -100 : 100,
            transition: {
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.25 }
            }
          }}
          className="fixed inset-0 will-change-transform transform-gpu z-30"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Section Preview Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-3 pointer-events-none">
        {Object.entries(pages).map(([pageId, page]) => (
          <motion.div
            key={pageId}
            animate={{
              scale: currentPage === pageId ? 1.2 : 1,
              opacity: currentPage === pageId ? 1 : 0.4
            }}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              isDark ? 'bg-white' : 'bg-gray-800'
            }`}
          />
        ))}
      </div>
    </div>
  )
} 