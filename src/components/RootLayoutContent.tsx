'use client'

import { useTheme } from './ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme()

  return (
    <div className="relative overflow-hidden">
      {/* Background base layer */}
      <div className="fixed inset-0 bg-gray-50 -z-20" />

      {/* Dark theme overlay with smooth transition */}
      <motion.div
        initial={false}
        animate={{
          opacity: isDark ? 1 : 0
        }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 bg-[#030304] -z-10"
      />

      {/* Background contrast layer with improved transition */}
      <motion.div
        initial={false}
        animate={{
          backgroundColor: isDark 
            ? 'rgba(0, 0, 0, 0.3)' 
            : 'rgba(255, 255, 255, 0.3)',
          opacity: 1
        }}
        transition={{ 
          duration: 0.6,
          backgroundColor: {
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1]
          }
        }}
        className="fixed inset-0 z-0"
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ 
            scale: 0.85,
            x: '60%',
            opacity: 0
          }}
          animate={{ 
            scale: 1,
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
              opacity: {
                duration: 0.3,
                ease: 'linear'
              },
              scale: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.1
              },
              x: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.05
              }
            }
          }}
          exit={{ 
            scale: 0.85,
            x: '-60%',
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
              opacity: {
                duration: 0.25,
                ease: 'linear'
              },
              scale: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              },
              x: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.05
              }
            }
          }}
          className="fixed inset-0 will-change-transform z-10"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transformOrigin: '50% 50%',
            transform: 'translateZ(0)', // Force GPU acceleration
          }}
        >
          <div className={`w-full h-full ${
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