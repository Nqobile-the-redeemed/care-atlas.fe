import type { Metadata } from 'next'
import { TenderBoardClient } from '@/components/site/TenderBoardClient'
import { Container, CtaBand, SectionHeading } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'UK Care Tenders | Care Atlas Tender Support',
  description:
    'Browse selected UK care, cleaning and supported living tender opportunities and request Care Atlas bidding support.'
}

export default function TendersPage() {
  return (
    <>
      <section className='bg-white py-14 sm:py-16'>
        <Container>
          <SectionHeading
            eyebrow='Tender board'
            title='Find care-sector opportunities and ask for bid support.'
            body='Browse selected public opportunities for care, cleaning, supported living and adjacent services. Care Atlas can help review fit, plan the response and prepare the next action.'
          />
          <div className='mt-10'>
            <TenderBoardClient />
          </div>
        </Container>
      </section>

      <CtaBand
        title='Already found a tender elsewhere?'
        body='Send the link, deadline and buyer details through the enquiry form and Care Atlas will review the opportunity with you.'
        primary={{ label: 'Send Tender Enquiry', href: '/contact' }}
        secondary={{ label: 'View Services', href: '/services' }}
      />
    </>
  )
}
