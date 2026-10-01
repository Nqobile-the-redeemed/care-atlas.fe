import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'careatlas.co.uk'
          }
        ],
        destination: 'https://www.careatlas.co.uk/:path*',
        permanent: true
      },
      {
        source: '/:malformed(\\$|&)',
        destination: '/',
        permanent: true
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      exclude: /[\\/]src[\\/]app[\\/]icon\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}

export default nextConfig
