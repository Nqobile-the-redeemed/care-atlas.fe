import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'
import { PublicTenderBoard } from '@/features/tenders/PublicTenderBoard'

export const metadata: Metadata = {
  title: 'Care Atlas Tender Navigator | UK Care, Housing and Cleaning Opportunities',
  description:
    'Browse current UK care, housing and cleaning tender previews, then start a 14-day Tender Navigator trial or request Care Atlas bid support.'
}

export default function TenderNavigatorPage() {
  return (
    <>
      <section className='bg-brand-950 py-12 text-white sm:py-14'>
        <Container>
          <p className='text-blue-light-200 text-xs font-semibold tracking-[0.1em] uppercase'>Tender Navigator</p>
          <h1 className='mt-3 max-w-4xl text-3xl font-semibold sm:text-4xl'>
            Find care-sector opportunities worth pursuing.
          </h1>
          <p className='text-blue-light-100 mt-4 max-w-3xl text-base leading-7 sm:text-lg'>
            Browse a focused preview of live UK care, housing and cleaning opportunities. Unlock the full catalogue,
            saved tenders and Care Atlas bid support with a 14-day trial.
          </p>
          <div className='text-blue-light-100 mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm'>
            <span>14 days free</span>
            <span>Then £5 + VAT monthly</span>
            <span>Cancel through Stripe</span>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-10 sm:py-12'>
        <Container>
          <PublicTenderBoard />
          <p className='mt-5 text-xs leading-5 text-gray-500'>
            Opportunities are supplied from official or licensed procurement sources. Missing values are shown as “Not
            stated”. Care Atlas pricing is indicative and separate from the Tender Navigator subscription.
          </p>
        </Container>
      </section>
    </>
  )
}
