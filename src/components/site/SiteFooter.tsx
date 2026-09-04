import Link from 'next/link'
import { mainNav, services, site } from '@/data/site'
import { CareAtlasLogo } from './CareAtlasLogo'
import { Button, ButtonLink, Container } from './ui'
import { SiteIcon } from './SiteIcon'

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' }
]

export function SiteFooter() {
  return (
    <footer className='bg-brand-950 text-white'>
      <Container className='py-14'>
        <div className='grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]'>
          <div>
            <Link
              href='/'
              className='inline-flex items-center gap-3 focus:ring-4 focus:ring-white/20 focus:outline-hidden'
            >
              <CareAtlasLogo variant='dark' />
            </Link>
            <p className='text-blue-light-100 mt-5 max-w-sm text-sm leading-6'>{site.summary}</p>
            <div className='mt-6 flex flex-wrap gap-3'>
              <ButtonLink href='/contact#booking' variant='primary'>
                Book Consultation
              </ButtonLink>
              <ButtonLink href='/technology-partner/cosmonaut-labs' variant='secondary'>
                Built with Cosmonaut Labs
              </ButtonLink>
            </div>
          </div>

          <div>
            <h2 className='text-blue-light-200 text-sm font-semibold tracking-[0.12em] uppercase'>Quick Links</h2>
            <ul className='mt-5 space-y-3'>
              {mainNav.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-blue-light-100 text-sm transition hover:text-white focus:ring-4 focus:ring-white/20 focus:outline-hidden'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href='/case-studies' className='text-blue-light-100 text-sm transition hover:text-white'>
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href='/faq' className='text-blue-light-100 text-sm transition hover:text-white'>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-blue-light-200 text-sm font-semibold tracking-[0.12em] uppercase'>Services</h2>
            <ul className='mt-5 space-y-3'>
              {services.map(service => (
                <li key={service.slug}>
                  <Link
                    href={service.href}
                    className='text-blue-light-100 text-sm transition hover:text-white focus:ring-4 focus:ring-white/20 focus:outline-hidden'
                  >
                    {service.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className='text-blue-light-200 text-sm font-semibold tracking-[0.12em] uppercase'>Contact</h2>
            <div className='text-blue-light-100 mt-5 space-y-3 text-sm'>
              <p className='flex gap-3'>
                <SiteIcon name='phone' className='text-blue-light-200 mt-0.5 h-4 w-4 shrink-0' />
                {site.phone}
              </p>
              <p className='flex gap-3'>
                <SiteIcon name='mail' className='text-blue-light-200 mt-0.5 h-4 w-4 shrink-0' />
                {site.email}
              </p>
              <p className='flex gap-3'>
                <SiteIcon name='home' className='text-blue-light-200 mt-0.5 h-4 w-4 shrink-0' />
                {site.address}
              </p>
            </div>
            <form className='mt-6 rounded-lg border border-white/10 bg-white/5 p-4'>
              <label htmlFor='footer-newsletter' className='text-sm font-semibold text-white'>
                Get care operations updates
              </label>
              <div className='mt-3 flex gap-2'>
                <input
                  id='footer-newsletter'
                  type='email'
                  required
                  placeholder='Email address'
                  className='min-w-0 flex-1 rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-white/20 focus:outline-hidden'
                />
                <Button type='submit' size='sm' className='focus:ring-white/20'>
                  Join
                </Button>
              </div>
              <p className='text-blue-light-200 mt-2 text-xs leading-5'>
                Newsletter capture ready for CRM and consent workflow integration.
              </p>
            </form>
          </div>
        </div>
      </Container>

      <div className='border-t border-white/10'>
        <Container className='text-blue-light-100 flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between'>
          <p>&copy; {new Date().getFullYear()} CARE ATLAS. UK care consultancy and care services support.</p>
          <div className='flex flex-wrap gap-4'>
            {legalLinks.map(link => (
              <Link key={link.href} href={link.href} className='transition hover:text-white'>
                {link.label}
              </Link>
            ))}
            {site.social.map(link => (
              <Link key={link.label} href={link.href} className='transition hover:text-white'>
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  )
}
