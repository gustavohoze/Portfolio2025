'use client'

import { useTheme } from './ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeButton({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme, isTransitioning } = useTheme()
  
  return (
    <motion.button
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={`p-3 rounded-full shadow-lg backdrop-blur-sm
        ${isDark 
          ? 'bg-gray-800/90 text-white hover:bg-gray-700/90' 
          : 'bg-white/90 text-gray-800 hover:bg-gray-50/90'
        } 
        ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}
        transition-colors duration-200
        ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isTransitioning ? 0.8 : 1,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </motion.div>
    </motion.button>
  )
} 