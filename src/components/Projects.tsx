'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeContext'
import Image from 'next/image'
import PageBackground from './PageBackground'
import ThemeButton from './ThemeButton'

type Project = {
  id: number
  title: string
  description: string
  image: string
  categories: string[]
  link: string
  technologies: string[]
  featured?: boolean
}

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "Portfolio 2025",
    description: "Modern portfolio website with theme transitions and interactive components",
    image: "https://picsum.photos/seed/picsum/1000",
    categories: ["Web Development", "UI/UX"],
    link: "https://github.com/gustavohoze/Portfolio2025",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
  },
  {
    id: 2,
    title: "AI Code Assistant",
    description: "VS Code extension powered by AI to enhance developer productivity",
    image: "https://picsum.photos/seed/picsum/1000",
    categories: ["AI/ML", "Development Tools"],
    link: "https://github.com/yourusername/ai-assistant",
    technologies: ["TypeScript", "Python", "OpenAI API"]
  },
  {
    id: 3,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with real-time inventory management",
    image: "https://picsum.photos/seed/picsum/1000",
    categories: ["Web Development", "Full Stack"],
    link: "https://github.com/yourusername/ecommerce",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe API"]
  },
  {
    id: 4,
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for complex data visualization and analysis",
    image: "https://picsum.photos/seed/picsum/1000",
    categories: ["Data Science", "Web Development"],
    link: "https://github.com/yourusername/dashboard",
    technologies: ["React", "D3.js", "Python", "FastAPI"]
  },
  {
    id: 5,
    title: "Mobile Fitness App",
    description: "Cross-platform fitness tracking application with social features",
    image: "https://picsum.photos/seed/picsum/1000",
    categories: ["Mobile Development", "Health Tech"],
    link: "https://github.com/yourusername/fitness-app",
    technologies: ["React Native", "Firebase", "Node.js", "MongoDB"]
  }
]

type ScreenSize = 'sm' | 'md' | 'lg'

const CARD_SIZES = {
  sm: {
    width: 180,
    height: 240
  },
  md: {
    width: 200,
    height: 270
  },
  lg: {
    width: 220,
    height: 300
  }
}

const CARD_SPREAD: Record<ScreenSize, number[]> = {
  sm: [0],
  md: [-300, -150, 0, 150, 300],
  lg: [-500, -250, 0, 250, 500]
}

const CENTER_OFFSET: Record<ScreenSize, { x: number; y: number }> = {
  sm: { x: -110, y: -150 },
  md: { x: -110, y: -150 },
  lg: { x: -110, y: -150 }
}

