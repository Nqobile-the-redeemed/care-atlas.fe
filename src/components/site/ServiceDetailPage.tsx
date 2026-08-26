import Link from 'next/link'
import { getConsultationProductByServiceSlug } from '@/data/products'
import { getRelatedServices } from '@/data/site'
import type { Service } from '@/data/site'
import { LeadForm } from './LeadForm'
import { ProductPurchaseSection } from './ProductPurchaseSection'
import {
  ButtonLink,
  ChecklistGrid,
  Container,
  CtaBand,
  FaqList,
  FeatureGrid,
  ProcessTimeline,
  SectionHeading,
  ServiceCard
} from './ui'
import { SiteIcon } from './SiteIcon'

export function ServiceDetailPage({ service }: { service: Service }) {
  const related = getRelatedServices(service)
  const outcomes = service.outcomes ?? service.benefits
  const consultationProduct = getConsultationProductByServiceSlug(service.slug)
  const consultationHref = consultationProduct ? `/checkout?product=${consultationProduct.slug}` : '/contact#booking'

  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              {service.eyebrow}
            </p>
            <h1 className='max-w-4xl text-4xl font-semibold text-gray-950 sm:text-5xl'>{service.title}</h1>
            <p className='mt-5 max-w-3xl text-lg leading-8 text-gray-600'>{service.hero}</p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
              <ButtonLink href={consultationHref} variant='primary'>
                Book a Consultation
              </ButtonLink>
              <ButtonLink href='#pricing' variant='secondary'>
                Purchase Service
              </ButtonLink>
              <ButtonLink href='#service-enquiry' variant='secondary'>
                Request a Quote
              </ButtonLink>
              <ButtonLink href='/contact' variant='ghost'>
                Speak to Care Atlas
              </ButtonLink>
              {service.slug === 'tender-bidding-operational-planning' && (
                <ButtonLink href='/tenders' variant='secondary'>
                  Browse live tenders
                </ButtonLink>
              )}
            </div>
          </div>
          <div className='border-brand-100 bg-brand-25 rounded-lg border p-6'>
            <div className='flex items-center gap-4'>
              <span className='bg-brand-600 flex h-12 w-12 items-center justify-center rounded-lg text-white'>
                <SiteIcon name={service.icon} className='h-6 w-6' />
              </span>
              <div>
                <p className='text-brand-700 text-sm font-semibold'>{service.category}</p>
                <h2 className='text-xl font-semibold text-gray-950'>What this service is built to do</h2>
              </div>
            </div>
            <div className='mt-6 grid gap-3'>
              {service.benefits.slice(0, 4).map(benefit => (
                <div key={benefit} className='shadow-theme-xs flex gap-3 rounded-lg bg-white p-4'>
                  <SiteIcon name='check' className='text-success-600 mt-1 h-4 w-4 shrink-0' />
                  <p className='text-sm leading-6 text-gray-700'>{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr]'>
          <SectionHeading
            eyebrow='Service description'
            title='Practical support scoped around your care service.'
            body={service.description ?? service.hero}
          />
          <div>
            <h2 className='text-xl font-semibold text-gray-950'>Who this service is for</h2>
            <div className='mt-5'>
              <FeatureGrid items={service.audience} />
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container>
          <SectionHeading
            eyebrow='What is included'
            title='A focused package of advice, structure and implementation support.'
            body='Care Atlas keeps the work practical: the goal is not just a document, but a clearer way to operate.'
          />
          <div className='mt-10 grid gap-8 lg:grid-cols-2'>
            <div>
              <h3 className='text-xl font-semibold text-gray-950'>Included support</h3>
              <div className='mt-5'>
                <FeatureGrid items={service.included} />
              </div>
            </div>
            <div>
              <h3 className='text-xl font-semibold text-gray-950'>Problems we solve</h3>
              <div className='mt-5'>
                <FeatureGrid items={service.problems} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-brand-25 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Process'
            title='A clear path from discovery to action.'
            body='The workflow can flex by service stage, but every project keeps a line of sight between evidence, decisions and implementation.'
          />
          <div className='mt-10'>
            <ProcessTimeline steps={service.process} />
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr]'>
          <div>
            <SectionHeading
              eyebrow='Deliverables'
              title='Useful outputs that can move into daily operations.'
              body='The output is designed to support real provider decisions, not sit unused in a folder.'
            />
            <ul className='mt-8 space-y-3'>
              {service.deliverables.map(deliverable => (
                <li
                  key={deliverable}
                  className='flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700'
                >
                  <SiteIcon name='file' className='text-brand-700 h-5 w-5 shrink-0' />
                  {deliverable}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow='Expected outcomes'
              title='What the provider should be clearer on after the work.'
              body='Outcomes depend on the agreed scope, but each service is built to improve decision making, evidence quality and operational control.'
            />
            <div className='mt-8'>
              <FeatureGrid items={outcomes} />
            </div>
          </div>
        </Container>
        {service.checklists.length > 0 && (
          <Container className='mt-10'>
            <ChecklistGrid checklists={service.checklists} />
          </Container>
        )}
      </section>

      <ProductPurchaseSection service={service} />

      {service.commercialNote && (
        <section className='bg-white py-16'>
          <Container>
            <div className='border-warning-200 bg-warning-25 rounded-lg border p-5'>
              <p className='text-sm leading-6 text-gray-700'>{service.commercialNote}</p>
            </div>
          </Container>
        </section>
      )}

      <section className='bg-gray-50 py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr]'>
          <SectionHeading
            eyebrow='FAQ'
            title='Straight answers before you enquire.'
            body='These FAQs cover the most common early questions. The consultation form can capture anything more specific to your service.'
          />
          <FaqList items={service.faqs} />
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container>
          <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
            <SectionHeading
              eyebrow='Related services'
              title='Services that often connect to this work.'
              body='Care operations rarely sit in one box, so related pages help visitors continue the journey naturally.'
            />
            <Link href='/services' className='text-brand-700 hover:text-brand-800 text-sm font-semibold'>
              View services directory
            </Link>
          </div>
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {related.map(relatedService => (
              <ServiceCard key={relatedService.slug} service={relatedService} compact />
            ))}
          </div>
        </Container>
      </section>

      <section id='service-enquiry' className='bg-brand-25 py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'>
          <SectionHeading
            eyebrow='Conversion path'
            title={service.primaryCta}
            body='Use this service-specific form to route the enquiry with the right context. The frontend is prepared for validation, consent and future CRM handoff.'
          />
          <LeadForm variant={service.formVariant} />
        </Container>
      </section>

      <CtaBand
        title='Need help deciding where to start?'
        body='Care Atlas can triage your situation across compliance, registration, housing, recruitment, training and technology so the first step is clear.'
        primary={{ label: 'Book a consultation', href: '/contact#booking' }}
        secondary={{ label: service.secondaryCta, href: '/services' }}
      />
    </>
  )
}
