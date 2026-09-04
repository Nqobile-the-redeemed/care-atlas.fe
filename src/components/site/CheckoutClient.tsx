'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { getBillingLabel } from '@/data/products'
import type { Product } from '@/data/products'
import type { Service } from '@/data/site'
import { createCheckoutSession, getCheckoutUrls } from '@/lib/commerce'
import { CheckoutSummary } from './CommerceBlocks'
import { Button, ButtonLink } from './ui'

type CheckoutClientProps = {
  product?: Product
  service?: Service
  popularProducts: Product[]
}

type CustomerState = {
  name: string
  email: string
  phone: string
  organisation: string
}

const initialCustomerState: CustomerState = {
  name: '',
  email: '',
  phone: '',
  organisation: ''
}

function ProductPicker({ products }: { products: Product[] }) {
  return (
    <div className='grid gap-5 md:grid-cols-3'>
      {products.map(product => (
        <Link
          key={product.id}
          href={`/checkout?product=${product.slug}`}
          className='shadow-theme-xs hover:border-brand-200 hover:shadow-theme-lg focus:ring-brand-500/10 rounded-lg border border-gray-200 bg-white p-5 transition hover:-translate-y-1 focus:ring-4 focus:outline-hidden'
        >
          <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>{getBillingLabel(product)}</p>
          <h2 className='mt-3 text-lg font-semibold text-gray-950'>{product.name}</h2>
          <p className='mt-3 text-sm leading-6 text-gray-600'>{product.shortDescription}</p>
          <p className='mt-5 text-xl font-semibold text-gray-950'>{product.price}</p>
        </Link>
      ))}
    </div>
  )
}

export function CheckoutClient({ product, service, popularProducts }: CheckoutClientProps) {
  const [customer, setCustomer] = useState<CustomerState>(initialCustomerState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!product) {
      return
    }

    setError(null)

    if (!customer.name.trim() || !customer.email.trim()) {
      setError('Enter your name and email address before continuing to payment.')
      return
    }

    setIsSubmitting(true)

    try {
      const urls = getCheckoutUrls(window.location.origin, product.slug)
      const session = await createCheckoutSession({
        productSlug: product.slug,
        quantity: 1,
        ...urls,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          organisation: customer.organisation
        }
      })

      window.location.assign(session.checkoutUrl)
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout could not be started.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) {
    return (
      <div>
        <div className='mb-8 max-w-3xl'>
          <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
            Checkout
          </p>
          <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Select a service product.</h1>
          <p className='mt-5 text-lg leading-8 text-gray-600'>
            Choose a consultation, package or setup product to continue to checkout. Quote-based services can be scoped
            through the relevant service enquiry form.
          </p>
        </div>
        <ProductPicker products={popularProducts} />
      </div>
    )
  }

  const isQuoteBased = product.billingType === 'quote-based' || !product.isPurchasable
  const serviceHref = service ? `${service.href}#service-enquiry` : '/contact'

  return (
    <div>
      <div className='mb-8 max-w-3xl'>
        <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
          Checkout
        </p>
        <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>Review your selected service.</h1>
        <p className='mt-5 text-lg leading-8 text-gray-600'>
          Confirm the product, timeline and contact details before continuing to payment or requesting a scoped quote.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
        <CheckoutSummary product={product} serviceTitle={service?.title} />

        <div className='shadow-theme-lg rounded-lg border border-gray-200 bg-white p-6'>
          <div className='border-b border-gray-200 pb-5'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>
              {isQuoteBased ? 'Quote request' : 'Secure checkout'}
            </p>
            <h2 className='mt-2 text-2xl font-semibold text-gray-950'>
              {isQuoteBased ? 'Confirm the scope first.' : 'Continue to payment.'}
            </h2>
            <p className='mt-2 text-sm leading-6 text-gray-600'>
              {isQuoteBased
                ? 'This item needs a confirmed brief before payment. Use the quote route so the scope, terms and responsibilities are clear.'
                : 'You will be redirected to Stripe hosted checkout. Care Atlas confirms scope, timing and next steps after payment.'}
            </p>
          </div>

          {isQuoteBased ? (
            <div className='mt-6 grid gap-3'>
              <ButtonLink href={serviceHref} variant='primary'>
                {product.ctaLabel}
              </ButtonLink>
              <ButtonLink href='/contact#booking' variant='secondary'>
                Book a Consultation
              </ButtonLink>
            </div>
          ) : (
            <form className='mt-6 grid gap-5' onSubmit={handleCheckout}>
              <div>
                <label htmlFor='checkout-name' className='mb-1.5 block text-sm font-semibold text-gray-800'>
                  Full name *
                </label>
                <input
                  id='checkout-name'
                  type='text'
                  value={customer.name}
                  onChange={event => setCustomer(current => ({ ...current, name: event.target.value }))}
                  className='focus:border-brand-300 focus:ring-brand-500/10 shadow-theme-xs w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
                />
              </div>
              <div>
                <label htmlFor='checkout-email' className='mb-1.5 block text-sm font-semibold text-gray-800'>
                  Email address *
                </label>
                <input
                  id='checkout-email'
                  type='email'
                  value={customer.email}
                  onChange={event => setCustomer(current => ({ ...current, email: event.target.value }))}
                  className='focus:border-brand-300 focus:ring-brand-500/10 shadow-theme-xs w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
                />
              </div>
              <div className='grid gap-5 sm:grid-cols-2'>
                <div>
                  <label htmlFor='checkout-phone' className='mb-1.5 block text-sm font-semibold text-gray-800'>
                    Phone
                  </label>
                  <input
                    id='checkout-phone'
                    type='tel'
                    value={customer.phone}
                    onChange={event => setCustomer(current => ({ ...current, phone: event.target.value }))}
                    className='focus:border-brand-300 focus:ring-brand-500/10 shadow-theme-xs w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
                  />
                </div>
                <div>
                  <label htmlFor='checkout-organisation' className='mb-1.5 block text-sm font-semibold text-gray-800'>
                    Organisation
                  </label>
                  <input
                    id='checkout-organisation'
                    type='text'
                    value={customer.organisation}
                    onChange={event => setCustomer(current => ({ ...current, organisation: event.target.value }))}
                    className='focus:border-brand-300 focus:ring-brand-500/10 shadow-theme-xs w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:ring-4 focus:outline-hidden'
                  />
                </div>
              </div>

              {error && (
                <div className='border-error-200 bg-error-50 text-error-700 rounded-lg border p-4 text-sm leading-6'>
                  {error}
                </div>
              )}

              <Button type='submit' disabled={isSubmitting} loading={isSubmitting} fullWidth>
                {product.ctaLabel}
              </Button>

              <p className='text-xs leading-5 text-gray-500'>
                Payment details are handled by Stripe. Care Atlas receives the selected product, contact details and
                checkout result for order follow-up.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
