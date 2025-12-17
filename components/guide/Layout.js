import { useState } from 'react'
import TableOfContents from './TableOfContents'
import ProgressBar from './ProgressBar'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Layout({ children, sections }) {
  const [tocOpen, setTocOpen] = useState(false)

  return (
    <div className="min-h-screen relative">
      <ProgressBar />

      {/* Mobile menu button */}
      <button
        onClick={() => setTocOpen(!tocOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 bg-primary-700 p-2 rounded-lg shadow-lg hover:bg-primary-600 transition-colors"
        aria-label="Toggle navigation"
      >
        {tocOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      <div className="flex flex-col lg:flex-row">
        {/* Table of Contents - Sidebar on desktop, overlay on mobile */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 overflow-y-auto z-40
            transition-transform duration-300 ease-in-out
            ${tocOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              SSRF Guide
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Complete Security Reference
            </p>
            <TableOfContents sections={sections} onItemClick={() => setTocOpen(false)} />
          </div>
        </aside>

        {/* Overlay for mobile */}
        {tocOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setTocOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
