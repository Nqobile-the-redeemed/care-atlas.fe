import type { Metadata } from 'next'
import './globals.css'

import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { CARE_ATLAS_ORIGIN, defaultOgImage } from '@/lib/seo'
import { StoreProvider } from './providers'

export const metadata: Metadata = {
  metadataBase: new URL(CARE_ATLAS_ORIGIN),
  title: {
    default: 'Care Atlas | UK Care Consultancy and Care Services Support',
    template: '%s'
  },
  description:
    'Care Atlas supports UK care providers with consultancy, compliance, registration, recruitment, training, websites and technology systems.',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: CARE_ATLAS_ORIGIN,
    siteName: 'Care Atlas',
    title: 'Care Atlas | UK Care Consultancy and Care Services Support',
    description:
      'Care Atlas supports UK care providers with consultancy, compliance, registration, recruitment, training, websites and technology systems.',
    images: [defaultOgImage]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care Atlas | UK Care Consultancy and Care Services Support',
    description:
      'Care Atlas supports UK care providers with consultancy, compliance, registration, recruitment, training, websites and technology systems.',
    images: [{ url: defaultOgImage.url, alt: defaultOgImage.alt }]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/logo/care-atlas-logo.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/images/logo/care-atlas-logo.svg'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en-GB'>
      <body className='bg-white dark:bg-gray-900'>
        <StoreProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
