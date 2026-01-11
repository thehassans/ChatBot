/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'api.dicebear.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/socket/:path*',
        destination: 'http://localhost:3001/socket/:path*',
      },
    ]
  },
}

module.exports = nextConfig
