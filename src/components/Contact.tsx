'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './ThemeContext'
import PageBackground from './PageBackground'
import ThemeButton from './ThemeButton'
import gsap from 'gsap'

export default function Contact() {
  const { isDark } = useTheme()
  const formRef = useRef<HTMLFormElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const contactInfoRef = useRef<HTMLDivElement>(null)
  const socialMediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // GSAP animations
    const ctx = gsap.context(() => {
      // Initial setup - move elements out of view
      gsap.set([titleRef.current, lineRef.current, subtitleRef.current], {
        y: 50,
        opacity: 0
      })
      
      gsap.set([formRef.current, contactInfoRef.current, socialMediaRef.current], {
        y: 100,
        opacity: 0
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

      // Contact info and social media animations
      .to(contactInfoRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8
      }, "-=0.2")
      .to(socialMediaRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8
      }, "-=0.6")

      // Form animation
      .to(formRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8
      }, "-=0.6")

      // Add hover animations for input fields
      if (formRef.current) {
        const inputs = formRef.current.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
        inputs.forEach((input) => {
          input.addEventListener('focus', () => {
            gsap.to(input, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out"
            })
          })
          input.addEventListener('blur', () => {
            gsap.to(input, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            })
          })
        })
      }

      // Add hover animations for social media icons
      if (socialMediaRef.current) {
        const socialIcons = socialMediaRef.current.querySelectorAll('a')
        socialIcons.forEach((icon) => {
          icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              y: -3,
              scale: 1.1,
              duration: 0.3,
              ease: "power2.out"
            })
          })
          icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              y: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            })
          })
        })
      }

      // Add hover animations for contact info items
      if (contactInfoRef.current) {
        const contactItems = contactInfoRef.current.querySelectorAll('a')
        contactItems.forEach((item) => {
          item.addEventListener('mouseenter', () => {
            gsap.to(item, {
              x: 5,
              duration: 0.3,
              ease: "power2.out"
            })
          })
          item.addEventListener('mouseleave', () => {
            gsap.to(item, {
              x: 0,
              duration: 0.3,
              ease: "power2.out"
            })
          })
        })
      }
    }, formRef)

    return () => ctx.revert() // Cleanup animations
  }, [])

  return (
    <section className={`relative h-screen w-screen ${
      isDark ? 'bg-[#030304] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <ThemeButton className="fixed top-6 right-6 z-50" />
      <PageBackground variant="contact" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div ref={contactInfoRef} className={`p-6 rounded-lg ${
              isDark ? 'bg-gray-900/50' : 'bg-white'
            } shadow-xl backdrop-blur-sm`}>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:contact@example.com" className="hover:text-cyan-500 transition-colors">
                    contact@example.com
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+1234567890" className="hover:text-cyan-500 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
            </div>

            <div ref={socialMediaRef} className={`p-6 rounded-lg ${
              isDark ? 'bg-gray-900/50' : 'bg-white'
            } shadow-xl backdrop-blur-sm`}>
              <h3 className="text-xl font-semibold mb-4">Social Media</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form ref={formRef} className={`p-6 rounded-lg ${
            isDark ? 'bg-gray-900/50' : 'bg-white'
          } shadow-xl backdrop-blur-sm space-y-6`}>
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' 
                    : 'bg-white border-gray-300 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' 
                    : 'bg-white border-gray-300 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 focus:border-cyan-500' 
                    : 'bg-white border-gray-300 focus:border-cyan-500'
                } focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all duration-300`}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
              } text-white font-medium transition-all duration-300 transform hover:scale-[1.02]`}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
} 