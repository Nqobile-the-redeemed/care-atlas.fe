import type { MetadataRoute } from 'next'
import { CARE_ATLAS_ORIGIN, absoluteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/alerts',
          '/avatars',
          '/badge',
          '/bar-chart',
          '/basic-tables',
          '/blank',
          '/buttons',
          '/calendar',
          '/error-404',
          '/form-elements',
          '/images',
          '/line-chart',
          '/modals',
          '/profile',
          '/videos',
          '/signin',
          '/signup',
          '/reset-password',
          '/checkout',
          '/checkout/success',
          '/checkout/cancelled',
          '/checkout/failed',
          '/unsubscribe',
          '/api'
        ]
      }
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: CARE_ATLAS_ORIGIN
  }
}
