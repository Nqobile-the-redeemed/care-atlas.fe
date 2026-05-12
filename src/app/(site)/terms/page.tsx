import type { Metadata } from 'next'
import { Container } from '@/components/site/ui'

export const metadata: Metadata = {
  title: 'Terms | Care Atlas',
  description: 'Terms placeholder for Care Atlas consultancy, recruitment, training and technology support enquiries.'
}

const sections = [
  {
    title: 'Website information',
    body: 'Content on this website is general information about Care Atlas services. It does not replace formal legal, regulatory, financial or professional advice specific to a provider.'
  },
  {
    title: 'Consultancy services',
    body: 'Any consultancy engagement should be confirmed through a written scope, deliverables, responsibilities, fees, timescales and client obligations.'
  },
  {
    title: 'Recruitment and candidates',
    body: 'Recruitment features are prepared for candidate interest and employer enquiries. Production terms should define screening, matching, introductions and employer responsibilities.'
  },
  {
    title: 'Technology delivery',
    body: 'Technology work delivered with Cosmonaut Labs should be covered by project scope, maintenance terms, support levels and data processing arrangements.'
  }
]

export default function TermsPage() {
  return (
    <section className='bg-white py-16 sm:py-20'>
      <Container className='max-w-4xl'>
        <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
          Legal
        </p>
        <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Terms</h1>
        <p className='mt-5 text-lg leading-8 text-gray-600'>
          These terms are placeholder content for production refinement. They give the site a complete legal route while
          final wording is reviewed.
        </p>
        <div className='mt-10 space-y-8'>
          {sections.map(section => (
            <section key={section.title}>
              <h2 className='text-2xl font-semibold text-gray-950'>{section.title}</h2>
              <p className='mt-3 text-base leading-8 text-gray-700'>{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </section>
  )
}
