import type { Metadata } from 'next'
import Link from 'next/link'
import { JobRoleCard } from '@/components/site/JobRoleCard'
import {
  BlogCard,
  ButtonLink,
  Container,
  CtaBand,
  HeroVisual,
  ProcessTimeline,
  SectionHeading,
  ServiceCard,
  TrustStrip
} from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'
import { getFeaturedJobRoles } from '@/data/careers'
import { blogPosts, services, testimonials } from '@/data/site'

export const metadata: Metadata = {
  title: 'Care Atlas | UK Care Consultancy, Compliance, Staffing and Technology Support',
  description:
    'Care Atlas helps UK care providers build care infrastructure, launch with confidence, stay compliant, recruit staff and improve operations with technology support from Cosmonaut Labs.'
}

const whoWeHelp = [
  'Supported living providers',
  'Care agencies',
  'New care business founders',
  'Existing care organisations',
  'Care workers and registered managers'
]

const whyCareAtlas = [
  'Deep care sector understanding',
  'Practical regulatory support',
  'Operational systems thinking',
  'Technology enablement',
  'Recruitment and training support'
]

const process = [
  {
    title: 'Discover',
    body: 'We understand the service model, stage, priorities, risks and conversion path before recommending action.'
  },
  {
    title: 'Assess',
    body: 'We review documents, systems, staffing, compliance evidence and operational assumptions.'
  },
  {
    title: 'Plan',
    body: 'We turn findings into a clear plan with owners, deliverables, timelines and practical next steps.'
  },
  {
    title: 'Implement',
    body: 'We support the work across policies, registration, housing, recruitment, training, websites or systems.'
  },
  {
    title: 'Improve',
    body: 'We help services keep improving through review cycles, technology, evidence and operational learning.'
  }
]

