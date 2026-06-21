import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
