import type { Metadata } from 'next'
import { TenderBoardClient } from '@/components/site/TenderBoardClient'
import { Container, CtaBand } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Tender Navigator | Care Atlas',
  description:
    'Browse current UK care, supported living, housing and cleaning tenders for free, then book a Care Atlas bid-support meeting.'
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
              Browse the full public board for current UK care, housing, cleaning and supported-living tenders. Open an
              opportunity to review the detail, then book a bid-support meeting when you want help submitting.
            </p>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-12'>
        <Container>
          <TenderBoardClient />
        </Container>
      </section>

      <CtaBand
        title='Need help with a specific tender?'
        body='Use the tender board filters above to find relevant opportunities, or send Care Atlas a general bid-support enquiry if you already have a target notice in mind.'
        primary={{ label: 'Book a Tender Meeting', href: '/contact#booking' }}
        secondary={{ label: 'Send a Tender Enquiry', href: '/contact' }}
      />
    </>
  )
}
