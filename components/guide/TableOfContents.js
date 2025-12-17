import { useEffect, useState } from 'react'

export default function TableOfContents({ sections, onItemClick }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0,
      }
    )

    // Observe all section headers
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)

      // Observe subsections if they exist
      if (section.subsections) {
        section.subsections.forEach((subsection) => {
          const subElement = document.getElementById(subsection.id)
          if (subElement) observer.observe(subElement)
        })
      }
    })

    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (onItemClick) onItemClick()
    }
  }

  return (
    <nav className="space-y-1">
      {sections.map((section, index) => (
        <div key={section.id}>
          <button
            onClick={() => scrollToSection(section.id)}
            className={`
              w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${
                activeId === section.id
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <span className="text-gray-500 mr-2">{index + 1}.</span>
            {section.title}
          </button>

          {section.subsections && (
            <div className="ml-4 mt-1 space-y-1">
              {section.subsections.map((subsection) => (
                <button
                  key={subsection.id}
                  onClick={() => scrollToSection(subsection.id)}
                  className={`
                    w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors
                    ${
                      activeId === subsection.id
                        ? 'text-secondary-400 bg-gray-800'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }
                  `}
                >
                  {subsection.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
