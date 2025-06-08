'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTheme } from './ThemeContext'
import { Editor, CodeView, DesignView } from './editor'
import PageBackground from './PageBackground'
import ThemeButton from './ThemeButton'

// Simple seeded random number generator
const seededRandom = (seed : number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const CountUp = ({ end, duration = 2 } : { end: number, duration?: number }) => {
  const countRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(countRef.current, {
        textContent: 0,
        duration: duration,
        ease: "power2.out",
        snap: { textContent: 1 },
        stagger: 1,
      })
    }, countRef)

    return () => ctx.revert()
  }, [end, duration])

  return <span ref={countRef}>{end}</span>
}

export default function Hero() {
  const { isDark, isTransitioning } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const currentContentRef = useRef<HTMLDivElement>(null);
  const newContentRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingRef = useRef(false);

  const editorViews = {
    code: {
      component: CodeView,
      label: 'Code',
      icon: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      filename: 'Portfolio.tsx'
    },
    design: {
      component: DesignView,
      label: 'Design',
      icon: (
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      filename: 'Portfolio.fig'
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations remain the same
      gsap.from('.floating-square', {
        opacity: 0,
        scale: 0,
        duration: 1.5,
        ease: 'power3.out',
      });

      gsap.from('.grid-item', {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: {
          amount: 1.5,
          grid: 'auto',
          from: 'center'
        },
        ease: 'power2.out'
      });

      gsap.from('.fade-in', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.line', {
        scaleX: 0,
        duration: 1,
        ease: 'power3.inOut'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Cleanup function to remove any extra views
  const cleanupExtraViews = () => {
    if (heroRef.current) {
      const extraViews = heroRef.current.querySelectorAll('.new-theme');
      extraViews.forEach(view => view.remove());
    }
  };

  // Theme transition animation
  useEffect(() => {
    if (isTransitioning && heroRef.current && currentContentRef.current && !isAnimatingRef.current) {
      isAnimatingRef.current = true;

      // Clean up any existing cloned content first
      cleanupExtraViews();

      const ctx = gsap.context(() => {
        // Create new theme content
        const newContent = currentContentRef.current?.cloneNode(true) as HTMLDivElement;
        newContent.classList.remove('current-theme');
        newContent.classList.add('new-theme');
        
        // Set initial state for new content
        gsap.set(newContent, {
          position: 'fixed', // Change to fixed positioning
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          x: '100vw',
          scale: 0.8,
          zIndex: 20,
          opacity: 0,
          className: `relative min-h-screen ${!isDark ? 'bg-[#030304] text-white' : 'bg-gray-50 text-gray-900'}`
        });
        
        // Add new content to DOM
        heroRef.current?.appendChild(newContent);
        newContentRef.current = newContent;

        // Create timeline for smoother animation
        const tl = gsap.timeline({
          onComplete: () => {
            // Clean up after animation
            if (currentContentRef.current && newContent.parentNode) {
              gsap.set(newContent, { 
                position: 'relative',
                top: 'auto',
                left: 'auto',
                right: 'auto',
                bottom: 'auto'
              });
              currentContentRef.current.remove();
              currentContentRef.current = newContent;
              newContentRef.current = null;
              cleanupExtraViews(); // Clean up any remaining views
            }
            isAnimatingRef.current = false;
          }
        });

        // 1. Scale down current content
        tl.to(currentContentRef.current, {
          scale: 0.8,
          duration: 0.5,
          ease: 'power2.inOut'
        });

        // 2. Slide out current content and fade in + slide in new content
        tl.to(currentContentRef.current, {
          x: '-100vw',
          duration: 0.5,
          ease: 'power2.inOut'
        }, 0.5);

        tl.to(newContent, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut'
        }, 0.5);

        // 3. Scale up new content
        tl.to(newContent, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, 0.8);
      });

      return () => {
        ctx.revert();
        isAnimatingRef.current = false;
        cleanupExtraViews(); // Clean up on unmount or interruption
      };
    }
  }, [isTransitioning, isDark]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      cleanupExtraViews();
    };
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Main content wrapper */}
      <div
        ref={currentContentRef}
        className={`current-theme relative min-h-screen z-10 ${
          isDark 
            ? 'bg-[#030304] text-white' 
            : 'bg-gray-50 text-gray-900'
        }`}
      >
        {/* Add ThemeButton */}
        <ThemeButton className="fixed top-6 right-6 z-50" />

        {/* Background elements */}
        <PageBackground variant="default" />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          {/* Left Section */}
          <div className="flex-1 w-full lg:w-1/2 space-y-8 lg:space-y-12 mt-16 sm:mt-20 lg:mt-0">
            {/* Header Group */}
            <div className="space-y-6">
              {/* Name and Title Group */}
              <div className="space-y-2">
                <p className={`fade-in text-sm tracking-widest font-medium ${
                  isDark ? 'text-teal-400' : 'text-teal-600'
                }`}>
                  HI THERE, I'M
                </p>
                <h1 className="fade-in text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Gustavo
                  <span className={`block my-2 text-transparent bg-clip-text ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-400 via-blue-400 to-teal-400' 
                      : 'bg-gradient-to-r from-teal-600 via-blue-600 to-teal-600'
                  }`}>
                    Software Engineer
                  </span>
                </h1>
              </div>

              {/* Description and Line */}
              <div className="space-y-4">
                <div className={`line w-[70%] h-0.5 ${
                  isDark 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-500' 
                    : 'bg-gradient-to-r from-teal-600 to-blue-600'
                }`}></div>
                <p className={`fade-in text-base sm:text-lg max-w-xl leading-relaxed ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Passionate about crafting elegant solutions to complex problems. 
                  With expertise in full-stack development, I specialize in building 
                  modern web applications that combine beautiful design with efficient functionality.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="fade-in flex flex-col sm:flex-row gap-4">
                <button className={`relative group px-6 sm:px-8 py-3 ${
                  isDark 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-teal-600 text-white'
                  } font-medium rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl hover:shadow-teal-500/25 overflow-hidden`}>
                  <span className="relative z-10">View My Work</span>
                  <div className={`absolute inset-0 ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-400 to-blue-500' 
                      : 'bg-gradient-to-r from-teal-600 to-blue-600'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </button>
                <button className={`group px-6 sm:px-8 py-3 border ${
                  isDark 
                    ? 'border-teal-500/30' 
                    : 'border-teal-600/30'
                  } rounded-lg transition-all duration-300 relative overflow-hidden`}>
                  <span className={`relative z-10 ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-400 to-blue-500' 
                      : 'bg-gradient-to-r from-teal-600 to-blue-600'
                    } bg-clip-text text-transparent font-medium`}>
                    Download CV
                  </span>
                  <div className={`absolute inset-0 ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-500/10 to-blue-500/10' 
                      : 'bg-gradient-to-r from-teal-600/10 to-blue-600/10'
                    } transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </button>
              </div>
            </div>

            {/* Stats and Tech Stack Group */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="fade-in grid grid-cols-3 gap-6">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h3 className={`text-3xl font-bold text-transparent bg-clip-text ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-400 to-blue-500' 
                      : 'bg-gradient-to-r from-teal-600 to-blue-600'
                  }`}>
                    <CountUp end={4} duration={3} />+
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 text-sm`}>
                    Years
                  </p>
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h3 className={`text-3xl font-bold text-transparent bg-clip-text ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-400 to-blue-500' 
                      : 'bg-gradient-to-r from-teal-600 to-blue-600'
                  }`}>
                    <CountUp end={20} duration={4} />+
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 text-sm`}>
                    Projects
                  </p>
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <h3 className={`text-3xl font-bold text-transparent bg-clip-text ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-400 to-blue-500' 
                      : 'bg-gradient-to-r from-teal-600 to-blue-600'
                  }`}>
                    <CountUp end={10} duration={3} />+
                  </h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1 text-sm`}>
                    Tech Stack
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="fade-in">
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'AWS'].map((tech, i) => (
                    <div
                      key={i}
                      className={`px-4 py-2 rounded-lg ${
                        isDark 
                          ? 'bg-gray-900/50 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      } text-sm font-medium transition-all duration-300 hover:scale-105`}
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Editor Display */}
          <div className="flex-1 w-full lg:w-1/2 p-4 mt-12 sm:mt-16 lg:mt-0 lg:pl-16">
            <div className="relative">
              <Editor
                views={editorViews}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}