'use client'

import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { useTheme } from './ThemeContext'

const FloatingSquares = ({ color1, color2 }: { color1: string, color2: string }) => {
  const [squares] = useState(() => [
    { left: '20%', top: '30%', scale: 1.5, angle: 0, delay: 0 },
    { left: '50%', top: '60%', scale: 1.2, angle: 120, delay: 0.2 },
    { left: '80%', top: '40%', scale: 0.9, angle: 240, delay: 0.4 }
  ]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set('.floating-square', {
        opacity: 0,
        scale: 0,
        rotation: 0
      });

      // Initial fade in and scale animation
      gsap.to('.floating-square', {
        opacity: 0.2,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        stagger: {
          each: 0.2,
          from: 'random'
        }
      });

      // Continuous floating animation
      gsap.to('.floating-square', {
        y: 'random(-50, 50)',
        x: 'random(-30, 30)',
        rotation: 'random(-10, 10)',
        duration: 6,
        delay: 1.5,
        ease: 'sine.inOut',
        stagger: {
          each: 2,
          repeat: -1,
          yoyo: true,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {squares.map((square, i) => (
        <div
          key={i}
          className="floating-square absolute w-96 h-96"
          style={{
            left: square.left,
            top: square.top,
            background: `linear-gradient(${square.angle}deg, ${color1}, ${color2})`,
            transform: `scale(${square.scale})`,
          }}
        />
      ))}
    </div>
  );
};

export default function PageBackground({ variant = 'default' }: { variant?: 'default' | 'projects' | 'contact' }) {
  const { isDark } = useTheme()

  // Define color schemes for different pages
  const colorSchemes = {
    default: {
      square1: isDark ? 'rgba(45, 212, 191, 0.15)' : 'rgba(45, 212, 191, 0.15)',
      square2: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.08)',
      grid: isDark ? 'from-teal-500/20' : 'from-teal-500/30',
      glow: isDark ? 'rgba(45, 212, 191, 0.1)' : 'rgba(45, 212, 191, 0.15)',
      line1: isDark ? 'from-transparent via-teal-500/20 to-transparent' : 'from-transparent via-teal-600/20 to-transparent',
      line2: isDark ? 'from-transparent via-teal-500/40 to-transparent' : 'from-transparent via-teal-600/40 to-transparent'
    },
    projects: {
      square1: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.15)',
      square2: isDark ? 'rgba(236, 72, 153, 0.08)' : 'rgba(236, 72, 153, 0.08)',
      grid: isDark ? 'from-violet-500/20' : 'from-violet-500/30',
      glow: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.15)',
      line1: isDark ? 'from-transparent via-violet-500/20 to-transparent' : 'from-transparent via-violet-600/20 to-transparent',
      line2: isDark ? 'from-transparent via-violet-500/40 to-transparent' : 'from-transparent via-violet-600/40 to-transparent'
    },
    contact: {
      square1: isDark ? 'rgba(34, 211, 238, 0.15)' : 'rgba(34, 211, 238, 0.15)',
      square2: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.08)',
      grid: isDark ? 'from-cyan-500/20' : 'from-cyan-500/30',
      glow: isDark ? 'rgba(34, 211, 238, 0.1)' : 'rgba(34, 211, 238, 0.15)',
      line1: isDark ? 'from-transparent via-cyan-500/20 to-transparent' : 'from-transparent via-cyan-600/20 to-transparent',
      line2: isDark ? 'from-transparent via-cyan-500/40 to-transparent' : 'from-transparent via-cyan-600/40 to-transparent'
    }
  }

  const colors = colorSchemes[variant]

  return (
    <div className="absolute inset-0 z-0">
      {/* Radial gradient background */}
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.glow} 0%, transparent 50%)`,
        }}
      />
      
      {/* Diagonal neon line */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute w-[200%] h-1 bg-gradient-to-r ${colors.line1} blur-sm transform -rotate-45 -translate-y-1/4 -translate-x-full`}
          style={{
            animation: 'moveGradient 8s linear infinite',
          }}
        />
        <div
          className={`absolute w-[200%] h-px bg-gradient-to-r ${colors.line2} transform -rotate-45 -translate-y-1/4 -translate-x-full`}
          style={{
            animation: 'moveGradient 8s linear infinite',
          }}
        />
      </div>

      {/* Floating Squares */}
      <div className="z-0">
        <FloatingSquares color1={colors.square1} color2={colors.square2} />
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 grid grid-cols-6 grid-rows-6 gap-px opacity-20">
        {Array.from({ length: 36 }).map((_, i) => (
          <div 
            key={i} 
            className={`grid-item bg-gradient-to-br ${colors.grid} to-transparent`}
          />
        ))}
      </div>

      {/* Add keyframes for the gradient animation */}
      <style jsx>{`
        @keyframes moveGradient {
          0% {
            transform: translate(-100%, -25%) rotate(-45deg);
          }
          100% {
            transform: translate(50%, -25%) rotate(-45deg);
          }
        }
      `}</style>
    </div>
  )
} 