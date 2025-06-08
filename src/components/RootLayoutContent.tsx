'use client'

import { useTheme } from './ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()

  return (
    <div className="relative overflow-hidden">
      {/* Background contrast layer */}
      <motion.div
        initial={false}
        animate={{
          backgroundColor: isDark 
            ? 'rgba(0, 0, 0, 0.3)' 
            : 'rgba(255, 255, 255, 0.3)'
        }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Overlay for smooth background transition */}
      <motion.div
        initial={false}
        animate={{
          opacity: isDark ? 1 : 0
        }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-[#030304] -z-10 pointer-events-none"
      />

      <AnimatePresence initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ 
            scale: 0.85,
            x: '60%',
          }}
          animate={{ 
            scale: 1,
            x: 0,
            transition: {
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
              scale: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2
              },
              x: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.15
              }
            }
          }}
          exit={{ 
            scale: 0.85,
            x: '-60%',
            transition: {
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
              scale: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              },
              x: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.1
              }
            }
          }}
          className={`fixed inset-0 will-change-transform z-10 transform-gpu ${
            isDark ? 'dark' : 'light'
          }`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transformOrigin: '50% 50%',
          }}
        >
          <div className={`w-full h-full transition-none ${
            isDark 
              ? 'bg-[#030304] text-white' 
              : 'bg-gray-50 text-gray-900'
          }`}>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 