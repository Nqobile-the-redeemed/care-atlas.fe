import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import type { ReactNode } from 'react'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-screen bg-white text-gray-900'>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
