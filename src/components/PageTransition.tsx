'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePage } from './PageContext'
import { useTheme } from './ThemeContext'
import { pages } from './PageContext'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { currentPage, isTransitioning, direction, navigateToPage } = usePage()
  const { isDark } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [showGuide, setShowGuide] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let touchStartY = 0
    const minSwipeDistance = 50

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 30) return
      setShowGuide(false)
      const direction = e.deltaY > 0 ? 'down' : 'up'
      navigateToPage(direction)
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
      setTouchStart(e.touches[0].clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touchEndY = e.touches[0].clientY
      const distance = touchStartY - touchEndY

      if (Math.abs(distance) >= minSwipeDistance) {
        setShowGuide(false)
        const direction = distance > 0 ? 'down' : 'up'
        navigateToPage(direction)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove, { passive: false })

    // Hide guide after 5 seconds
    const timer = setTimeout(() => setShowGuide(false), 5000)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      clearTimeout(timer)
    }
  }, [navigateToPage])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">
      {/* Minimal Navigation Dots */}
      <div className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2">
        {Object.entries(pages).map(([pageId]) => (
          <motion.button
            key={pageId}
            onClick={() => {
              if (currentPage === pageId) return
              setShowGuide(false)
              navigateToPage(pageId === pages[currentPage].next ? 'down' : 'up')
            }}
            animate={{
              scale: currentPage === pageId ? 1 : 0.8,
              opacity: currentPage === pageId ? 1 : 0.3
            }}
            whileHover={{
              scale: 0.9,
              opacity: 0.8
            }}
            className="w-1.5 h-1.5 rounded-full bg-current transition-colors duration-200"
            style={{
              backgroundColor: currentPage === pageId 
                ? (isDark ? 'rgb(139, 92, 246)' : 'rgb(124, 58, 237)') 
                : (isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)')
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentPage}
          initial={{ 
            opacity: 0,
            y: direction === 'up' ? 50 : -50
          }}
          animate={{ 
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.2 }
            }
          }}
          exit={{ 
            opacity: 0,
            y: direction === 'up' ? -50 : 50,
            transition: {
              duration: 0.3,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.15 }
            }
          }}
          className="fixed inset-0 will-change-transform transform-gpu z-30"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Touch/Scroll Guide - Only shown initially */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-0 bottom-12 z-40 pointer-events-none"
          >
            <div className="flex flex-col items-center justify-center gap-3">
              {/* Visual Guide */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-5 h-8 rounded-full border-2 ${
                  isDark ? 'border-white/30' : 'border-black/30'
                } flex justify-center pt-1`}
              >
                <motion.div
                  animate={{
                    y: [0, 12, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-1 h-1 rounded-full ${
                    isDark ? 'bg-white/50' : 'bg-black/50'
                  }`}
                />
              </motion.div>
              
              {/* Text Guide */}
              <span className={`text-sm ${
                isDark ? 'text-white/50' : 'text-black/50'
              }`}>
                Scroll or swipe to navigate
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 