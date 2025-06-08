'use client'

import { useState } from 'react'
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

const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio 2025",
    description: "Modern portfolio website with theme transitions and interactive components",
    image: "/Portfolio2025/projects/portfolio.jpg",
    categories: ["Web Development", "UI/UX"],
    link: "https://github.com/gustavohoze/Portfolio2025",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    featured: true
  },
  {
    id: 2,
    title: "AI Code Assistant",
    description: "VS Code extension powered by AI to enhance developer productivity",
    image: "/Portfolio2025/projects/ai-assistant.jpg",
    categories: ["AI/ML", "Development Tools"],
    link: "https://github.com/yourusername/ai-assistant",
    technologies: ["TypeScript", "Python", "OpenAI API"],
    featured: true
  },
  {
    id: 3,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with real-time inventory management",
    image: "/Portfolio2025/projects/ecommerce.jpg",
    categories: ["Web Development", "Full Stack"],
    link: "https://github.com/yourusername/ecommerce",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe API"]
  },
  {
    id: 4,
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for complex data visualization and analysis",
    image: "/Portfolio2025/projects/dashboard.jpg",
    categories: ["Data Science", "Web Development"],
    link: "https://github.com/yourusername/dashboard",
    technologies: ["React", "D3.js", "Python", "FastAPI"]
  }
]

const categories = ["All", "Featured", "Web Development", "AI/ML", "Data Science", "Full Stack", "UI/UX", "Development Tools"]

export default function Projects() {
  const { isDark } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState("Featured")
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const filteredProjects = projects.filter(project => 
    selectedCategory === "All" 
      ? true 
      : selectedCategory === "Featured" 
        ? project.featured 
        : project.categories.includes(selectedCategory)
  )

  return (
    <section className={`relative h-screen w-screen ${
      isDark ? 'bg-[#030304] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <ThemeButton className="fixed top-6 right-6 z-50" />
      <PageBackground variant="projects" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className={`text-3xl sm:text-4xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Featured Projects
          </h2>
          <div className={`h-1 w-20 mx-auto mt-4 ${
            isDark 
              ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' 
              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600'
          }`} />
          <p className={`mt-4 text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            A showcase of my recent work and side projects
          </p>
        </div>

        {/* Category Filter - Make it sticky */}
        <div className="sticky top-0 py-4 backdrop-blur-md z-50 -mx-4 px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? isDark
                      ? 'bg-teal-500 text-white'
                      : 'bg-teal-600 text-white'
                    : isDark
                    ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200/80 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-xl overflow-hidden"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className={`absolute inset-0 ${
                  isDark ? 'bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10' : 'bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10'
                }`} />
                <div className={`relative overflow-hidden rounded-xl ${
                  isDark ? 'bg-gray-900/50' : 'bg-white'
                } shadow-xl backdrop-blur-sm`}>
                  {/* Project Image with Next.js Image optimization */}
                  <div className="aspect-video w-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 relative overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="object-cover"
                      priority={project.featured}
                    />
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDark
                            ? 'bg-teal-500/20 text-teal-400'
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          Featured
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-4 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-xs rounded-md ${
                            isDark
                              ? 'bg-violet-500/20 text-violet-300'
                              : 'bg-violet-100 text-violet-700'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-4">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium ${
                          isDark
                            ? 'text-violet-400 hover:text-violet-300'
                            : 'text-violet-600 hover:text-violet-500'
                        } transition-colors`}
                      >
                        View Project →
                      </a>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium ${
                          isDark
                            ? 'text-violet-400 hover:text-violet-300'
                            : 'text-violet-600 hover:text-violet-500'
                        } transition-colors`}
                      >
                        Source Code
                      </a>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <AnimatePresence>
                    {hoveredProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center z-20"
                      >
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-6 py-3 rounded-lg ${
                            isDark
                              ? 'bg-teal-500 text-white hover:bg-teal-400'
                              : 'bg-teal-600 text-white hover:bg-teal-500'
                          } transition-colors duration-300`}
                        >
                          View Project
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
} 