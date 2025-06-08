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

const CARD_SPREAD = [-500, -250, 0, 250, 500]
const CENTER_OFFSET = { x: -110, y: -150 }

export default function Projects() {
  const { isDark } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isFlipped, setIsFlipped] = useState<boolean[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    setProjects(INITIAL_PROJECTS)
    setIsFlipped(new Array(INITIAL_PROJECTS.length).fill(false))
    setMounted(true)
  }, [])

  const handleShuffle = async () => {
    if (isShuffling) return
    setIsShuffling(true)
    setHoveredCard(null)
  
    // Phase 1: Collect cards to center (300ms)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Phase 2: Flip all cards (600ms)
    setIsFlipped(prev => prev.map(() => true))
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Phase 3: Shuffle the array while cards are flipped
    const shuffled = [...INITIAL_PROJECTS].sort(() => Math.random() - 0.5)
    setProjects(shuffled)
    
    // Phase 4: Small delay for effect (200ms)
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Phase 5: Unflip and spread cards (600ms)
    setIsFlipped(prev => prev.map(() => false))
    
    // Phase 6: End shuffle state after spread animation completes
    await new Promise(resolve => setTimeout(resolve, 600))
    setIsShuffling(false)
  }

  const handleCardClick = (project: Project) => {
    if (!isShuffling) {
      setSelectedProject(project)
    }
  }

  if (!mounted) return null

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background */}
      <PageBackground variant="projects" />
      
      {/* Theme Toggle */}
      <ThemeButton className="fixed top-6 right-6 z-50" />

      {/* Content Container */}
      <div className={`relative z-10 h-full flex flex-col ${
        isDark ? 'bg-[#030304]/50' : 'bg-gray-50/50'
      }`}>
        {/* Title Section */}
        <div className="flex-none pt-20">
          <div className="text-center">
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Project Deck
            </h1>
            <div className="h-1 w-20 mx-auto bg-gradient-to-r from-violet-500 to-fuchsia-500" />
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-[1200px] h-[320px]">
            <AnimatePresence mode="wait">
              {projects.map((project, index) => (
                <motion.div
                key={project.id}
                className="absolute left-1/2 top-1/2 preserve-3d"
                animate={{
                  x: isShuffling 
                    ? CENTER_OFFSET.x + (Math.random() - 0.5) * 10 // Add tiny random offset for realistic shuffle
                    : CARD_SPREAD[index] + CENTER_OFFSET.x,
                  y: isShuffling 
                    ? CENTER_OFFSET.y + (Math.random() - 0.5) * 10 // Add tiny random offset
                    : CENTER_OFFSET.y,
                  z: isShuffling ? index * 1 : 0,
                  scale: isShuffling ? 0.85 : (hoveredCard === project.id ? 1.1 : 1),
                  rotateY: isFlipped[index] ? 180 : 0,
                  rotateZ: isShuffling ? (Math.random() - 0.5) * 15 : 0, // Add slight rotation during shuffle
                }}
                style={{
                  transform: 'translate(-50%, -50%)',
                  zIndex: isShuffling ? 10 + index : index,
                }}
                transition={{
                  duration: isShuffling ? 0.3 : 0.6,
                  ease: isShuffling ? "easeInOut" : [0.23, 1, 0.32, 1]
                }}
                onHoverStart={() => !isShuffling && setHoveredCard(project.id)}
                onHoverEnd={() => !isShuffling && setHoveredCard(null)}
                onClick={() => handleCardClick(project)}
              >
                  {/* Card Front */}
                  <div 
                    className={`absolute inset-0 w-[220px] h-[300px] rounded-2xl cursor-pointer transform-gpu backface-hidden backdrop-blur-md p-[2px] transition-shadow duration-300 ${
                      isDark 
                        ? 'bg-white/10 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]'
                        : 'bg-white/80 shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]'
                    }`}
                    style={{
                      transform: `rotateY(${isFlipped[index] ? '180deg' : '0deg'})`,
                      transition: 'transform 0.6s'
                    }}
                  >
                    <div className={`h-full rounded-2xl overflow-hidden ${
                      isDark ? 'bg-black/30' : 'bg-white/70'
                    } p-3 flex flex-col`}>
                      {/* Image container with fixed height */}
                      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3 flex-shrink-0">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      
                      {/* Content container with flex layout */}
                      <div className="flex flex-col flex-grow min-h-0">
                        <h3 className={`text-base font-bold mb-2 line-clamp-2 flex-shrink-0 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {project.title}
                        </h3>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.categories.slice(0, 2).map((category, i) => (
                            <span
                              key={i}
                              className={`px-1.5 py-0.5 text-[9px] rounded-full ${
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
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.technologies.slice(0, 2).map((tech, i) => (
                              <span
                                key={i}
                                className={`px-1.5 py-0.5 text-[9px] rounded-full ${
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
                            className={`inline-flex items-center text-[10px] ${
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
                    className={`absolute inset-0 w-[220px] h-[300px] rounded-2xl transform-gpu backface-hidden p-[2px] shadow-[0_0_15px_rgba(0,0,0,0.3)] ${
                      isDark
                        ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600'
                        : 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
                    }`}
                    style={{
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
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex-none pb-20 text-center">
          <motion.button
            onClick={handleShuffle}
            disabled={isShuffling}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-3 rounded-full text-lg font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500'
            }`}
          >
            {isShuffling ? 'Shuffling...' : 'Shuffle Deck'}
          </motion.button>
        </div>
      </div>

      {/* Detailed Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
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
              className={`relative w-[90%] max-w-2xl max-h-[90vh] ${
                isDark ? 'bg-gray-900' : 'bg-white'
              } rounded-2xl shadow-2xl overflow-hidden`}
            >
              <div className="overflow-y-auto max-h-[90vh]">
                {/* Modal Header with Image */}
                <div className="relative h-48 sm:h-64 w-full">
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
                <div className="p-6">
                  <h2 className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {selectedProject.title}
                  </h2>

                  <p className={`text-sm mb-6 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {selectedProject.description}
                  </p>

                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.categories.map((category, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 text-xs rounded-full ${
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
                  <div className="mb-6">
                    <h3 className={`text-sm font-semibold mb-2 ${
                      isDark ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 text-xs rounded-full ${
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
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className={`px-4 py-2 text-sm rounded-lg ${
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
                      className={`px-4 py-2 text-sm rounded-lg ${
                        isDark
                          ? 'bg-violet-500 hover:bg-violet-600 text-white'
                          : 'bg-violet-600 hover:bg-violet-700 text-white'
                      } transition-colors`}
                    >
                      View Project
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
} 