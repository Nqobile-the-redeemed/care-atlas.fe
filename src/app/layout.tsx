import type { Metadata } from 'next'
import './globals.css'

import { SidebarProvider } from '@/context/SidebarContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { StoreProvider } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'Care Atlas | UK Care Consultancy and Care Services Support',
    template: '%s'
  },
  description:
    'Care Atlas supports UK care providers with consultancy, compliance, registration, recruitment, training, websites and technology systems.',
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
