import type { Metadata } from 'next'
import { LeadForm } from '@/components/site/LeadForm'
import { ButtonLink, Container, CtaBand, SectionHeading } from '@/components/site/ui'
import { SiteIcon } from '@/components/site/SiteIcon'
import { jobListings } from '@/data/site'

export const metadata: Metadata = {
  title: 'Careers | Find a Job as a Carer | Care Atlas',
  description:
    'Register interest for care worker, support worker and registered manager roles through Care Atlas candidate signup and job matching placeholders.'
}

const filters = [
  'All roles',
  'Care worker',
  'Support worker',
  'Senior carer',
  'Care coordinator',
  'Nurse',
  'Registered manager',
  'Part-time',
  'Full-time',
  'Bank'
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
              Find care work that fits your experience and goals.
            </h1>
            <p className='mt-5 text-lg leading-8 text-gray-600'>
              Care Atlas helps care workers, support workers, senior carers and registered managers register interest
              for opportunities with care providers. Share your preferences now and the platform can later connect to
              active jobs, candidate screening and employer matching.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
              <ButtonLink href='#candidate-signup' variant='primary'>
                Apply for Care Jobs
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
            <h2 className='text-2xl font-semibold text-gray-950'>Candidate profile fields ready for production</h2>
            <div className='mt-5 grid gap-3 sm:grid-cols-2'>
              {[
                'Role preference',
                'Location preference',
                'Work type',
                'Experience level',
                'Right to work',
                'Certifications',
                'CV upload',
                'Availability'
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
              eyebrow='Job listings'
              title='Featured care opportunities structure.'
              body='These placeholder job cards show how a later admin dashboard or CMS can publish roles, locations, tags and application flows.'
            />
            <div className='flex flex-wrap gap-2'>
              {filters.map(filter => (
                <button
                  key={filter}
                  type='button'
                  className='shadow-theme-xs hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition'
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className='mt-10 grid gap-5 md:grid-cols-3'>
            {jobListings.map(job => (
              <article key={job.title} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
                <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>{job.type}</p>
                <h2 className='mt-3 text-xl font-semibold text-gray-950'>{job.title}</h2>
                <p className='text-brand-700 mt-2 text-sm font-medium'>{job.location}</p>
                <p className='mt-4 text-sm leading-6 text-gray-600'>{job.summary}</p>
                <div className='mt-5 flex flex-wrap gap-2'>
                  {job.tags.map(tag => (
                    <span key={tag} className='bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-semibold'>
                      {tag}
                    </span>
                  ))}
                </div>
                <ButtonLink href='#candidate-signup' variant='secondary' className='mt-6 w-full'>
                  Register your interest
                </ButtonLink>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id='candidate-signup' className='bg-white py-16'>
        <Container className='grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start'>
          <SectionHeading
            eyebrow='Candidate signup'
            title='Create a care job interest profile.'
            body='The form includes role preferences, location, work type, experience level and CV upload placeholder fields so it can later feed recruitment workflows.'
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
        title='Care candidates and employers can start from the same platform.'
        body='Candidates register interest. Employers submit vacancies. Care Atlas can later connect both sides through a recruitment workflow.'
        primary={{ label: 'Register for Care Jobs', href: '#candidate-signup' }}
        secondary={{ label: 'Enquire About Recruitment', href: '/services/permanent-part-time-care-recruitment' }}
      />
    </>
  )
}
