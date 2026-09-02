import { SiteFooter } from '@/components/site/SiteFooter'
import { HalfScreenModal } from '@/components/site/HalfScreenModal'
import { SiteHeader } from '@/components/site/SiteHeader'
import { WhatsappChatBox } from '@/components/site/WhatsappChatBox'
import { HalfScreenModalProvider } from '@/context/HalfScreenModalContext'
import type { ReactNode } from 'react'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <HalfScreenModalProvider>
      <div className='min-h-screen bg-white text-gray-900'>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <WhatsappChatBox />
        <HalfScreenModal />
      </div>
    </HalfScreenModalProvider>
  )
}
