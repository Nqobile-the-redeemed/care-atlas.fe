import { ButtonLink } from './ui'
import { RoleChip } from './PeopleUI'

type JobTypeItem = {
  title: string
  description: string
  tags: string[]
  supportWith: string
  href: string
  applyHref: string
  applyLabel: string
}

type JobTypeCategory = {
  title: string
  intro: string
  items: JobTypeItem[]
}

const categories: JobTypeCategory[] = [
  {
    title: 'Care & Support Roles',
    intro:
      'Flexible and permanent frontline roles for providers covering domiciliary care, supported living and community support.',
    items: [
      {
        title: 'Support Worker',
        description:
          'Support day-to-day routines, independence and safer support delivery in supported living and community settings.',
        tags: ['Supported Living', 'Permanent', 'Part-time'],
        supportWith: 'Role matching, candidate screening and register-interest routes.',
        href: '/careers/support-worker',
        applyHref: '/careers/support-worker#register-interest',
        applyLabel: 'Apply'
      },
      {
        title: 'Bank Staff',
        description: 'Flexible shift cover for rota gaps, sickness support and urgent staffing demand.',
        tags: ['Bank', 'Agency-style', 'Flexible'],
        supportWith: 'Availability capture, compliance checks and staffing-pool onboarding.',
        href: '/careers/bank-staff',
        applyHref: '/careers/bank-staff#register-interest',
        applyLabel: 'Register interest'
      },
      {
        title: 'Senior Carer',
        description: 'Shift leadership, medication support and quality-focused frontline coordination.',
        tags: ['Permanent', 'Medication', 'Supported Living'],
        supportWith: 'Leadership-role routing, medication readiness and safer recruitment checks.',
        href: '/careers/senior-carer',
        applyHref: '/careers/senior-carer#register-interest',
        applyLabel: 'Apply'
      },
      {
        title: 'Carer',
        description: 'Person-centred care delivery across domiciliary care, community support and provider services.',
        tags: ['Domiciliary', 'Bank', 'Permanent'],
        supportWith: 'Location matching, compliance document capture and onboarding readiness.',
        href: '/careers/carer',
        applyHref: '/careers/carer#register-interest',
        applyLabel: 'Register interest'
      }
    ]
  },
  {
    title: 'Clinical & Specialist Roles',
    intro:
      'Clinical, compliance and specialist support roles for providers needing stronger oversight, systems and readiness.',
    items: [
      {
        title: 'Nurse',
        description:
          'Clinical oversight, documentation and safe delegation for complex care and regulated service settings.',
        tags: ['Clinical', 'Complex Care', 'Bank'],
        supportWith: 'Clinical matching, registration checks and provider screening.',
        href: '/careers/nurse',
        applyHref: '/careers/nurse#register-interest',
        applyLabel: 'Register interest'
      },
      {
        title: 'Compliance Consultant',
        description: 'Support providers with audits, policies, procedures and governance improvement planning.',
        tags: ['Compliance', 'Contract', 'Quality'],
        supportWith: 'Project scoping, governance background review and consultant onboarding.',
        href: '/careers/compliance-consultant',
        applyHref: '/careers/compliance-consultant#register-interest',
        applyLabel: 'Apply'
      },
      {
        title: 'CQC Registration Consultant',
        description:
          'Assist providers to prepare statements, governance packs and launch-stage registration readiness work.',
        tags: ['CQC', 'Associate', 'Registration'],
        supportWith: 'Registration-project matching and document-preparation workflows.',
        href: '/careers/cqc-registration-consultant',
        applyHref: '/careers/cqc-registration-consultant#register-interest',
        applyLabel: 'Register interest'
      }
    ]
  },
  {
    title: 'Leadership & Office Roles',
    intro:
      'Management, coordination and office-based roles supporting service growth, staffing structure and operational control.',
    items: [
      {
        title: 'Care Coordinator',
        description: 'Coordinate rotas, care planning, client communication and staffing logistics.',
        tags: ['Office', 'Hybrid', 'Permanent'],
        supportWith: 'Operations-role routing, scheduling-fit review and provider matching.',
        href: '/careers/care-coordinator',
        applyHref: '/careers/care-coordinator#register-interest',
        applyLabel: 'Apply'
      },
      {
        title: 'Care Manager',
        description: 'Lead teams, strengthen governance and support quality assurance across provider services.',
        tags: ['Leadership', 'Permanent', 'Governance'],
        supportWith: 'Management search support, quality-role screening and onboarding planning.',
        href: '/careers/care-manager',
        applyHref: '/careers/care-manager#register-interest',
        applyLabel: 'Register interest'
      },
      {
        title: 'Registered Manager',
        description:
          'Lead regulated services with oversight of staffing, compliance, evidence and operational readiness.',
        tags: ['CQC', 'Permanent', 'Leadership'],
        supportWith: 'Registered manager search support, leadership-role review and provider introductions.',
        href: '/careers/registered-manager',
        applyHref: '/careers/registered-manager#register-interest',
        applyLabel: 'Apply'
      },
      {
        title: 'Recruitment Consultant',
        description:
          'Support employer briefs, candidate screening and safer recruitment workflows for care-sector hiring.',
        tags: ['Recruitment', 'Remote-first', 'Permanent'],
        supportWith: 'Recruitment process setup, care-sector screening and associate role pathways.',
        href: '/careers/recruitment-consultant',
        applyHref: '/careers/recruitment-consultant#register-interest',
        applyLabel: 'Register interest'
      }
    ]
  }
]

export function JobTypeCard({ item }: { item: JobTypeItem }) {
  return (
    <article className='shadow-theme-xs flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6'>
      <div className='flex items-start justify-between gap-3'>
        <h3 className='text-xl font-semibold text-gray-950'>{item.title}</h3>
        <span className='text-brand-700 bg-brand-50 rounded-full px-3 py-1 text-xs font-semibold'>Role type</span>
      </div>

      <p className='mt-4 text-sm leading-6 text-gray-600'>{item.description}</p>

      <div className='mt-5 flex flex-wrap gap-2'>
        {item.tags.map(tag => (
          <RoleChip key={tag} label={tag} tone='slate' />
        ))}
      </div>

      <div className='border-brand-100 bg-brand-25 mt-5 rounded-lg border p-4'>
        <p className='text-brand-700 text-xs font-semibold tracking-[0.08em] uppercase'>What we support with</p>
        <p className='mt-2 text-sm leading-6 text-gray-700'>{item.supportWith}</p>
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        <ButtonLink href={item.href} variant='primary' className='w-full'>
          View role page
        </ButtonLink>
        <ButtonLink href={item.applyHref} variant='secondary' className='w-full'>
          {item.applyLabel}
        </ButtonLink>
      </div>
    </article>
  )
}

export function CareersRoleGrid() {
  return (
    <div className='space-y-8'>
      {categories.map(category => (
        <section key={category.title} className='rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6'>
          <div className='mb-6 max-w-3xl'>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>{category.title}</p>
            <p className='mt-3 text-sm leading-6 text-gray-600 sm:text-base'>{category.intro}</p>
          </div>

          <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5'>
            {category.items.map(item => (
              <JobTypeCard key={item.title} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
