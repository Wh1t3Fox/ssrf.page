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
}

module.exports = nextConfig
