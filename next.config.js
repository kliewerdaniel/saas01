/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/pocketbase/:path*',
        destination: 'http://localhost:8090/:path*',
      },
    ]
  },
}

module.exports = nextConfig
