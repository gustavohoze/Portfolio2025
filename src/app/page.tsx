'use client'

import { PageProvider, usePage } from '@/components/PageContext'
import PageTransition from '@/components/PageTransition'
import Layout from '@/components/Layout'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'

function PageContent() {
  const { currentPage } = usePage()
  
  const components = {
    hero: <Hero />,
    projects: <Projects />,
    contact: <Contact />
  }

  return (
    <PageTransition>
      {components[currentPage as keyof typeof components]}
    </PageTransition>
  )
}

export default function Home() {
  return (
    <PageProvider>
      <Layout>
        <PageContent />
      </Layout>
    </PageProvider>
  )
} 