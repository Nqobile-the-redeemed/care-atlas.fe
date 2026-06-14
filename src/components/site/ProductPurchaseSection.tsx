import Link from 'next/link'
import { getBillingLabel, getProductCheckoutHref, getProductsByServiceSlug } from '@/data/products'
import type { Product } from '@/data/products'
import type { Service } from '@/data/site'
import { ButtonLink, Container, SectionHeading } from './ui'
import { SiteIcon } from './SiteIcon'

function getCategoryLabel(product: Product) {
  const labels: Record<Product['category'], string> = {
    consultation: 'Consultation',
    'one-off-service': 'One-off service',
    package: 'Package',
    'add-on': 'Add-on',
    'quote-based': 'Quote-based',
    subscription: 'Subscription'
  }

  return labels[product.category]
}

function ProductCard({ product }: { product: Product }) {
  const href = getProductCheckoutHref(product)
  const isQuoteBased = product.billingType === 'quote-based' || !product.isPurchasable

  return (
    <article className='shadow-theme-xs flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>
            {getCategoryLabel(product)} | {getBillingLabel(product)}
          </p>
          <h3 className='mt-3 text-xl font-semibold text-gray-950'>{product.name}</h3>
        </div>
        {product.popular && (
          <span className='bg-success-50 text-success-700 rounded-full px-3 py-1 text-xs font-semibold'>Popular</span>
        )}
      </div>

      <p className='mt-4 text-3xl font-semibold text-gray-950'>{product.price}</p>
      <p className='mt-3 text-sm leading-6 text-gray-600'>{product.shortDescription}</p>

      <div className='mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4'>
        <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Timeline</p>
        <p className='mt-1 text-sm font-medium text-gray-800'>{product.timeline}</p>
      </div>

      <ul className='mt-5 flex-1 space-y-3'>
        {product.features.slice(0, 4).map(feature => (
          <li key={feature} className='flex gap-3 text-sm leading-6 text-gray-700'>
            <SiteIcon name='check' className='text-success-600 mt-1 h-4 w-4 shrink-0' />
            {feature}
          </li>
        ))}
      </ul>

      {product.warrantyText && (
        <div className='border-warning-200 bg-warning-25 mt-5 rounded-lg border p-4'>
          <p className='text-sm leading-6 text-gray-700'>{product.warrantyText}</p>
        </div>
      )}

      <ButtonLink href={href} variant={isQuoteBased ? 'secondary' : 'primary'} className='mt-6 w-full'>
        {product.ctaLabel}
      </ButtonLink>
    </article>
  )
}

export function ProductPurchaseSection({ service }: { service: Service }) {
  const products = getProductsByServiceSlug(service.slug)

  if (products.length === 0) {
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

        <div className='mt-10 grid gap-5 lg:grid-cols-3'>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
