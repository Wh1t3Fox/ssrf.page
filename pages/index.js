import React from 'react'
import Head from '../components/common/Head'
import Footer from '../components/common/Footer'
import Layout from '../components/guide/Layout'
import Section from '../components/guide/Section'
import { guideContent } from '../content/ssrf-guide'

export default function Home() {
  return (
    <>
      <Head />
      <Layout sections={guideContent.sections}>
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400">
            {guideContent.title}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {guideContent.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Comprehensive Guide
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              40+ Code Examples
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security Professional
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              40-60 min read
            </span>
          </div>
        </div>

        {/* Render all sections */}
        {guideContent.sections.map((section) => (
          <Section
            key={section.id}
            id={section.id}
            title={section.title}
            number={section.number}
            level={2}
          >
            {section.content}
          </Section>
        ))}

        <Footer />
      </Layout>
    </>
  )
}
