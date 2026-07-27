import type { Metadata } from 'next'
import { BookingPanel } from '@/components/site/BookingPanel'
import { CareAtlasContactForm } from '@/components/site/CareAtlasContactForm'
import { SiteIcon } from '@/components/site/SiteIcon'
import { Container, CtaBand, FaqList, SectionHeading } from '@/components/site/ui'
import { globalFaqs, site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contact Care Atlas | Book a Care Consultancy Consultation',
  description:
    'Contact Care Atlas to book a consultation for care consultancy, CQC registration support, supported living housing benefit support, recruitment, training or technology.'
}

const contactPoints = [
  {
    title: 'Email',
    value: site.email,
    icon: 'mail'
  },
  {
    title: 'Phone',
    value: site.phone,
    icon: 'phone'
  },
  {
    title: 'Coverage',
    value: site.address,
    icon: 'home'
  }
]

export default function ContactPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Contact and booking
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Book a care consultancy consultation.</h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Tell Care Atlas what you need help with across compliance, registration, housing, recruitment, training,
              tender planning or technology. The form is structured for routing, consent and future CRM integration.
            </p>
            <div className='mt-8 grid gap-4'>
              {contactPoints.map(point => (
                <div key={point.title} className='flex gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  <span className='bg-brand-50 text-brand-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg'>
                    <SiteIcon name={point.icon} className='h-5 w-5' />
                  </span>
                  <div>
                    <p className='text-sm font-semibold text-gray-950'>{point.title}</p>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>{point.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <CareAtlasContactForm />
        </Container>
      </section>

      <section className='bg-brand-25 py-16'>
        <Container>
          <BookingPanel />
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr]'>
          <SectionHeading
            eyebrow='Before you enquire'
            title='Useful answers about working with Care Atlas.'
            body='The contact journey is designed to make the next step clear, even if you are not yet sure which service you need.'
          />
          <FaqList items={globalFaqs} />
        </Container>
      </section>

      <CtaBand
        title='Prefer a specific service route?'
        body='You can also submit a service-specific enquiry from each service page, including registration, housing benefit support, recruitment, training and technology.'
        primary={{ label: 'Explore Services', href: '/services' }}
        secondary={{ label: 'Careers Signup', href: '/careers#candidate-signup' }}
      />
    </>
  )
}
