import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LeadForm } from '@/components/site/LeadForm'
import { ButtonLink, Container, CtaBand, FeatureGrid, SectionHeading } from '@/components/site/ui'
import { getJobRoleBySlug, jobRoles } from '@/data/careers'

type JobRolePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return jobRoles.map(role => ({
    slug: role.slug
  }))
}

export async function generateMetadata({ params }: JobRolePageProps): Promise<Metadata> {
  const { slug } = await params
  const role = getJobRoleBySlug(slug)

  if (!role) {
    return {
      title: 'Role Not Found | Care Atlas'
    }
  }

  return {
    title: role.seo.title,
    description: role.seo.description
  }
}

export default async function JobRolePage({ params }: JobRolePageProps) {
  const { slug } = await params
  const role = getJobRoleBySlug(slug)

  if (!role) {
    notFound()
  }

  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              {role.team}
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>{role.title}</h1>
            <p className='text-brand-700 mt-4 text-sm font-semibold'>
              {role.type} | {role.location}
            </p>
            <p className='mt-5 max-w-3xl text-lg leading-8 text-gray-600'>{role.overview}</p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
              <ButtonLink href='#register-interest' variant='primary'>
                {role.ctaLabel}
              </ButtonLink>
              <ButtonLink href='/careers' variant='secondary'>
                Back to Careers
              </ButtonLink>
              <ButtonLink href='/services/permanent-part-time-care-recruitment' variant='ghost'>
                Employer recruitment service
              </ButtonLink>
            </div>
          </div>
          <div className='border-brand-100 bg-brand-25 rounded-lg border p-6'>
            <h2 className='text-2xl font-semibold text-gray-950'>Role snapshot</h2>
            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              {[
                ['Team', role.team],
                ['Work type', role.type],
                ['Location', role.location],
                ['CTA route', role.ctaLabel]
              ].map(([label, value]) => (
                <div key={label} className='rounded-lg bg-white p-4'>
                  <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>{label}</p>
                  <p className='mt-1 text-sm font-semibold text-gray-900'>{value}</p>
                </div>
              ))}
            </div>
            <div className='mt-6 flex flex-wrap gap-2'>
              {role.tags.map(tag => (
                <span key={tag} className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700'>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr]'>
          <SectionHeading
            eyebrow='Role overview'
            title='Who this role is suitable for.'
            body='Each opportunity depends on provider needs, final checks and location, but these are the common profile signals that usually fit the role.'
          />
          <FeatureGrid items={role.suitableFor} />
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-8 lg:grid-cols-2'>
          <div>
            <SectionHeading
              eyebrow='Responsibilities'
              title='Typical responsibilities.'
              body='Final duties vary by provider, service type and scope, but this page sets out the main responsibilities candidates can expect.'
            />
            <div className='mt-8'>
              <FeatureGrid items={role.responsibilities} />
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow='Experience'
              title='Experience and readiness.'
              body='Care Atlas uses careful wording because provider requirements, interviews and final hiring decisions still sit with the employer.'
            />
            <div className='mt-8'>
              <FeatureGrid items={role.requiredExperience} />
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-brand-25 py-16'>
        <Container className='grid gap-8 lg:grid-cols-2'>
          <div>
            <SectionHeading
              eyebrow='Documents'
              title='Required documents.'
              body='The exact list may vary, but these are the common checks and documents likely to be requested subject to final provider review.'
            />
            <div className='mt-8'>
              <FeatureGrid items={role.requiredDocuments} />
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow='Training and compliance'
              title='Training and compliance expectations.'
              body='Providers will usually expect training, safer recruitment checks, policy awareness and ongoing staff file accuracy before deployment or start date.'
            />
            <div className='mt-8'>
              <FeatureGrid items={role.trainingExpectations} />
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-8 lg:grid-cols-[0.8fr_1.2fr]'>
          <SectionHeading
            eyebrow='Application process'
            title='Current application route.'
            body='Application functionality is intentionally placeholder-ready. Candidates can register interest now, then connect to a fuller backend workflow later.'
          />
          <FeatureGrid items={role.applicationProcess} />
        </Container>
      </section>

      <section id='register-interest' className='bg-gray-50 py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'>
          <SectionHeading
            eyebrow='Register interest'
            title={`Apply for ${role.title} opportunities.`}
            body='This candidate form is a clean placeholder route. It can later connect to role-specific application records, vacancy matching and safer recruitment workflows.'
          />
          <LeadForm
            variant='candidate'
            title={`${role.title} register interest form`}
            intro='Share your role preference, location and experience so Care Atlas can route your profile into future recruitment workflows.'
          />
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-2xl font-semibold text-gray-950'>Looking at provider-side hiring too?</h2>
            <p className='mt-2 max-w-3xl text-sm leading-6 text-gray-600'>
              Care Atlas keeps permanent recruitment separate from bank and agency staffing so the role, pricing route
              and compliance expectations stay clear.
            </p>
          </div>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <ButtonLink href='/services/permanent-part-time-care-recruitment' variant='secondary'>
              Permanent recruitment
            </ButtonLink>
            <ButtonLink href='/services/bank-staff-agency-staffing' variant='secondary'>
              Bank and agency staffing
            </ButtonLink>
          </div>
        </Container>
      </section>

      <CtaBand
        title='Need to browse other role types first?'
        body='Return to the careers hub to compare care roles, leadership positions and consultant routes before registering interest.'
        primary={{ label: 'Back to Careers', href: '/careers' }}
        secondary={{ label: 'View Recruitment Services', href: '/services/permanent-part-time-care-recruitment' }}
      />
    </>
  )
}
