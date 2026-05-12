import type { Metadata } from 'next'
import { ButtonLink, Container, CtaBand, SectionHeading } from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'

export const metadata: Metadata = {
  title: 'Care Atlas Case Studies | Care Consultancy Outcomes',
  description:
    'Case-study-ready examples for Care Atlas consultancy outcomes across supported living, compliance, recruitment and care technology.'
}

const caseStudies = [
  {
    title: 'Supported living launch readiness',
    sector: 'Supported living',
    challenge:
      'A founder needed to understand housing structure, documentation, support model and operational responsibilities before moving ahead with a property.',
    outcome:
      'Care Atlas prepared a staged action plan covering housing benefit support, policy readiness, service setup and technology needs.'
  },
  {
    title: 'Compliance system rebuild',
    sector: 'Care agency',
    challenge:
      'A provider had policies, audits and actions spread across multiple files with no clear ownership or review rhythm.',
    outcome:
      'The engagement produced a compliance calendar, document structure, maturity review and audit-readiness checklist.'
  },
  {
    title: 'Recruitment and registered manager pathway',
    sector: 'Growing provider',
    challenge:
      'Hiring needs were urgent but role briefs, candidate data and registered manager requirements were unclear.',
    outcome:
      'Care Atlas structured employer intake, candidate signup and matching criteria for future recruitment workflow integration.'
  }
]

export default function CaseStudiesPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container>
          <div className='max-w-3xl'>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Case studies
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>
              Outcome stories ready for real client proof.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              These case-study-ready blocks show how Care Atlas can present real work later across housing support,
              compliance systems, recruitment, training and technology enablement.
            </p>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Examples'
            title='Structured around challenge, work and outcome.'
            body='Each case study block is prepared for a CMS or admin dashboard with sector, service area, challenge, solution, deliverables and measurable outcomes.'
          />
          <div className='mt-10 grid gap-5 lg:grid-cols-3'>
            {caseStudies.map(item => (
              <article key={item.title} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
                <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>{item.sector}</p>
                <h2 className='mt-3 text-xl font-semibold text-gray-950'>{item.title}</h2>
                <div className='mt-5 space-y-4'>
                  <div>
                    <p className='flex items-center gap-2 text-sm font-semibold text-gray-950'>
                      <SiteIcon name='clipboard' className='text-brand-700 h-4 w-4' />
                      Challenge
                    </p>
                    <p className='mt-2 text-sm leading-6 text-gray-600'>{item.challenge}</p>
                  </div>
                  <div>
                    <p className='flex items-center gap-2 text-sm font-semibold text-gray-950'>
                      <SiteIcon name='check' className='text-success-700 h-4 w-4' />
                      Outcome
                    </p>
                    <p className='mt-2 text-sm leading-6 text-gray-600'>{item.outcome}</p>
                  </div>
                </div>
                <ButtonLink href='/contact#booking' variant='secondary' className='mt-6 w-full'>
                  Discuss similar work
                </ButtonLink>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title='Want Care Atlas to help create your next outcome story?'
        body='A consultation can identify the practical work needed to improve compliance, launch a service, recruit staff or digitise operations.'
        primary={{ label: 'Book Consultation', href: '/contact#booking' }}
        secondary={{ label: 'Explore Services', href: '/services' }}
      />
    </>
  )
}
