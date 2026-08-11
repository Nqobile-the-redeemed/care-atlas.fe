import type { Metadata } from 'next'
import Link from 'next/link'
import { CareersRoleGrid } from '@/components/site/CareersRoleGrid'
import {
  AvatarStack,
  RoleChip,
  SpecialistSupportGrid,
  TestimonialCard,
  type AvatarMember
} from '@/components/site/PeopleUI'
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

const supportRoles: Array<{
  title: string
  body: string
  roles: string[]
  members: AvatarMember[]
}> = [
  {
    title: 'CQC Registration',
    body: 'Support with registration preparation, statement of purpose development, governance planning and launch readiness for new providers.',
    roles: ['Compliance Lead', 'Registered Manager Advisor'],
    members: [
      { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' },
      { name: 'Maya Thomas', initials: 'MT', role: 'Registered Manager Advisor', tone: 'blue' }
    ]
  },
  {
    title: 'Recruitment',
    body: 'Support with safer recruitment structure, role briefs, candidate screening and provider hiring workflows across permanent and flexible staffing needs.',
    roles: ['Recruitment Consultant', 'Operations Advisor'],
    members: [
      { name: 'Aisha Rahman', initials: 'AR', role: 'Recruitment Consultant', tone: 'green' },
      { name: 'Owen Clarke', initials: 'OC', role: 'Operations Advisor', tone: 'slate' }
    ]
  },
  {
    title: 'Website Build',
    body: 'Support with provider websites, enquiry journeys, credibility content and digital workflows that help care services look organised and trustworthy.',
    roles: ['Web Designer', 'Content Systems'],
    members: [
      { name: 'Nina Patel', initials: 'NP', role: 'Web Designer', tone: 'blue' },
      { name: 'Leo Hart', initials: 'LH', role: 'Systems Builder', tone: 'slate' }
    ]
  },
  {
    title: 'CQC Inspection Support',
    body: 'Support with mock inspection preparation, evidence mapping, action tracking and quality assurance follow-up ahead of external scrutiny.',
    roles: ['QA Lead', 'Governance Lead'],
    members: [
      { name: 'Daniel Cole', initials: 'DC', role: 'QA Lead', tone: 'gold' },
      { name: 'Priya Singh', initials: 'PS', role: 'Governance Lead', tone: 'brand' }
    ]
  },
  {
    title: 'CosmoSuite',
    body: 'Support with care-sector systems thinking, enquiry routing, dashboards, forms and operational visibility through the digital capability behind Care Atlas.',
    roles: ['Web Team', 'Systems Builder'],
    members: [
      { name: 'Nina Patel', initials: 'NP', role: 'Web Designer', tone: 'blue' },
      { name: 'Leo Hart', initials: 'LH', role: 'Systems Builder', tone: 'slate' }
    ]
  },
  {
    title: 'Tender Readiness',
    body: 'Support with tender preparation, evidence organisation, quality narratives and submission planning for providers pursuing growth opportunities.',
    roles: ['Bid Support', 'Governance Review'],
    members: [
      { name: 'Daniel Cole', initials: 'DC', role: 'QA Lead', tone: 'gold' },
      { name: 'Owen Clarke', initials: 'OC', role: 'Operations Advisor', tone: 'slate' }
    ]
  }
]

const launchTeam = [
  { label: 'Compliance', detail: 'Registration preparation, policies and governance ownership' },
  { label: 'Recruitment', detail: 'Safer recruitment setup, screening workflows and provider hiring support' },
  { label: 'Web', detail: 'Website delivery, enquiry capture and trust-building digital journeys' },
  { label: 'Operations', detail: 'Workflow design, readiness tracking and calmer launch coordination' },
  { label: 'QA', detail: 'Inspection readiness, evidence review and quality assurance follow-up' }
]

export default function HomePage() {
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
      <section className='bg-white py-14 sm:py-18 lg:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(600px,1.12fr)] lg:items-stretch lg:gap-12'>
          <div className='flex h-full max-w-2xl flex-col justify-start pt-2 lg:min-h-[560px] lg:justify-start lg:self-stretch lg:pt-8'>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              CARE ATLAS | UK care sector consultancy
            </p>
            <h1 className='max-w-4xl text-4xl leading-tight font-semibold text-gray-950 sm:text-5xl lg:text-6xl'>
              Launch, register, recruit and run your care service with confidence.
            </h1>
            <p className='mt-6 max-w-2xl text-lg leading-8 text-gray-600'>
              Care Atlas helps new and growing care providers with CQC registration, policies, recruitment, websites,
              inspection readiness, digital systems and operational support.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <ButtonLink href='/contact#booking' variant='primary'>
                Book a consultation
              </ButtonLink>
              <ButtonLink href='/services' variant='secondary'>
                View services
              </ButtonLink>
            </div>
            <div className='mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
              <div className='border-brand-100 bg-brand-25 rounded-xl border p-4'>
                <p className='text-brand-700 text-xs font-semibold tracking-[0.08em] uppercase'>Your launch team</p>
                <div className='mt-3 flex items-center gap-3'>
                  <AvatarStack
                    members={[
                      { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' },
                      { name: 'Maya Thomas', initials: 'MT', role: 'Nominated Individual', tone: 'blue' },
                      { name: 'Aisha Rahman', initials: 'AR', role: 'Recruitment Consultant', tone: 'green' },
                      { name: 'Nina Patel', initials: 'NP', role: 'Web Designer', tone: 'blue' }
                    ]}
                    size='sm'
                  />
                  <p className='text-sm leading-6 text-gray-700'>
                    Compliance, recruitment, web and operations support around one provider journey.
                  </p>
                </div>
              </div>
              <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1'>
                {[
                  ['CQC registration support', 'Launch readiness, policies and governance'],
                  ['Recruitment and systems', 'Hiring support, websites and enquiry workflows']
                ].map(([label, body]) => (
                  <div key={label} className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
                    <p className='text-sm font-semibold text-gray-950'>{label}</p>
                    <p className='mt-1 text-xs leading-5 text-gray-600'>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='flex w-full self-stretch lg:h-[560px] lg:justify-self-end'>
            <HeroVisual />
          </div>
        </Container>
      </section>

      <TrustStrip />

      <section className='border-brand-100 border-b bg-white py-8'>
        <Container className='flex flex-col justify-between gap-5 lg:flex-row lg:items-center'>
          <div className='flex items-start gap-4'>
            <span className='bg-brand-50 text-brand-700 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg'>
              <SiteIcon name='search' className='h-5 w-5' />
            </span>
            <div>
              <h2 className='text-xl font-semibold text-gray-950'>Care Atlas Tender Navigator</h2>
              <p className='mt-1 max-w-3xl text-sm leading-6 text-gray-600'>
                Browse current UK care, housing and cleaning opportunities, then unlock the full catalogue and bid
                support workflow.
              </p>
            </div>
          </div>
          <ButtonLink href='/tenders' variant='primary' className='shrink-0'>
            Browse tender previews
          </ButtonLink>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container>
          <div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-end'>
            <SectionHeading
              eyebrow='Services'
              title='One platform for the operational questions care businesses face.'
              body='Each service card now shows the kind of specialist support team that may sit behind the work, helping providers connect services to people, ownership and delivery.'
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
            body='Start with one priority or combine support across registration, housing, recruitment, compliance and digital systems with visible specialist ownership.'
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
            eyebrow='Who supports you?'
            title='A support model that feels like a calm care operations platform.'
            body='Care Atlas brings together compliance, recruitment, website, systems and operational support so providers can see the people and workstreams behind progress.'
          />
          <div className='mt-10'>
            <SpecialistSupportGrid items={supportRoles} />
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
          <div>
            <SectionHeading
              eyebrow='Your launch team'
              title='Clients may receive support across compliance, recruitment, websites, systems and operations.'
              body='The team depends on scope, but the operating model stays clear: one coordinated view of work, owners and next steps across launch and improvement activity.'
            />
            <div className='mt-6 flex items-center gap-4'>
              <AvatarStack
                members={[
                  { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' },
                  { name: 'Aisha Rahman', initials: 'AR', role: 'Recruitment Consultant', tone: 'green' },
                  { name: 'Nina Patel', initials: 'NP', role: 'Web Designer', tone: 'blue' },
                  { name: 'Owen Clarke', initials: 'OC', role: 'Care Operations Advisor', tone: 'slate' },
                  { name: 'Daniel Cole', initials: 'DC', role: 'QA Lead', tone: 'gold' }
                ]}
                size='md'
              />
              <p className='text-sm leading-6 text-gray-600'>
                A visible team structure helps founders and providers understand who is supporting registration,
                recruitment, evidence, policies, care planning systems and launch tasks.
              </p>
            </div>
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            {launchTeam.map(item => (
              <div key={item.label} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-5'>
                <RoleChip label={item.label} tone='blue' />
                <p className='mt-4 text-sm leading-6 text-gray-600'>{item.detail}</p>
              </div>
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
            body='Testimonials use initials avatars, provider type and location so the interface feels human and trustworthy without relying on generic face photography.'
          />
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {testimonials.map(testimonial => (
              <TestimonialCard key={`${testimonial.name}-${testimonial.location}`} testimonial={testimonial} />
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
            <div className='mt-5 flex flex-wrap gap-2'>
              {['Web Designer', 'Systems Builder', 'CosmoSuite', 'Enquiry workflows'].map(label => (
                <RoleChip key={label} label={label} tone='blue' />
              ))}
            </div>
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
        <Container>
          <SectionHeading
            eyebrow='Careers'
            title='Job types are organised into clearer, wider role pathways.'
            body='Browse care and support, clinical and specialist, and leadership or office roles in a calmer grid that is easier to scan on desktop and mobile.'
          />
          <div className='mt-10'>
            <CareersRoleGrid />
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
