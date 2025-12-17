/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export
  output: 'export',
  // Ensure compatibility with static export
  images: {
    unoptimized: true,
  },
  // Trailing slash for consistent routing
  trailingSlash: true,
  // Transpile ESM packages for compatibility
  transpilePackages: ['react-syntax-highlighter', 'refractor'],
}

module.exports = nextConfig
