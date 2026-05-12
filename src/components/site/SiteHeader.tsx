'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { mainNav, serviceCategories, services, site } from '@/data/site'
import { ButtonLink, Container } from './ui'
import { SiteIcon } from './SiteIcon'

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/'
  }

  return pathname.startsWith(href)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const groupedServices = useMemo(
    () =>
      serviceCategories
        .map(category => ({
          category,
          items: services.filter(service => service.category === category)
        }))
        .filter(group => group.items.length > 0),
    []
  )

  return (
    <header className='border-brand-100 shadow-theme-xs sticky top-0 z-9999 border-b bg-white/95 backdrop-blur'>
      <div className='border-brand-50 bg-brand-950 hidden border-b text-white lg:block'>
        <Container className='flex h-9 items-center justify-between text-xs'>
          <div className='flex items-center gap-5'>
            <span className='inline-flex items-center gap-2'>
              <SiteIcon name='phone' className='text-blue-light-200 h-3.5 w-3.5' />
              {site.phone}
            </span>
            <span className='inline-flex items-center gap-2'>
              <SiteIcon name='mail' className='text-blue-light-200 h-3.5 w-3.5' />
              {site.email}
            </span>
          </div>
          <p className='text-blue-light-100'>UK-wide care consultancy, compliance, staffing and technology support</p>
        </Container>
      </div>

      <Container className='flex min-h-18 items-center justify-between gap-4'>
        <Link href='/' className='focus:ring-brand-500/10 flex items-center gap-3 focus:ring-4 focus:outline-hidden'>
          <span className='bg-brand-600 shadow-theme-sm flex h-11 w-11 items-center justify-center rounded-lg text-sm font-bold text-white'>
            CA
          </span>
          <span className='leading-tight'>
            <span className='block text-lg font-semibold text-gray-950'>CARE ATLAS</span>
            <span className='text-brand-700 block text-xs font-medium'>Care consultancy and enablement</span>
          </span>
        </Link>

        <nav aria-label='Main navigation' className='hidden items-center gap-1 lg:flex'>
          {mainNav.map(item =>
            item.label === 'Services' ? (
              <div
                key={item.href}
                className='relative'
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type='button'
                  aria-expanded={servicesOpen}
                  aria-controls='services-mega-menu'
                  onClick={() => setServicesOpen(open => !open)}
                  className={`focus:ring-brand-500/10 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition focus:ring-4 focus:outline-hidden ${
                    isActive(pathname, item.href)
                      ? 'bg-brand-50 text-brand-700'
                      : 'hover:text-brand-700 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Services
                  <SiteIcon name='chevron' className={`h-4 w-4 transition ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <div
                    id='services-mega-menu'
                    className='border-brand-100 shadow-theme-xl absolute top-full left-1/2 mt-3 w-[920px] -translate-x-1/2 rounded-lg border bg-white p-5'
                  >
                    <div className='grid grid-cols-3 gap-5'>
                      {groupedServices.map(group => (
                        <div key={group.category}>
                          <p className='text-brand-600 mb-3 text-xs font-semibold tracking-[0.08em] uppercase'>
                            {group.category}
                          </p>
                          <div className='space-y-1'>
                            {group.items.map(service => (
                              <Link
                                key={service.slug}
                                href={service.href}
                                className='group hover:bg-brand-25 focus:ring-brand-500/10 flex gap-3 rounded-lg p-3 transition focus:ring-4 focus:outline-hidden'
                                onClick={() => setServicesOpen(false)}
                              >
                                <span className='bg-brand-50 text-brand-700 group-hover:bg-brand-600 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg group-hover:text-white'>
                                  <SiteIcon name={service.icon} className='h-4 w-4' />
                                </span>
                                <span>
                                  <span className='block text-sm font-semibold text-gray-950'>{service.navLabel}</span>
                                  <span className='mt-1 block text-xs leading-5 text-gray-500'>{service.summary}</span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='bg-brand-25 mt-5 flex items-center justify-between rounded-lg p-4'>
                      <p className='text-sm font-medium text-gray-700'>
                        Not sure which service fits? Start with a short consultation and we will route the enquiry.
                      </p>
                      <ButtonLink href='/contact' variant='primary' className='shrink-0'>
                        Book Consultation
                      </ButtonLink>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`focus:ring-brand-500/10 rounded-lg px-3 py-2 text-sm font-semibold transition focus:ring-4 focus:outline-hidden ${
                  isActive(pathname, item.href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'hover:text-brand-700 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className='hidden items-center gap-2 lg:flex'>
          <ButtonLink href='/contact' variant='secondary'>
            Contact Us
          </ButtonLink>
          <ButtonLink href='/contact#booking' variant='primary'>
            Book Consultation
          </ButtonLink>
        </div>

        <button
          type='button'
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(open => !open)}
          className='focus:ring-brand-500/10 flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 text-gray-800 transition hover:bg-gray-50 focus:ring-4 focus:outline-hidden lg:hidden'
        >
          <SiteIcon name={mobileOpen ? 'close' : 'menu'} className='h-5 w-5' />
        </button>
      </Container>

      <div
        className={`border-brand-50 overflow-hidden border-t bg-white transition-all duration-300 lg:hidden ${
          mobileOpen ? 'max-h-[900px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <Container className='py-4'>
          <nav aria-label='Mobile navigation' className='space-y-2'>
            {mainNav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-3 text-sm font-semibold ${
                  isActive(pathname, item.href) ? 'bg-brand-50 text-brand-700' : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className='bg-brand-25 mt-4 rounded-lg p-4'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Popular services</p>
            <div className='mt-3 grid gap-2'>
              {services.slice(0, 5).map(service => (
                <Link
                  key={service.slug}
                  href={service.href}
                  onClick={() => setMobileOpen(false)}
                  className='shadow-theme-xs flex items-center gap-3 rounded-lg bg-white p-3 text-sm font-semibold text-gray-800'
                >
                  <SiteIcon name={service.icon} className='text-brand-700 h-4 w-4' />
                  {service.navLabel}
                </Link>
              ))}
            </div>
          </div>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <ButtonLink href='/contact#booking' variant='primary'>
              Book Consultation
            </ButtonLink>
            <ButtonLink href='/contact' variant='secondary'>
              Contact Us
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  )
}