export default function HomePage() {
  const featuredJobRoles = getFeaturedJobRoles(6)
  const featuredServices = services.filter(service =>
    [
      'supported-living-housing-benefit',
      'cqc-ofsted-registration-support',
      'cqc-inspection-support',
      'bank-staff-agency-staffing',
      'permanent-part-time-care-recruitment',
      'care-compliance-policies-protocols',
      'websites-technology-systems-support'
    ].includes(service.slug)
  )

  return (
    <>
      <section className='bg-white py-16 sm:py-20 lg:py-24'>
        <Container className='grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              CARE ATLAS | UK care sector consultancy
            </p>
            <h1 className='max-w-4xl text-4xl leading-tight font-semibold text-gray-950 sm:text-5xl lg:text-6xl'>
              Build, launch and support your care service with confidence.
            </h1>
            <p className='mt-6 max-w-2xl text-lg leading-8 text-gray-600'>
              Care Atlas helps providers and founders create the policies, systems and workflows behind stronger care
              services, prepare CQC-ready launches, and access ongoing support for compliance, tenders, staffing, growth
              and digital operations.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/contact#booking' variant='primary'>
                Book Consultation
              </ButtonLink>
              <ButtonLink href='/services' variant='secondary'>
                Explore Services
              </ButtonLink>
            </div>
            <div className='mt-8 grid gap-3 sm:grid-cols-3'>
              {[
                ['Build', 'Policies, systems and workflows'],
                ['Launch', 'CQC-ready provider setup'],
                ['Support', 'Compliance, tenders and growth']
              ].map(([label, body]) => (
                <div key={label} className='border-brand-100 bg-brand-25 rounded-lg border p-4'>
                  <p className='text-brand-700 text-sm font-semibold'>{label}</p>
                  <p className='mt-1 text-xs leading-5 text-gray-600'>{body}</p>
                </div>
              ))}
            </div>
          </div>
          <HeroVisual />
        </Container>
      </section>

      <TrustStrip />

      <section className='bg-gray-50 py-16'>
        <Container>
          <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-end'>
            <SectionHeading
              eyebrow='Services'
              title='One platform for the operational questions care businesses face.'
              body='Each service page has a clear conversion path, specific enquiry form, FAQ content and related services for users who need connected support.'
            />
            <ButtonLink href='/services' variant='secondary'>
              View Services Directory
            </ButtonLink>
          </div>
          <div className='mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
            {services.map(service => (
              <ServiceCard key={service.slug} service={service} compact />
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-2'>
          <div>
            <SectionHeading
              eyebrow='Who we help'
              title='Built for providers, operators, founders, workers and managers.'
              body='Care Atlas understands that care businesses need advice that connects regulatory expectations to staffing, housing, documentation, technology and day-to-day delivery.'
            />
            <div className='mt-8 grid gap-3 sm:grid-cols-2'>
              {whoWeHelp.map(item => (
                <div key={item} className='flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                  <SiteIcon name='users' className='text-brand-700 mt-1 h-4 w-4 shrink-0' />
                  <p className='text-sm font-medium text-gray-700'>{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className='bg-brand-950 rounded-lg p-6 text-white'>
            <p className='text-blue-light-200 text-sm font-semibold tracking-[0.12em] uppercase'>Why Care Atlas</p>
            <h2 className='mt-3 text-3xl font-semibold'>Calm, practical support for high-responsibility services.</h2>
            <div className='mt-6 grid gap-3'>
              {whyCareAtlas.map(item => (
                <div key={item} className='flex gap-3 rounded-lg bg-white/10 p-4'>
                  <SiteIcon name='check' className='text-blue-light-200 mt-1 h-4 w-4 shrink-0' />
                  <p className='text-blue-light-50 text-sm leading-6'>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-brand-25 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Featured services'
            title='The most common entry points for care organisations.'
            body='Start with one priority or combine support across registration, housing, recruitment, compliance and digital systems.'
          />
          <div className='mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
            {featuredServices.map(service => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container>
          <SectionHeading
            eyebrow='Process'
            title='A straightforward way to move from concern to action.'
            body='The process keeps consultancy practical and implementation-focused, whether the work is a care business setup, quality review, recruitment search or digital system.'
          />
          <div className='mt-10'>
            <ProcessTimeline steps={process} />
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container>
          <SectionHeading
            eyebrow='Trust'
            title='A credible platform for care leaders who need clarity.'
            body='Placeholder testimonials are structured so real case studies and client quotes can be dropped in later without changing the layout.'
          />
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {testimonials.map(testimonial => (
              <figure key={testimonial.name} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
                <blockquote className='text-sm leading-7 text-gray-700'>{testimonial.quote}</blockquote>
                <figcaption className='mt-5 border-t border-gray-200 pt-4'>
                  <p className='text-sm font-semibold text-gray-950'>{testimonial.name}</p>
                  <p className='text-xs text-gray-500'>{testimonial.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div>
            <SectionHeading
              eyebrow='Technology partner'
              title='Cosmonaut Labs supports the digital capability behind Care Atlas.'
              body='Care Atlas shapes the care-sector requirements. Cosmonaut Labs helps translate those requirements into websites, systems, software, forms, dashboards and supportable technology.'
            />
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/technology-partner/cosmonaut-labs' variant='primary'>
                Meet Cosmonaut Labs
              </ButtonLink>
              <ButtonLink href='/services/websites-technology-systems-support' variant='secondary'>
                Explore Technology Support
              </ButtonLink>
            </div>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            {['Websites', 'Booking systems', 'Dashboards', 'Care operations software'].map(item => (
              <div key={item} className='border-brand-100 bg-brand-25 rounded-lg border p-5'>
                <SiteIcon name='spark' className='text-brand-700 h-5 w-5' />
                <h3 className='mt-4 text-lg font-semibold text-gray-950'>{item}</h3>
                <p className='mt-2 text-sm leading-6 text-gray-600'>
                  Digital delivery shaped around enquiry capture, compliance evidence, recruitment and operational
                  clarity.
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container>
          <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-end'>
            <SectionHeading
              eyebrow='Insights'
              title='Care sector thinking for providers and founders.'
              body='The blog structure supports categories, tags, author metadata and future detail pages for SEO-focused care content.'
            />
            <Link href='/blog' className='text-brand-700 hover:text-brand-800 text-sm font-semibold'>
              View all insights
            </Link>
          </div>
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {blogPosts.slice(0, 3).map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr]'>
          <SectionHeading
            eyebrow='Careers'
            title='Dedicated role pages now support candidate interest by job type.'
            body='Candidates can browse separate role pages for care, leadership and consultant opportunities before using the placeholder register-interest route.'
          />
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {featuredJobRoles.map(role => (
              <JobRoleCard key={role.slug} role={role} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title='Ready to make the next care operations decision clearer?'
        body='Book a consultation, request support for a specific service, or route a recruitment enquiry through the right pathway.'
        primary={{ label: 'Book Consultation', href: '/contact#booking' }}
        secondary={{ label: 'Request Support', href: '/contact' }}
      />
    </>
  )
}
