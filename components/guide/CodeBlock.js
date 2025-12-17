'use client'

import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function CodeBlock({
  code,
  language = 'text',
  showLineNumbers = true,
  highlightLines = [],
  filename = null,
  copyable = true,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="code-block my-6 relative group">
      {/* Header with language badge and copy button */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-secondary-400 uppercase tracking-wide">
            {language}
          </span>
          {filename && (
            <span className="text-xs text-gray-400">
              {filename}
            </span>
          )}
        </div>

        {copyable && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-200 transition-colors rounded hover:bg-gray-700"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Code content */}
      <div className="relative rounded-b-lg overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          showLineNumbers={showLineNumbers}
          wrapLines={highlightLines.length > 0}
          lineProps={(lineNumber) => {
            const style = { display: 'block' }
            if (highlightLines.includes(lineNumber)) {
              style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
              style.borderLeft = '3px solid #3b82f6'
            }
            return { style }
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#1e1e1e',
            fontSize: '0.875rem',
            borderRadius: '0 0 0.5rem 0.5rem',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
