import type { Metadata } from 'next'
import { LeadForm } from '@/components/site/LeadForm'
import { JobRoleCard } from '@/components/site/JobRoleCard'
import { ButtonLink, Container, CtaBand, SectionHeading } from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'
import { jobRoles } from '@/data/careers'

export const metadata: Metadata = {
  title: 'Careers | Find a Job as a Carer | Care Atlas',
  description:
    'Explore individual care and consultant role pages, then register interest through the Care Atlas careers and candidate signup flow.'
}

const roleGroups = [
  'Domiciliary care',
  'Supported living',
  'Bank and agency staffing',
  'Operational leadership',
  'Compliance and registration consulting'
]

export default function CareersPage() {
  return (
    <>
      <section className='bg-white py-16 sm:py-20'>
        <Container className='grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center'>
          <div>
            <p className='border-brand-200 bg-brand-50 text-brand-700 mb-4 inline-flex rounded-full border px-3 py-1 text-xs font-semibold'>
              Careers in care
            </p>
            <h1 className='text-4xl font-semibold text-gray-950 sm:text-5xl'>
              Find care and consulting opportunities that fit your experience and goals.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Care Atlas now separates each role type into its own page so candidates can understand the role, checks,
              responsibilities and next-step route before registering interest. The current flow stays placeholder-ready
              for future backend matching, screening and employer application workflows.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
              <ButtonLink href='#candidate-signup' variant='primary'>
                Register for Roles
              </ButtonLink>
              <ButtonLink href='/services/permanent-part-time-care-recruitment' variant='secondary'>
                Employers Hiring Permanently
              </ButtonLink>
              <ButtonLink href='/services/bank-staff-agency-staffing' variant='secondary'>
                Request Bank Staff
              </ButtonLink>
            </div>
          </div>
          <div className='border-brand-100 bg-brand-25 rounded-lg border p-6'>
            <h2 className='text-2xl font-semibold text-gray-950'>Dedicated role pages now available</h2>
            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
              {[
                'Role overview',
                'Who the role suits',
                'Responsibilities',
                'Required documents',
                'Training expectations',
                'Application process',
                'Register interest CTA',
                'Back-to-careers linking'
              ].map(item => (
                <div key={item} className='shadow-theme-xs flex gap-3 rounded-lg bg-white p-4'>
                  <SiteIcon name='check' className='text-brand-700 mt-1 h-4 w-4 shrink-0' />
                  <p className='text-sm font-medium text-gray-700'>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-gray-50 py-16'>
        <Container>
          <div className='flex flex-col justify-between gap-5 lg:flex-row lg:items-end'>
            <SectionHeading
              eyebrow='Job role pages'
              title='Explore dedicated pages for each care and consultant role.'
              body='Each role page explains who the role is suitable for, typical responsibilities, required documents, training expectations and the current placeholder application route.'
            />
            <div className='flex flex-wrap gap-2'>
              {roleGroups.map(group => (
                <span
                  key={group}
                  className='shadow-theme-xs rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700'
                >
                  {group}
                </span>
              ))}
            </div>
          </div>
          <div className='mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {jobRoles.map(role => (
              <JobRoleCard key={role.slug} role={role} />
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-white py-16'>
        <Container className='grid gap-8 lg:grid-cols-3'>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Permanent recruitment</p>
            <h2 className='mt-3 text-2xl font-semibold text-gray-950'>Long-term hiring for providers</h2>
            <p className='mt-3 text-sm leading-6 text-gray-600'>
              Permanent and part-time recruitment stays separate from flexible cover. Employers can use the recruitment
              route when they want a longer-term placement, manager search or structured shortlisting support.
            </p>
            <ButtonLink href='/services/permanent-part-time-care-recruitment' variant='secondary' className='mt-6'>
              View permanent recruitment
            </ButtonLink>
          </div>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Bank and agency</p>
            <h2 className='mt-3 text-2xl font-semibold text-gray-950'>Flexible staffing and urgent cover</h2>
            <p className='mt-3 text-sm leading-6 text-gray-600'>
              Bank and agency staffing is positioned as a separate service for rota gaps, sickness, annual leave, growth
              cover and emergency support. This keeps the staffing route commercially and operationally clear.
            </p>
            <ButtonLink href='/services/bank-staff-agency-staffing' variant='secondary' className='mt-6'>
              View bank staffing
            </ButtonLink>
          </div>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-6'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Application flow</p>
            <h2 className='mt-3 text-2xl font-semibold text-gray-950'>Placeholder-ready for backend handoff</h2>
            <p className='mt-3 text-sm leading-6 text-gray-600'>
              Role pages currently route candidates into a clean register-interest form. That flow can later connect to
              a recruitment backend, CRM or vacancy service without reworking the page structure.
            </p>
            <ButtonLink href='#candidate-signup' variant='secondary' className='mt-6'>
              View candidate form
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section id='candidate-signup' className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'>
          <SectionHeading
            eyebrow='Candidate signup'
            title='Create a care or consultant role interest profile.'
            body='The form remains a clean placeholder route for role preferences, location, work type, experience level and CV upload so it can later feed safer recruitment workflows.'
          />
          <LeadForm variant='candidate' />
        </Container>
      </section>

      <section className='bg-brand-25 py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'>
          <SectionHeading
            eyebrow='Employers'
            title='Hiring care staff or searching for a registered manager?'
            body='Employers can submit role details, contract type, urgency, location and compliance requirements through the permanent placement enquiry flow.'
          />
          <LeadForm variant='permanentRecruitment' title='Employer permanent recruitment enquiry' />
        </Container>
      </section>

      <CtaBand
        title='Candidates and employers now have clearer routes.'
        body='Role pages handle candidate intent, while recruitment and bank staffing stay clearly separated for provider enquiries and future backend workflows.'
        primary={{ label: 'Register for Roles', href: '#candidate-signup' }}
        secondary={{ label: 'Enquire About Recruitment', href: '/services/permanent-part-time-care-recruitment' }}
      />
    </>
  )
}
