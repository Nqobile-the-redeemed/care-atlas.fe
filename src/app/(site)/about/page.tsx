import type { Metadata } from 'next'
import Image from 'next/image'
import { ButtonLink, Container, CtaBand, ProcessTimeline, SectionHeading } from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'

export const metadata: Metadata = {
  title: 'About Care Atlas | Care Consultancy for UK Providers',
  description:
    'Learn about Care Atlas, a UK care consultancy and care enablement platform supporting providers with compliance, operations, staffing, technology and growth.'
}

const values = [
  {
    title: 'Quality',
    body: 'We focus on the systems, evidence and daily routines that make care delivery safer and more consistent.'
  },
  {
    title: 'Compliance',
    body: 'We treat compliance as an operating discipline, not a folder of documents kept separate from practice.'
  },
  {
    title: 'Care',
    body: 'The work stays anchored in service users, staff, managers and the realities of regulated care environments.'
  },
  {
    title: 'Operational excellence',
    body: 'We help teams move from unclear responsibility to practical processes, owners, review cycles and improvement.'
  },
  {
    title: 'Technology enablement',
    body: 'With Cosmonaut Labs, we help care businesses use websites, systems and software to reduce friction.'
  }
]

const process = [
  {
    title: 'Listen',
    body: 'We understand the service, people, current constraints and what needs to be true for progress.'
  },
  {
    title: 'Diagnose',
    body: 'We identify gaps across documentation, operations, staffing, compliance, housing or technology.'
  },
  {
    title: 'Design',
    body: 'We shape a clear plan with practical outputs, not vague strategy.'
  },
  {
    title: 'Support',
    body: 'We help implement, review and improve so the work becomes useful in daily operations.'
  }
]

export default function AboutPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              About Care Atlas
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>
              Care sector support with operational depth.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Care Atlas exists to help care providers, supported living operators, new founders and care professionals
              make better decisions about registration, compliance, housing, staffing, training, technology and service
              growth.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/contact#booking' variant='primary'>
                Book a Consultation
              </ButtonLink>
              <ButtonLink href='/services' variant='secondary'>
                Explore Services
              </ButtonLink>
            </div>
          </div>
          <div className='border-brand-100 bg-brand-25 relative min-h-[420px] overflow-hidden rounded-lg border'>
            <Image
              src='/images/grid-image/image-01.png'
              alt='Modern blue building exterior representing Care Atlas professional consultancy'
              fill
              sizes='(min-width: 1024px) 560px, 100vw'
              className='object-cover'
            />
            <div className='bg-brand-950/50 absolute inset-0' />
            <div className='shadow-theme-lg absolute right-5 bottom-5 left-5 rounded-lg bg-white p-5'>
              <p className='text-brand-700 text-sm font-semibold'>Mission</p>
              <p className='mt-2 text-lg leading-7 font-semibold text-gray-950'>
                Help care organisations run, scale, register, stabilise, digitise and improve services with confidence.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container className='grid gap-10 lg:grid-cols-3'>
          {[
            [
              'Who we are',
              'A care consultancy and enablement business for providers, founders, managers and care professionals who need practical support.'
            ],
            [
              'What we do',
              'We connect care operations, compliance, registration, staffing, training, housing and technology into workable service pathways.'
            ],
            [
              'Why clients work with us',
              'Clients need sector-aware clarity, credible documentation, operational planning and support that translates into action.'
            ]
          ].map(([title, body]) => (
            <div key={title} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
              <SiteIcon name='shield' className='text-brand-700 h-6 w-6' />
              <h2 className='mt-5 text-xl font-semibold text-gray-950'>{title}</h2>
              <p className='mt-3 text-sm leading-6 text-gray-600'>{body}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container>
          <SectionHeading
            eyebrow='Values'
            title='A consultancy model built for responsible care delivery.'
            body='Care Atlas combines clear advice, structured documentation, operational thinking and technology delivery without losing sight of the people inside care services.'
          />
          <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5'>
            {values.map(value => (
              <div key={value.title} className='border-brand-100 bg-brand-25 rounded-lg border p-5'>
                <h3 className='text-lg font-semibold text-gray-950'>{value.title}</h3>
                <p className='mt-3 text-sm leading-6 text-gray-600'>{value.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-brand-25 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Approach'
            title='From messy context to clear action.'
            body='The Care Atlas process is deliberately practical. It gives leaders a clearer view of what matters, what is missing and what to do next.'
          />
          <div className='mt-10'>
            <ProcessTimeline steps={process} />
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <SectionHeading
            eyebrow='Partnership model'
            title='Care Atlas plus Cosmonaut Labs.'
            body='Care Atlas defines the care-sector problem and service requirements. Cosmonaut Labs supports the technical build, digital systems, websites, software, dashboards and long-term technology enablement.'
          />
          <div className='grid gap-4 sm:grid-cols-2'>
            {['Care requirements', 'Website delivery', 'Digital workflows', 'Software roadmap'].map(item => (
              <div key={item} className='rounded-lg border border-gray-200 bg-gray-50 p-5'>
                <SiteIcon name='spark' className='text-brand-700 h-5 w-5' />
                <h3 className='mt-4 text-lg font-semibold text-gray-950'>{item}</h3>
                <p className='mt-2 text-sm leading-6 text-gray-600'>
                  A clear bridge between care operations and the digital tools that support the business.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title='Talk to Care Atlas about your next operational move.'
        body='Whether you are setting up, preparing for review, building a policy system or planning technology, a consultation can clarify the route.'
        primary={{ label: 'Book Consultation', href: '/contact#booking' }}
        secondary={{ label: 'Meet Cosmonaut Labs', href: '/technology-partner/cosmonaut-labs' }}
      />
    </>
  )
}
