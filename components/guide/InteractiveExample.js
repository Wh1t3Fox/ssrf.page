import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function InteractiveExample({
  title,
  tabs,
  explanation,
  runnable = false,
}) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="my-8 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
      {/* Title */}
      {title && (
        <div className="bg-gradient-to-r from-primary-800 to-secondary-800 px-6 py-4">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
        </div>
      )}

      {/* Tabs */}
      {tabs && tabs.length > 1 && (
        <div className="flex border-b border-gray-700 bg-gray-800">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`
                px-6 py-3 text-sm font-medium transition-colors relative
                ${
                  activeTab === index
                    ? 'text-secondary-400 bg-gray-900'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-750'
                }
              `}
            >
              {tab.label}
              {activeTab === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-400" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {tabs && tabs[activeTab] && (
          <div>
            {typeof tabs[activeTab].content === 'string' ? (
              <CodeBlock
                code={tabs[activeTab].content}
                language={tabs[activeTab].language || 'text'}
                copyable={true}
              />
            ) : (
              tabs[activeTab].content
            )}
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300">{explanation}</p>
          </div>
        )}

        {/* Run button (placeholder for future functionality) */}
        {runnable && (
          <button
            className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
            disabled
          >
            Run Example (Coming Soon)
          </button>
        )}
      </div>
    </div>
  )
}
