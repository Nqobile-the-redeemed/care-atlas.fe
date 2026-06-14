import Link from 'next/link'
import { getConsultationProductsByServiceSlug, getNonConsultationProductsByServiceSlug } from '@/data/products'
import type { Service } from '@/data/site'
import { ConsultationCard, ProductCard } from './CommerceBlocks'
import { ButtonLink, Container, SectionHeading } from './ui'

export function ProductPurchaseSection({ service }: { service: Service }) {
  const consultationProducts = getConsultationProductsByServiceSlug(service.slug)
  const products = getNonConsultationProductsByServiceSlug(service.slug)

  if (consultationProducts.length === 0 && products.length === 0) {
    return null
  }

  return (
    <section id='pricing' className='bg-gray-50 py-16'>
      <Container>
        <div className='flex flex-col justify-between gap-5 lg:flex-row lg:items-end'>
          <SectionHeading
            eyebrow='Products and pricing'
            title='Consultations, packages and quote routes for this service.'
            body='Prices are held in the central product catalogue and can be replaced with live Stripe Price IDs later. Final scope, payment terms, exclusions and warranty terms should be confirmed before delivery.'
          />
          <Link href='/checkout' className='text-brand-700 hover:text-brand-800 text-sm font-semibold'>
            View checkout
          </Link>
        </div>

        {consultationProducts.length > 0 && (
          <div className='mt-10'>
            <SectionHeading
              eyebrow='Consultations'
              title='Start with a scoped conversation first.'
              body='Consultation routes help providers discuss scope, urgency, documents and readiness before choosing a package, add-on or quote path.'
            />
            <div className='mt-8 grid gap-5 lg:grid-cols-3'>
              {consultationProducts.map(product => (
                <ConsultationCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div className='mt-12'>
            <SectionHeading
              eyebrow='Packages and products'
              title='Purchase services or request a scoped quote.'
              body='Packages, retainers, add-ons and quote-based routes stay linked to the same service so visitors can move from advice to implementation without losing context.'
            />
            <div className='mt-8 grid gap-5 lg:grid-cols-3'>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        <div className='border-brand-100 bg-brand-25 mt-8 grid gap-4 rounded-lg border p-5 md:grid-cols-[1fr_auto] md:items-center'>
          <div>
            <h3 className='text-lg font-semibold text-gray-950'>Need a tailored scope first?</h3>
            <p className='mt-2 text-sm leading-6 text-gray-600'>
              Quote-based products route through the service enquiry form so Care Atlas can confirm role, service type,
              urgency, deliverables and any limits before payment.
            </p>
          </div>
          <ButtonLink href='#service-enquiry' variant='secondary'>
            Request a Quote
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
