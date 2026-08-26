import type { Metadata } from 'next'
import { Container, CtaBand } from '@/components/site/ui'
import { PublicTenderBoard } from '@/features/tenders/PublicTenderBoard'

export const metadata: Metadata = {
  title: 'Tender Navigator | Care Atlas',
  description:
    'Browse UK care, supported living, housing and cleaning tender previews. Unlock the full catalogue and bid support workflow with Care Atlas.'
}

export default function TendersPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container>
          <div className='mx-auto max-w-3xl text-center'>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Tender Navigator
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Care sector tender opportunities.</h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Browse current UK care, housing, cleaning and supported-living tender previews. Unlock the full catalogue
              and connect with Care Atlas bid-support when you need help submitting.
            </p>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-12'>
        <Container>
          <PublicTenderBoard />
        </Container>
      </section>

      <CtaBand
        title='Need help with a specific tender?'
        body='Use the tender board filters above to find relevant opportunities, or send Care Atlas a general bid-support enquiry if you already have a target notice in mind.'
        primary={{ label: 'Book Bid Support', href: '/contact#booking' }}
        secondary={{ label: 'Send a Tender Enquiry', href: '/contact' }}
      />
    </>
  )
}
