import Link from 'next/link'
import { mainNav, services, site } from '@/data/site'
import { CareAtlasLogo } from './CareAtlasLogo'
import { FooterNewsletterForm } from './FooterNewsletterForm'
import { ButtonLink, Container } from './ui'
import { SiteIcon } from './SiteIcon'
import { CookieSettingsButton } from './CookieSettingsButton'

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Cookies', href: '/cookies' }
]

const phoneHref = `tel:${site.phone.replace(/[^\d+]/g, '')}`

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
              <a href={phoneHref} className='flex gap-3 transition hover:text-white'>
                <SiteIcon name='phone' className='text-blue-light-200 mt-0.5 h-4 w-4 shrink-0' />
                {site.phone}
              </a>
              <p className='flex gap-3'>
                <SiteIcon name='mail' className='text-blue-light-200 mt-0.5 h-4 w-4 shrink-0' />
                {site.email}
              </p>
              <p className='flex gap-3'>
                <SiteIcon name='home' className='text-blue-light-200 mt-0.5 h-4 w-4 shrink-0' />
                {site.address}
              </p>
            </div>
            <FooterNewsletterForm />
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
            <CookieSettingsButton />
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
