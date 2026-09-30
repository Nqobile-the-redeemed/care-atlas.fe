import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { CARE_ATLAS_ORIGIN, defaultOgImage } from '@/lib/seo'
import { StoreProvider } from './providers'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '1472745578238114'
const MICROSOFT_CLARITY_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID

const metaPixelScript = `
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${META_PIXEL_ID}');
  fbq('track', 'PageView');
`

const microsoftClarityScript = MICROSOFT_CLARITY_ID
  ? `
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${MICROSOFT_CLARITY_ID}");
  `
  : null

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
        <Script id='meta-pixel' strategy='afterInteractive' dangerouslySetInnerHTML={{ __html: metaPixelScript }} />
        {microsoftClarityScript && (
          <Script
            id='microsoft-clarity'
            strategy='afterInteractive'
            dangerouslySetInnerHTML={{ __html: microsoftClarityScript }}
          />
        )}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height='1'
            width='1'
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=''
          />
        </noscript>
        <StoreProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