export default function Projects() {
  const { isDark } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isFlipped, setIsFlipped] = useState<boolean[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [screenSize, setScreenSize] = useState<ScreenSize>('sm')
  const [mobileProject, setMobileProject] = useState<number>(0)

  // Helper function to render card content
  const renderCard = (project: Project, index: number) => (
    <>
      {/* Card Front */}
      <div 
        className={`absolute inset-0 rounded-2xl cursor-pointer preserve-3d backface-hidden backdrop-blur-md p-[2px] transition-shadow duration-300 ${
          isDark 
            ? 'bg-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]'
            : 'bg-white/80 shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${isFlipped[index] ? '180deg' : '0deg'})`,
          transition: 'transform 0.6s'
        }}
      >
        <div className={`h-full rounded-2xl overflow-hidden ${
          isDark ? 'bg-black/30' : 'bg-white/70'
        } p-2 sm:p-3 flex flex-col`}>
          {/* Image container */}
          <div className="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden mb-2 sm:mb-3 flex-shrink-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Content container */}
          <div className="flex flex-col flex-grow min-h-0">
            <h3 className={`text-sm sm:text-base font-bold mb-1 sm:mb-2 line-clamp-2 flex-shrink-0 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {project.title}
            </h3>

            {/* Categories */}
            <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
              {project.categories.slice(0, 2).map((category, i) => (
                <span
                  key={i}
                  className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] rounded-full ${
                    isDark 
                      ? 'bg-white/5 text-gray-300' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Bottom content */}
            <div className="mt-auto flex-shrink-0">
              <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                {project.technologies.slice(0, 2).map((tech, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 text-[8px] sm:text-[9px] rounded-full ${
                      isDark 
                        ? 'bg-white/10 text-white/90' 
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-[9px] sm:text-[10px] ${
                  isDark 
                    ? 'text-violet-300 hover:text-violet-200' 
                    : 'text-violet-600 hover:text-violet-500'
                } transition-colors`}
                onClick={e => e.stopPropagation()}
              >
                View Project →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Card Back */}
      <div 
        className={`absolute inset-0 rounded-2xl transform-gpu backface-hidden p-[2px] shadow-[0_0_15px_rgba(0,0,0,0.3)] ${
          isDark
            ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600'
            : 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${isFlipped[index] ? '0deg' : '-180deg'})`,
          transition: 'transform 0.6s'
        }}
      >
        <div className="h-full w-full rounded-2xl overflow-hidden">
          <div className="relative h-full w-full">
            <div 
              className={`absolute inset-0 bg-cover bg-center ${
                isDark ? 'opacity-30' : 'opacity-20'
              }`}
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1739475981246-a6d8be7081e2?q=80&w=3078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
              }}
            />
            <div className={`absolute inset-0 ${
              isDark ? 'bg-black/50' : 'bg-black/30'
            }`} />
            <div className="relative h-full flex items-center justify-center">
              <div className={`w-16 h-16 rounded-full backdrop-blur-sm flex items-center justify-center ${
                isDark ? 'bg-white/10' : 'bg-white/30'
              }`}>
                <span className="text-3xl">🎴</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize('sm')
      } else if (width < 1024) {
        setScreenSize('md')
      } else {
        setScreenSize('lg')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setProjects(INITIAL_PROJECTS)
    setIsFlipped(new Array(INITIAL_PROJECTS.length).fill(false))
    setMounted(true)
    setMobileProject(Math.floor(Math.random() * INITIAL_PROJECTS.length))
  }, [])

  const handleShuffle = async () => {
    if (isShuffling) return
    setIsShuffling(true)
    setHoveredCard(null)
  
    // Phase 1: Flip all cards face down
    setIsFlipped(new Array(projects.length).fill(true))
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Phase 2: Shuffle
    const shuffled = [...projects].sort(() => Math.random() - 0.5)
    setProjects(shuffled)
    
    if (screenSize === 'sm') {
      setMobileProject(Math.floor(Math.random() * shuffled.length))
    }
    
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Phase 3: Unflip cards
    setIsFlipped(new Array(projects.length).fill(false))
    
    // Phase 4: End shuffle state
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsShuffling(false)
  }

  const handleCardClick = (project: Project) => {
    if (!isShuffling) {
      setSelectedProject(project)
    }
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      {/* Background */}
      <PageBackground variant="projects" />
      
      {/* Theme Toggle */}
      <ThemeButton className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50" />

      {/* Content Container */}
      <div className={`relative z-10 min-h-[100dvh] flex flex-col ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {/* Title Section */}
        <div className="flex-none pt-20 sm:pt-24 pb-12 sm:pb-16">
          <div className="text-center">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Project Deck
            </h1>
            <div className="h-1 w-16 sm:w-24 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12">
          <div className="relative w-full max-w-7xl h-[400px] sm:h-[450px]">
            <div className="absolute inset-0 flex items-center justify-center">
              {screenSize === 'sm' ? (
                // Mobile View - Single Card
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={projects[mobileProject].id}
                    className="preserve-3d"
                    style={{
                      width: CARD_SIZES[screenSize].width,
                      height: CARD_SIZES[screenSize].height,
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{
                      opacity: 1,
                      scale: isShuffling ? 0.85 : 1,
                      y: 0,
                      rotateY: isFlipped[mobileProject] ? 180 : 0,
                      rotateZ: isShuffling ? (Math.random() - 0.5) * 15 : 0,
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: -50 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                    onClick={() => handleCardClick(projects[mobileProject])}
                  >
                    {renderCard(projects[mobileProject], mobileProject)}
                  </motion.div>
                </AnimatePresence>
              ) : (
                // Desktop View - Card Spread
                <div className="relative perspective-[1200px]" style={{ width: '100%', height: '100%' }}>
                  <AnimatePresence mode="sync">
                    {projects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="absolute top-1/2 left-1/2 preserve-3d"
                        style={{
                          width: CARD_SIZES[screenSize].width,
                          height: CARD_SIZES[screenSize].height,
                          marginLeft: -CARD_SIZES[screenSize].width / 2,
                          marginTop: -CARD_SIZES[screenSize].height / 2,
                          zIndex: hoveredCard === project.id ? 20 : isShuffling ? 10 + index : 10 - index,
                        }}
                        initial={{ opacity: 0, x: 0, scale: 0.8, y: 50 }}
                        animate={{
                          opacity: 1,
                          x: isShuffling ? 0 : CARD_SPREAD[screenSize][index],
                          y: 0,
                          scale: isShuffling ? 0.85 : (hoveredCard === project.id ? 1.1 : 1),
                          rotateY: isFlipped[index] ? 180 : 0,
                          rotateZ: isShuffling ? (Math.random() - 0.5) * 15 : 0,
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.23, 1, 0.32, 1]
                        }}
                        onHoverStart={() => !isShuffling && setHoveredCard(project.id)}
                        onHoverEnd={() => !isShuffling && setHoveredCard(null)}
                        onClick={() => handleCardClick(project)}
                      >
                        {renderCard(project, index)}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex-none py-16 sm:py-20 text-center">
          <motion.button
            onClick={handleShuffle}
            disabled={isShuffling}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500'
            }`}
          >
            {isShuffling ? 'Shuffling...' : 'Shuffle Deck'}
          </motion.button>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[90dvh] ${
                isDark ? 'bg-gray-900' : 'bg-white'
              } rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden`}
            >
              <div className="overflow-y-auto max-h-[90dvh]">
                {/* Modal Header with Image */}
                <div className="relative h-40 sm:h-48 md:h-64 w-full">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isDark ? 'from-gray-900' : 'from-white'
                  } to-transparent`} />
                </div>

                {/* Modal Content */}
                <div className="p-4 sm:p-6">
                  <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedProject.title}
                  </h2>

                  <p className={`text-sm sm:text-base mb-4 sm:mb-6 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {selectedProject.description}
                  </p>

                  {/* Categories */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.categories.map((category, i) => (
                        <span
                          key={i}
                          className={`px-2 sm:px-3 py-1 text-xs rounded-full ${
                            isDark 
                              ? 'bg-gray-800 text-gray-200' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-2 sm:px-3 py-1 text-xs rounded-full ${
                            isDark 
                              ? 'bg-violet-500/20 text-violet-200' 
                              : 'bg-violet-100 text-violet-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 sm:gap-4">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg ${
                        isDark 
                          ? 'text-gray-300 hover:bg-gray-800' 
                          : 'text-gray-600 hover:bg-gray-100'
                      } transition-colors`}
                    >
                      Close
                    </button>
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg ${
                        isDark
                          ? 'bg-violet-500 hover:bg-violet-600 text-white'
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      } transition-colors`}
                    >
                      View Project
                    </a>
                  </div>

                  {/* Social Media Links - Hidden on Mobile */}
                  <div className="hidden sm:flex justify-center gap-4 mt-4 pb-4">
                    <a
                      href={`https://github.com/yourusername/${selectedProject.title.toLowerCase().replace(/\s+/g, '-')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-violet-500 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-violet-500 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .perspective-[1200px] {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
          -webkit-transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
} 