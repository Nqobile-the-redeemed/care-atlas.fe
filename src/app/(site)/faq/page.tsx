import type { Metadata } from 'next'
import { Container, CtaBand, FaqList, SectionHeading } from '@/components/site/ui'
import { globalFaqs, serviceCategories, services } from '@/data/site'

export const metadata: Metadata = {
  title: 'Care Atlas FAQ | Care Consultancy Questions',
  description:
    'Frequently asked questions about Care Atlas services, including compliance, registration, supported living, recruitment, training and technology support.'
}

export default function FaqPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container>
          <div className='max-w-3xl'>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              FAQ
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>
              Questions about working with Care Atlas.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Find answers about care consultancy, supported living support, regulatory registration, care compliance,
              recruitment, training and technology services.
            </p>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr]'>
          <SectionHeading
            eyebrow='General'
            title='The core questions.'
            body='These answers help visitors decide whether Care Atlas is the right starting point.'
          />
          <FaqList items={globalFaqs} />
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container>
          <SectionHeading
            eyebrow='By service'
            title='Service-specific FAQ groups.'
            body='Major service pages also include these FAQs in context near their enquiry forms.'
          />
          <div className='mt-10 space-y-12'>
            {serviceCategories.map(category => {
              const items = services.filter(service => service.category === category)

              if (items.length === 0) {
                return null
              }

              return (
                <section key={category}>
                  <h2 className='text-2xl font-semibold text-gray-950'>{category}</h2>
                  <div className='mt-5 grid gap-6 lg:grid-cols-2'>
                    {items.map(service => (
                      <div key={service.slug}>
                        <h3 className='text-brand-700 mb-4 text-lg font-semibold'>{service.navLabel}</h3>
                        <FaqList items={service.faqs} />
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </Container>
      </section>

      <CtaBand
        title='Still have a specific question?'
        body='Use the consultation form and include service stage, urgency and the operational issue you are trying to solve.'
        primary={{ label: 'Contact Care Atlas', href: '/contact' }}
        secondary={{ label: 'Explore Services', href: '/services' }}
      />
    </>
  )
}
