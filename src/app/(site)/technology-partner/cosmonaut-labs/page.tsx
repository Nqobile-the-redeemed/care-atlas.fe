import type { Metadata } from 'next'
import { LeadForm } from '@/components/site/LeadForm'
import { ButtonLink, Container, CtaBand, ProcessTimeline, SectionHeading } from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'

export const metadata: Metadata = {
  title: 'Cosmonaut Labs Technology Partner | Care Atlas',
  description:
    'Cosmonaut Labs is the technology partner behind Care Atlas digital systems, websites, software, dashboards and technical enablement for care providers.'
}

const capabilities = [
  'Website design for care providers',
  'Booking and consultation workflows',
  'Candidate and employer recruitment forms',
  'CRM and lead routing structures',
  'Dashboards, portals and internal tools',
  'Care operations software planning'
]

const process = [
  {
    title: 'Care problem',
    body: 'Care Atlas defines the operational, compliance or recruitment problem with the client.'
  },
  {
    title: 'Digital brief',
    body: 'The requirement is translated into screens, workflows, data capture and integration needs.'
  },
  {
    title: 'Build path',
    body: 'Cosmonaut Labs shapes the technical route for websites, portals, forms, dashboards or custom software.'
  },
  {
    title: 'Support',
    body: 'The solution can be maintained, improved and connected to analytics, CRM or admin systems over time.'
  }
]

export default function CosmonautLabsPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Technology partner
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>
              Cosmonaut Labs powers Care Atlas digital delivery.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Cosmonaut Labs is the technology partner behind digital systems, websites, software and technical
              enablement for Care Atlas clients. The partnership helps care businesses move from operational need to
              supportable digital solution.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/services/websites-technology-systems-support' variant='primary'>
                Explore Technology Support
              </ButtonLink>
              <ButtonLink href='/contact#booking' variant='secondary'>
                Book Consultation
              </ButtonLink>
            </div>
          </div>
          <div className='bg-brand-950 rounded-lg p-6 text-white'>
            <p className='text-blue-light-200 text-sm font-semibold tracking-[0.12em] uppercase'>
              Care plus technology
            </p>
            <h2 className='mt-3 text-3xl font-semibold'>
              A practical bridge between service delivery and digital systems.
            </h2>
            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              {capabilities.map(item => (
                <div key={item} className='flex gap-3 rounded-lg bg-white/10 p-4'>
                  <SiteIcon name='spark' className='text-blue-light-200 mt-1 h-4 w-4 shrink-0' />
                  <p className='text-blue-light-50 text-sm leading-6'>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Client benefit'
            title='Technology work shaped around care-sector reality.'
            body='Care providers need digital tools that support compliance, recruitment, enquiries, operations and service growth. The partnership keeps the brief grounded in care and the build grounded in product delivery.'
          />
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {[
              [
                'More credible websites',
                'Clear service pages, booking flows, recruitment journeys and trust-building content for care providers.'
              ],
              [
                'Cleaner operations',
                'Forms, dashboards, portals and internal tools that reduce manual handoffs and improve visibility.'
              ],
              [
                'Future scalability',
                'CMS-ready content, lead-routing structures, analytics readiness and maintainable technical foundations.'
              ]
            ].map(([title, body]) => (
              <div key={title} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
                <SiteIcon name='check' className='text-brand-700 h-5 w-5' />
                <h3 className='mt-4 text-xl font-semibold text-gray-950'>{title}</h3>
                <p className='mt-3 text-sm leading-6 text-gray-600'>{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-brand-25 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Delivery model'
            title='How Care Atlas and Cosmonaut Labs work together.'
            body='The model makes technical projects easier for care businesses because operational context and digital build planning stay connected.'
          />
          <div className='mt-10'>
            <ProcessTimeline steps={process} />
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'>
          <SectionHeading
            eyebrow='Technology enquiry'
            title='Tell us what needs to work better.'
            body='This form captures website, systems, CRM, booking, forms, dashboard and software support enquiries for later routing.'
          />
          <LeadForm variant='technology' />
        </Container>
      </section>

      <CtaBand
        title='Bring care operations and digital systems into the same conversation.'
        body='Care Atlas and Cosmonaut Labs can help plan websites, workflows and tools that support trust, enquiries and operational control.'
        primary={{
          label: 'Request Technology Support',
          href: '/services/websites-technology-systems-support#service-enquiry'
        }}
        secondary={{ label: 'Contact Care Atlas', href: '/contact' }}
      />
    </>
  )
}
