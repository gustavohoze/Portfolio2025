'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from './ThemeContext'
import PageBackground from './PageBackground'
import ThemeButton from './ThemeButton'
import gsap from 'gsap'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { emailConfig } from '@/config/emailjs'

type FormData = {
  name: string
  email: string
  message: string
}

type NotificationType = {
  type: 'success' | 'error'
  message: string
}

export default function Contact() {
  const { isDark } = useTheme()
  const formRef = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const contactInfoRef = useRef<HTMLDivElement>(null)
  const socialMediaRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.Context | null>(null)
  const cleanupFunctionsRef = useRef<(() => void)[]>([])
  const notificationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<NotificationType | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  })

  // Clear notification with timeout
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
    
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
      notificationTimeoutRef.current = undefined
    }, 5000)
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // Initialize EmailJS with your public key
      emailjs.init(emailConfig.publicKey)

      // Send auto-reply email to the sender
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.autoReplyTemplateId,
        {
          to_name: formData.name,
          to_email: formData.email,
          from_name: "Gustavo",
          from_email: "gustaveronic@gmail.com",
          message: formData.message,
          reply_to: formData.email
        }
      )

      // Send the actual message to you
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.contactFormTemplateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: "Gustavo",
          to_email: "gustaveronic@gmail.com",
          reply_to: formData.email
        }
      )

      // Show success notification and reset form
      showNotification('success', 'Message sent successfully! Please check your email.')
      setFormData({
        name: '',
        email: '',
        message: ''
      })

    } catch (error) {
      console.error('Failed to send email:', error)
      showNotification('error', 'Failed to send message. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleanup function
  const cleanup = useCallback(() => {
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
      notificationTimeoutRef.current = undefined
    }
    
    setIsSubmitting(false)
    setNotification(null)
    
    if (animationRef.current) {
      animationRef.current.revert()
      animationRef.current = null
    }
    
    cleanupFunctionsRef.current.forEach(cleanup => cleanup())
    cleanupFunctionsRef.current = []
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  useEffect(() => {
    // GSAP animations
    const ctx = gsap.context(() => {
      // Initial setup - move elements out of view
      gsap.set([titleRef.current, lineRef.current, subtitleRef.current], {
        y: 50,
        opacity: 0
      })
      
      gsap.set([formRef.current], {
        y: 100,
        opacity: 0
      })

      // Set initial state for mobile elements
      const mobileElements = document.querySelectorAll('.mobile-contact-item')
      const mobileContainer = document.querySelector('.mobile-container')
      gsap.set(mobileElements, {
        y: 50,
        opacity: 0
      })
      gsap.set(mobileContainer, {
        opacity: 0,
        scale: 0.95
      })

      // Create timeline for entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      // Header animations
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8
      })
      .to(lineRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5
      }, "-=0.4")
      .to(subtitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5
      }, "-=0.3")

      // Mobile container background animation
      .to(mobileContainer, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2")

      // Mobile elements animation
      .to(mobileElements, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1
      }, "-=0.4")

      // Form animation
      .to(formRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8
      }, "-=0.4")

      // Add hover animations for input fields
      if (formRef.current) {
        const inputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
        inputs.forEach((input) => {
          const handleFocus = () => {
            gsap.to(input, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out"
            })
          }

          const handleBlur = () => {
            gsap.to(input, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            })
          }

          input.addEventListener('focus', handleFocus)
          input.addEventListener('blur', handleBlur)

          cleanupFunctionsRef.current.push(() => {
            input.removeEventListener('focus', handleFocus)
            input.removeEventListener('blur', handleBlur)
          })
        })
      }
    })

    // Store the context for cleanup
    animationRef.current = ctx

    return () => {
      // Clear any pending notification timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
      
      // Reset states
      setIsSubmitting(false)
      setNotification(null)
      
      // Clean up GSAP animations
      if (animationRef.current) {
        animationRef.current.revert()
      }
      
      // Clear other cleanup functions
      cleanupFunctionsRef.current.forEach(cleanup => cleanup())
      cleanupFunctionsRef.current = []
    }
  }, [])

  return (
    <section className={`relative h-screen w-screen ${
      isDark ? 'bg-[#030304] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <ThemeButton className="fixed top-6 right-6 z-50" />
      <PageBackground variant="contact" />
      
      {/* Notification */}
      <AnimatePresence mode="wait">
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed left-1/2 -translate-x-1/2 mx-auto top-6 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? (isDark ? 'bg-green-500/90' : 'bg-green-600') 
                : (isDark ? 'bg-red-500/90' : 'bg-red-600')
            } text-white text-sm sm:text-base font-medium backdrop-blur-sm w-[90%] max-w-md text-center`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 ref={titleRef} className={`text-3xl sm:text-4xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Get in Touch
          </h2>
          <div ref={lineRef} className={`h-1 w-20 mx-auto mt-4 ${
            isDark 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600'
          }`} />
          <p ref={subtitleRef} className={`mt-4 text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Let's work together on your next project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Contact Info & Social Media */}
          <div className="flex flex-col space-y-4">
            {/* Desktop Contact Info */}
            <div ref={contactInfoRef} className={`hidden sm:block p-5 rounded-lg ${
              isDark ? 'bg-gray-900/50' : 'bg-white'
            } shadow-xl backdrop-blur-sm`}>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="flex flex-col space-y-4">
                <motion.a 
                  href="mailto:gustaveronic@gmail.com"
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="group-hover:text-cyan-500 transition-colors">
                    gustaveronic@gmail.com
                  </span>
                </motion.a>
                <motion.a 
                  href="tel:+6285104937022"
                  className="flex items-center space-x-4 group"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="group-hover:text-cyan-500 transition-colors">
                    +62 851 0493 7022
                  </span>
                </motion.a>
              </div>
            </div>

            {/* Desktop Social Media */}
            <div ref={socialMediaRef} className={`hidden sm:block p-5 rounded-lg ${
              isDark ? 'bg-gray-900/50' : 'bg-white'
            } shadow-xl backdrop-blur-sm`}>
              <h3 className="text-xl font-semibold mb-4">Social Media</h3>
              <div className="flex items-center space-x-6">
                <motion.a 
                  href="https://github.com/gustavohoze" 
                  className="text-cyan-500 hover:text-cyan-400 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/gustavo-hoze/" 
                  className="text-cyan-500 hover:text-cyan-400 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </motion.a>
              </div>
            </div>

            {/* Mobile Contact Info & Social Media */}
            <div className="sm:hidden">
              <div className={`mobile-container p-5 rounded-lg ${
                isDark ? 'bg-gray-900/50' : 'bg-white'
              } shadow-xl backdrop-blur-sm space-y-6`}>
                {/* Mobile Contact Info */}
                <div className="mobile-contact-item">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="flex flex-col space-y-4">
                    <motion.a
                      href="mailto:gustaveronic@gmail.com"
                      className="flex items-center space-x-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        gustaveronic@gmail.com
                      </span>
                    </motion.a>
                    
                    <motion.a
                      href="tel:+6285104937022"
                      className="flex items-center space-x-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex-shrink-0">
                        <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        +62 851 0493 7022
                      </span>
                    </motion.a>
                  </div>
                </div>

                {/* Mobile Social Media */}
                <div className="mobile-contact-item">
                  <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                  <div className="flex justify-center space-x-8">
                    <motion.a 
                      href="https://github.com/gustavohoze" 
                      className="text-cyan-500"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </motion.a>
                    <motion.a 
                      href="https://www.linkedin.com/in/gustavo-hoze/" 
                      className="text-cyan-500"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <form 
            ref={formRef} 
            onSubmit={handleSubmit}
            className={`p-5 rounded-lg ${
              isDark ? 'bg-gray-900/50' : 'bg-white'
            } shadow-xl backdrop-blur-sm space-y-4 flex flex-col max-h-[600px]`}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' 
                    : 'bg-white border-gray-300 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' 
                    : 'bg-white border-gray-300 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300`}
              />
            </div>
            <div className="flex-1 min-h-0">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border resize-y ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' 
                    : 'bg-white border-gray-300 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300 min-h-[100px] max-h-[200px]`}
              />
            </div>
            <div className="flex-shrink-0 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-lg ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
                } text-white font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
} 