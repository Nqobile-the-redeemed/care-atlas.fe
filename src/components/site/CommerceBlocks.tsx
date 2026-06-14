import type { Product } from '@/data/products'
import { getBillingLabel, getProductCheckoutHref } from '@/data/products'
import { ButtonLink } from './ui'
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

export function ConsultationCard({ product }: { product: Product }) {
  return (
    <article className='shadow-theme-xs border-brand-100 bg-brand-25 flex h-full flex-col rounded-lg border p-6'>
      <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Consultation</p>
      <h3 className='mt-3 text-xl font-semibold text-gray-950'>{product.name}</h3>
      <p className='mt-3 text-sm leading-6 text-gray-600'>{product.shortDescription}</p>

      <div className='mt-5 grid gap-3 sm:grid-cols-2'>
        <div className='rounded-lg bg-white p-4'>
          <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Price</p>
          <p className='mt-1 text-sm font-semibold text-gray-900'>{product.price}</p>
        </div>
        <div className='rounded-lg bg-white p-4'>
          <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Timeline</p>
          <p className='mt-1 text-sm font-semibold text-gray-900'>{product.timeline}</p>
        </div>
      </div>

      <ul className='mt-5 flex-1 space-y-3'>
        {product.features.slice(0, 4).map(feature => (
          <li key={feature} className='flex gap-3 text-sm leading-6 text-gray-700'>
            <SiteIcon name='check' className='text-success-600 mt-1 h-4 w-4 shrink-0' />
            {feature}
          </li>
        ))}
      </ul>

      <ButtonLink href={getProductCheckoutHref(product)} variant='primary' className='mt-6 w-full'>
        {product.ctaLabel}
      </ButtonLink>
    </article>
  )
}

export function ProductCard({ product }: { product: Product }) {
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

export function CheckoutSummary({ product, serviceTitle }: { product: Product; serviceTitle?: string }) {
  return (
    <div className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
      <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Selected service summary</p>
      <h2 className='mt-3 text-2xl font-semibold text-gray-950'>{product.name}</h2>
      {serviceTitle && <p className='text-brand-700 mt-2 text-sm font-semibold'>{serviceTitle}</p>}
      <p className='mt-4 text-sm leading-6 text-gray-600'>{product.longDescription}</p>

      <div className='mt-6 grid gap-3 sm:grid-cols-3'>
        {[
          ['Price', product.price],
          ['Billing', getBillingLabel(product)],
          ['Timeline', product.timeline]
        ].map(([label, value]) => (
          <div key={label} className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
            <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>{label}</p>
            <p className='mt-1 text-sm font-semibold text-gray-900'>{value}</p>
          </div>
        ))}
      </div>

      <div className='mt-6 grid gap-5 md:grid-cols-2'>
        <div>
          <h3 className='text-sm font-semibold text-gray-950'>Features</h3>
          <ul className='mt-3 space-y-2'>
            {product.features.map(feature => (
              <li key={feature} className='flex gap-2 text-sm leading-6 text-gray-700'>
                <SiteIcon name='check' className='text-success-600 mt-1 h-4 w-4 shrink-0' />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className='text-sm font-semibold text-gray-950'>Deliverables</h3>
          <ul className='mt-3 space-y-2'>
            {product.deliverables.map(deliverable => (
              <li key={deliverable} className='flex gap-2 text-sm leading-6 text-gray-700'>
                <SiteIcon name='file' className='text-brand-700 mt-1 h-4 w-4 shrink-0' />
                {deliverable}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {product.warrantyText && (
        <div className='border-warning-200 bg-warning-25 mt-6 rounded-lg border p-4'>
          <p className='text-sm leading-6 text-gray-700'>{product.warrantyText}</p>
        </div>
      )}
    </div>
  )
}

export function PaymentStatusMessage({
  tone,
  eyebrow,
  title,
  body
}: {
  tone: 'success' | 'warning' | 'error'
  eyebrow: string
  title: string
  body: string
}) {
  const tones = {
    success: 'border-success-200 bg-success-50 text-success-700',
    warning: 'border-warning-200 bg-warning-25 text-warning-700',
    error: 'border-error-200 bg-error-50 text-error-700'
  }

  return (
    <div>
      <p className={`${tones[tone]} mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold`}>{eyebrow}</p>
      <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>{title}</h1>
      <p className='mt-5 text-lg leading-8 text-gray-600'>{body}</p>
    </div>
  )
}
