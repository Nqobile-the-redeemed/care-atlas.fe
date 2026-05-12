import type { Metadata } from 'next'
import { ButtonLink, Container, CtaBand, ProcessTimeline, SectionHeading, ServiceCard } from '@/components/site/ui'
import { serviceCategories, services } from '@/data/site'

export const metadata: Metadata = {
  title: 'Care Atlas Services | Care Consultancy, Compliance, Recruitment and Technology',
  description:
    'Explore Care Atlas services across care operations, regulatory compliance, supported living housing, recruitment, training and technology support.'
}

const benefits = [
  'Clear service pathways for providers at different stages',
  'Specific enquiry forms that route leads by need and urgency',
  'Content depth for search visibility and trust building',
  'Related service links for connected care operations journeys'
]

const process = [
  {
    title: 'Choose the area',
    body: 'Start with the service that best matches your current operational pressure or growth goal.'
  },
  {
    title: 'Share context',
    body: 'Use the service form to explain stage, urgency, documents, staffing or technology needs.'
  },
  {
    title: 'Triage',
    body: 'Care Atlas reviews the situation and identifies the most useful support route.'
  },
  {
    title: 'Plan next actions',
    body: 'The work becomes a practical plan with deliverables, ownership and implementation support.'
  }
]

export default function ServicesPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Services directory
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>
              Care consultancy and enablement services.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Care Atlas brings together care operations, regulatory and compliance support, supported living housing,
              staffing, training, websites and technology systems in one connected service platform.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/contact#booking' variant='primary'>
                Book Consultation
              </ButtonLink>
              <ButtonLink href='/contact' variant='secondary'>
                Request Support
              </ButtonLink>
            </div>
          </div>
          <div className='grid gap-3 sm:grid-cols-2'>
            {benefits.map(benefit => (
              <div key={benefit} className='border-brand-100 bg-brand-25 rounded-lg border p-5'>
                <p className='text-sm leading-6 text-gray-700'>{benefit}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Categories'
            title='Services grouped around real care business needs.'
            body='Visitors can scan by category, compare related services and choose the most relevant conversion path.'
          />
          <div className='mt-10 space-y-12'>
            {serviceCategories.map(category => {
              const categoryServices = services.filter(service => service.category === category)

              if (categoryServices.length === 0) {
                return null
              }

              return (
                <section key={category} aria-labelledby={`${category.replace(/\s+/g, '-').toLowerCase()}-heading`}>
                  <div className='mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
                    <div>
                      <h2
                        id={`${category.replace(/\s+/g, '-').toLowerCase()}-heading`}
                        className='text-2xl font-semibold text-gray-950'
                      >
                        {category}
                      </h2>
                      <p className='mt-2 max-w-2xl text-sm leading-6 text-gray-600'>
                        Structured support that can be delivered alone or as part of a wider improvement plan.
                      </p>
                    </div>
                  </div>
                  <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
                    {categoryServices.map(service => (
                      <ServiceCard key={service.slug} service={service} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container>
          <SectionHeading
            eyebrow='How to use the directory'
            title='A simple route from service interest to practical support.'
            body='Each service page explains who it is for, what is included, problems solved, deliverables, FAQs and the form fields needed to route the enquiry.'
          />
          <div className='mt-10'>
            <ProcessTimeline steps={process} />
          </div>
        </Container>
      </section>

      <CtaBand
        title='Not sure which service fits?'
        body='Send a general enquiry and Care Atlas will help identify whether the best starting point is compliance, registration, housing, staffing, training or technology.'
        primary={{ label: 'Speak to an Expert', href: '/contact#booking' }}
        secondary={{ label: 'Contact Us', href: '/contact' }}
      />
    </>
  )
}
