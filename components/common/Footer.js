export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-gray-800 bg-gray-900 bg-opacity-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            {currentYear} SSRF.page - A comprehensive guide to Server-Side Request Forgery vulnerabilities
          </p>
          <p className="text-gray-500 text-xs mt-2">
            For educational and authorized security testing purposes only
          </p>
        </div>
      </div>
    </footer>
  )
}
