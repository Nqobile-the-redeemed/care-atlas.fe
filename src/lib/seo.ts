import type { Metadata } from 'next'
import { blogPosts, services, site } from '@/data/site'
import { jobRoles } from '@/data/careers'

export const CARE_ATLAS_ORIGIN = 'https://www.careatlas.co.uk'

export const defaultOgImage = {
  url: '/images/logo/care-atlas-logo.svg',
  width: 1200,
  height: 630,
  alt: 'Care Atlas'
}

export function absoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return new URL(normalizedPath, CARE_ATLAS_ORIGIN).toString()
}

export function publicPageMetadata({
  title,
  description,
  path,
  type = 'website',
  image = defaultOgImage
}: {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: typeof defaultOgImage
}): Metadata {
  const canonical = absoluteUrl(path)

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: 'en_GB',
      type,
      images: [image]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        {
          url: image.url,
          alt: image.alt
        }
      ]
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

export function noIndexMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false
    }
  }
}

export const corePublicPaths = [
  '/',
  '/about',
  '/services',
  '/tenders',
  '/training',
  '/careers',
  '/blog',
  '/case-studies',
  '/faq',
  '/contact',
  '/technology-partner/cosmonaut-labs',
  '/privacy-policy',
  '/terms',
  '/cookies'
]

export function sitemapEntries() {
  const staticEntries = corePublicPaths.map(path => ({
    url: absoluteUrl(path),
    lastModified: new Date('2026-09-17')
  }))

  const serviceEntries = services.map(service => ({
    url: absoluteUrl(service.href),
    lastModified: new Date('2026-09-17')
  }))

  const blogEntries = blogPosts.map(post => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date)
  }))

  const careerEntries = jobRoles.map(role => ({
    url: absoluteUrl(`/careers/${role.slug}`),
    lastModified: new Date('2026-09-17')
  }))

  return [...staticEntries, ...serviceEntries, ...blogEntries, ...careerEntries]
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${CARE_ATLAS_ORIGIN}/#organization`,
    name: site.name,
    url: CARE_ATLAS_ORIGIN,
    email: site.email,
    telephone: site.phone,
    description: site.summary
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${CARE_ATLAS_ORIGIN}/#website`,
    name: site.name,
    url: CARE_ATLAS_ORIGIN,
    publisher: {
      '@id': `${CARE_ATLAS_ORIGIN}/#organization`
    },
    inLanguage: 'en-GB'
  }
}

export function serviceJsonLd(service: (typeof services)[number]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absoluteUrl(service.href)}#service`,
    name: service.title,
    description: service.summary,
    provider: {
      '@id': `${CARE_ATLAS_ORIGIN}/#organization`
    },
    areaServed: 'United Kingdom',
    url: absoluteUrl(service.href),
    serviceType: service.category
  }
}

export function articleJsonLd(post: (typeof blogPosts)[number]) {
  const url = absoluteUrl(`/blog/${post.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author
    },
    publisher: {
      '@id': `${CARE_ATLAS_ORIGIN}/#organization`
    },
    mainEntityOfPage: url,
    inLanguage: 'en-GB'
  }
}
