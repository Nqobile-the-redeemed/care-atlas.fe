import type { Service, Testimonial } from '@/data/site'
import { SiteIcon } from './SiteIcon'

export type AvatarMember = {
  name: string
  initials: string
  role?: string
  tone?: 'brand' | 'green' | 'blue' | 'slate' | 'gold'
}

function toneClasses(tone: AvatarMember['tone'] = 'brand') {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    green: 'bg-success-50 text-success-700 border-success-200',
    blue: 'bg-blue-light-50 text-brand-800 border-blue-light-200',
    slate: 'bg-gray-100 text-gray-700 border-gray-200',
    gold: 'bg-warning-25 text-warning-700 border-warning-200'
  }

  return tones[tone]
}

export function AvatarBubble({
  member,
  size = 'md',
  decorative = true
}: {
  member: AvatarMember
  size?: 'xs' | 'sm' | 'md' | 'lg'
  decorative?: boolean
}) {
  const sizes = {
    xs: 'h-8 w-8 text-[10px]',
    sm: 'h-10 w-10 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-14 w-14 text-base'
  }

  return (
    <span
      aria-hidden={decorative}
      className={`${sizes[size]} ${toneClasses(member.tone)} inline-flex shrink-0 items-center justify-center rounded-full border font-semibold shadow-sm`}
      title={member.name}
    >
      {member.initials}
    </span>
  )
}

export function AvatarStack({
  members,
  size = 'sm',
  maxVisible = members.length
}: {
  members: AvatarMember[]
  size?: 'xs' | 'sm' | 'md' | 'lg'
  maxVisible?: number
}) {
  const visibleMembers = members.slice(0, maxVisible)
  const remaining = Math.max(0, members.length - visibleMembers.length)

  return (
    <div className='flex items-center'>
      {visibleMembers.map((member, index) => (
        <div key={member.name} className={index === 0 ? '' : '-ml-3'}>
          <AvatarBubble member={member} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <span className='-ml-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 shadow-sm'>
          +{remaining}
        </span>
      )}
    </div>
  )
}

export function RoleChip({
  label,
  tone = 'slate'
}: {
  label: string
  tone?: 'brand' | 'green' | 'blue' | 'slate' | 'gold'
}) {
  return (
    <span className={`${toneClasses(tone)} inline-flex rounded-full border px-3 py-1 text-xs font-semibold`}>
      {label}
    </span>
  )
}

export function AssignedTeamCard({
  title,
  status,
  metaLabel,
  metaValue,
  assignees,
  chips = [],
  progress
}: {
  title: string
  status: string
  metaLabel: string
  metaValue: string
  assignees: AvatarMember[]
  chips?: string[]
  progress?: number
}) {
  return (
    <article className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-4'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Operations card</p>
          <h3 className='mt-2 text-base font-semibold text-gray-950'>{title}</h3>
        </div>
        <RoleChip label={status} tone='brand' />
      </div>

      <div className='mt-4 flex items-center justify-between gap-4 rounded-lg bg-gray-50 px-3 py-3'>
        <div>
          <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Assigned to</p>
          <div className='mt-2 flex items-center gap-3'>
            <AvatarStack members={assignees} size='sm' />
            <p className='text-sm font-medium text-gray-700'>
              {assignees.map(member => member.role ?? member.name).join(' + ')}
            </p>
          </div>
        </div>
      </div>

      <div className='mt-4 flex items-end justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>{metaLabel}</p>
          <p className='mt-1 text-lg font-semibold text-gray-950'>{metaValue}</p>
        </div>
        {typeof progress === 'number' && (
          <div className='min-w-[120px]'>
            <div className='mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-gray-500'>
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className='bg-brand-50 h-2 overflow-hidden rounded-full'>
              <div className='bg-brand-600 h-full rounded-full' style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {chips.length > 0 && (
        <div className='mt-4 flex flex-wrap gap-2'>
          {chips.map(chip => (
            <RoleChip key={chip} label={chip} tone='slate' />
          ))}
        </div>
      )}
    </article>
  )
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const member: AvatarMember = {
    name: testimonial.name,
    initials: testimonial.initials,
    tone: 'brand'
  }

  return (
    <figure className='shadow-theme-xs h-full rounded-lg border border-gray-200 bg-white p-6'>
      <div className='flex items-center gap-4'>
        <AvatarBubble member={member} size='md' />
        <div>
          <p className='text-sm font-semibold text-gray-950'>{testimonial.name}</p>
          <p className='text-xs text-gray-500'>
            {testimonial.providerType} | {testimonial.location}
          </p>
        </div>
      </div>
      <blockquote className='mt-5 text-sm leading-7 text-gray-700'>{testimonial.quote}</blockquote>
      <figcaption className='mt-5 border-t border-gray-200 pt-4 text-sm text-gray-600'>{testimonial.role}</figcaption>
    </figure>
  )
}

export function SpecialistSupportGrid({
  items
}: {
  items: Array<{
    title: string
    body: string
    roles: string[]
    members: AvatarMember[]
  }>
}) {
  return (
    <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
      {items.map(item => (
        <article key={item.title} className='shadow-theme-xs rounded-lg border border-gray-200 bg-white p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Support stream</p>
              <h3 className='mt-2 text-xl font-semibold text-gray-950'>{item.title}</h3>
            </div>
            <AvatarStack members={item.members} size='sm' maxVisible={3} />
          </div>
          <p className='mt-4 text-sm leading-6 text-gray-600'>{item.body}</p>
          <div className='mt-5 flex flex-wrap gap-2'>
            {item.roles.map(role => (
              <RoleChip key={role} label={role} tone='blue' />
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

type HeroWorkspaceCard = {
  title: string
  status: string
  metricLabel: string
  metricValue: string
  assignees: AvatarMember[]
  progress?: number
}

const heroWorkspaceCards: HeroWorkspaceCard[] = [
  {
    title: 'CQC Registration',
    status: 'In progress',
    metricLabel: 'Progress',
    metricValue: '72%',
    progress: 72,
    assignees: [
      { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' },
      { name: 'Maya Thomas', initials: 'MT', role: 'RM Advisor', tone: 'blue' }
    ]
  },
  {
    title: 'Recruitment Setup',
    status: 'Screening candidates',
    metricLabel: 'Candidates screened',
    metricValue: '14',
    assignees: [{ name: 'Aisha Rahman', initials: 'AR', role: 'Recruitment Consultant', tone: 'green' }]
  },
  {
    title: 'Website & Enquiries',
    status: 'Building',
    metricLabel: 'Pages complete',
    metricValue: '8/12',
    assignees: [
      { name: 'Nina Patel', initials: 'NP', role: 'Web Designer', tone: 'blue' },
      { name: 'Leo Hart', initials: 'LH', role: 'Web Team', tone: 'slate' }
    ]
  }
]

const heroWorkspaceStats = [
  ['Documents reviewed', '32'],
  ['Policies ready', '24'],
  ['Candidates screened', '14'],
  ['Next action', 'RM interview prep']
] as const

function HeroWorkspaceCard({ card }: { card: HeroWorkspaceCard }) {
  return (
    <article className='shadow-theme-xs flex flex-col rounded-xl border border-gray-200 bg-white p-3.5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-brand-600 text-[11px] font-semibold tracking-[0.08em] uppercase'>Workspace</p>
          <h3 className='mt-1 text-base font-semibold text-gray-950'>{card.title}</h3>
        </div>
        <RoleChip label={card.status} tone='blue' />
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5'>
        <AvatarStack members={card.assignees} size='xs' />
        <p className='text-xs font-medium text-gray-700'>{card.assignees.map(member => member.role).join(' + ')}</p>
      </div>

      <div className='mt-3 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]'>
        <div className='rounded-lg bg-gray-50 px-3 py-2.5'>
          <p className='text-[11px] font-semibold tracking-[0.08em] text-gray-500 uppercase'>{card.metricLabel}</p>
          <p className='mt-1 text-base font-semibold text-gray-950'>{card.metricValue}</p>
        </div>
        {typeof card.progress === 'number' && (
          <div className='rounded-lg bg-gray-50 px-3 py-2.5'>
            <div className='flex items-center justify-between gap-2 text-[11px] font-semibold text-gray-500'>
              <span>Progress</span>
              <span>{card.progress}%</span>
            </div>
            <div className='bg-brand-100 mt-2 h-2 overflow-hidden rounded-full'>
              <div className='bg-brand-600 h-full rounded-full' style={{ width: `${card.progress}%` }} />
            </div>
          </div>
        )}
        {typeof card.progress !== 'number' && (
          <div className='rounded-lg bg-gray-50 px-3 py-2.5'>
            <p className='text-[11px] font-semibold tracking-[0.08em] text-gray-500 uppercase'>Launch status</p>
            <p className='mt-1 text-base font-semibold text-gray-950'>{card.status}</p>
          </div>
        )}
      </div>
    </article>
  )
}

function HeroTaskMiniCard({ item }: { item: HeroWorkspaceCard }) {
  return (
    <div className='rounded-lg bg-gray-50 p-3'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-sm font-semibold text-gray-900'>{item.title}</p>
          <p className='mt-1 text-xs font-medium text-gray-500'>{item.status}</p>
        </div>
        <p className='text-sm font-semibold text-gray-950'>{item.metricValue}</p>
      </div>
      <div className='mt-3 flex flex-wrap items-center gap-3'>
        <AvatarStack members={item.assignees} size='xs' />
        <p className='text-xs font-medium text-gray-700'>{item.assignees.map(member => member.role).join(' + ')}</p>
      </div>
    </div>
  )
}

function HeroDualTaskCard({ recruitment, website }: { recruitment: HeroWorkspaceCard; website: HeroWorkspaceCard }) {
  return (
    <article className='shadow-theme-xs flex flex-col rounded-xl border border-gray-200 bg-white p-3.5'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-brand-600 text-[11px] font-semibold tracking-[0.08em] uppercase'>Workspace</p>
          <h3 className='mt-1 text-base font-semibold text-gray-950'>Recruitment and enquiries</h3>
        </div>
        <RoleChip label='Live launch tasks' tone='slate' />
      </div>

      <div className='mt-3 grid gap-3'>
        <HeroTaskMiniCard item={recruitment} />
        <HeroTaskMiniCard item={website} />
      </div>
    </article>
  )
}

export function HeroOperationsDashboard({ team, className = '' }: { team: AvatarMember[]; className?: string }) {
  return (
    <section
      aria-label='Care Atlas Launch Workspace dashboard'
      className={`border-brand-100 shadow-theme-lg relative flex w-full flex-col rounded-[24px] border bg-white ${className}`}
    >
      <div className='absolute inset-0 rounded-[24px] bg-[linear-gradient(135deg,#ffffff_0%,#f6f9ff_52%,#ffffff_100%)]' />
      <div className='bg-brand-500/7 absolute -top-16 right-16 h-44 w-44 rounded-full' />
      <div className='bg-blue-light-500/8 absolute -bottom-20 -left-10 h-48 w-48 rounded-full' />

      <div className='pointer-events-none absolute top-4 right-4 hidden rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur md:block'>
        RM evidence reviewed
      </div>
      <div className='pointer-events-none absolute bottom-16 left-6 hidden rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur xl:block'>
        Policy pack 24/30 complete
      </div>
      <div className='pointer-events-none absolute right-8 bottom-5 hidden rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur lg:block'>
        14 candidates screened
      </div>

      <div className='relative flex h-full flex-1 flex-col p-4 sm:p-5'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-4'>
          <div>
            <p className='text-brand-600 text-xs font-semibold tracking-[0.12em] uppercase'>
              Care Atlas launch workspace
            </p>
            <h2 className='mt-2 text-xl font-semibold text-gray-950 lg:text-2xl'>Provider launch command centre</h2>
          </div>
          <div className='flex flex-wrap items-center gap-3 lg:justify-end'>
            <div className='rounded-full border border-gray-200 bg-white px-4 py-2'>
              <div className='flex items-center gap-3'>
                <span className='text-[11px] font-semibold tracking-[0.08em] text-gray-500 uppercase'>
                  Launch progress
                </span>
                <div className='bg-brand-100 h-2 w-24 overflow-hidden rounded-full'>
                  <div className='bg-brand-600 h-full rounded-full' style={{ width: '72%' }} />
                </div>
                <span className='text-sm font-semibold text-gray-900'>72%</span>
              </div>
            </div>
            <div className='rounded-full border border-gray-200 bg-white px-4 py-2'>
              <div className='flex flex-wrap items-center gap-3'>
                <AvatarStack members={team} size='xs' maxVisible={4} />
                <span className='text-sm font-medium text-gray-700'>Your launch team</span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-5 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]'>
          <HeroWorkspaceCard card={heroWorkspaceCards[0]} />
          <HeroDualTaskCard recruitment={heroWorkspaceCards[1]} website={heroWorkspaceCards[2]} />
        </div>

        <div className='mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
          {heroWorkspaceStats.map(([label, value]) => (
            <div key={label} className='rounded-xl border border-gray-200 bg-gray-50 px-4 py-3'>
              <p className='text-[11px] font-semibold tracking-[0.08em] text-gray-500 uppercase'>{label}</p>
              <p className='mt-2 text-sm font-semibold text-gray-950'>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const serviceTeams: Record<string, { members: AvatarMember[]; chips: string[] }> = {
  'cqc-ofsted-registration-support': {
    members: [
      { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' },
      { name: 'Maya Thomas', initials: 'MT', role: 'Registered Manager Advisor', tone: 'blue' }
    ],
    chips: ['Compliance Lead', 'Registered Manager Advisor']
  },
  'permanent-part-time-care-recruitment': {
    members: [{ name: 'Aisha Rahman', initials: 'AR', role: 'Recruitment Consultant', tone: 'green' }],
    chips: ['Recruitment Consultant', 'Safer recruitment']
  },
  'bank-staff-agency-staffing': {
    members: [
      { name: 'Owen Clarke', initials: 'OC', role: 'Care Operations Advisor', tone: 'slate' },
      { name: 'Aisha Rahman', initials: 'AR', role: 'Recruitment Consultant', tone: 'green' }
    ],
    chips: ['Operations', 'Rota cover']
  },
  'cqc-inspection-support': {
    members: [
      { name: 'Daniel Cole', initials: 'DC', role: 'QA Lead', tone: 'gold' },
      { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' }
    ],
    chips: ['QA Lead', 'Mock inspection support']
  },
  'websites-technology-systems-support': {
    members: [
      { name: 'Nina Patel', initials: 'NP', role: 'Web Designer', tone: 'blue' },
      { name: 'Leo Hart', initials: 'LH', role: 'Systems Builder', tone: 'slate' }
    ],
    chips: ['Web Team', 'Digital systems']
  },
  'care-compliance-policies-protocols': {
    members: [
      { name: 'Priya Singh', initials: 'PS', role: 'Governance Lead', tone: 'brand' },
      { name: 'Daniel Cole', initials: 'DC', role: 'QA Lead', tone: 'gold' }
    ],
    chips: ['Policies', 'Governance']
  },
  'supported-living-housing-benefit': {
    members: [
      { name: 'Owen Clarke', initials: 'OC', role: 'Operations Advisor', tone: 'slate' },
      { name: 'Priya Singh', initials: 'PS', role: 'Compliance Lead', tone: 'brand' }
    ],
    chips: ['Housing', 'Operating model']
  }
}

export function ServiceSupportMeta({ service }: { service: Service }) {
  const support = serviceTeams[service.slug]

  if (!support) {
    return null
  }

  return (
    <div className='mt-5 border-t border-gray-200 pt-4'>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <p className='text-xs font-semibold tracking-[0.08em] text-gray-500 uppercase'>Care Atlas support team</p>
          <p className='mt-1 text-sm font-medium text-gray-700'>
            {support.members.map(member => member.role).join(' + ')}
          </p>
        </div>
        <AvatarStack members={support.members} size='xs' />
      </div>
      <div className='mt-3 flex flex-wrap gap-2'>
        {support.chips.map(chip => (
          <RoleChip key={chip} label={chip} tone='slate' />
        ))}
      </div>
    </div>
  )
}

export function LaunchTeamCard({ members }: { members: AvatarMember[] }) {
  return (
    <div className='shadow-theme-lg border-brand-100 rounded-lg border bg-white p-4'>
      <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Care Atlas launch team</p>
      <div className='mt-3 flex items-center justify-between gap-4'>
        <AvatarStack members={members} size='sm' />
        <span className='bg-success-50 text-success-700 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold'>
          <SiteIcon name='check' className='h-3.5 w-3.5' />
          Multi-team support
        </span>
      </div>
      <div className='mt-4 flex flex-wrap gap-2'>
        {['Compliance', 'Recruitment', 'Web', 'Operations'].map(label => (
          <RoleChip key={label} label={label} tone='blue' />
        ))}
      </div>
    </div>
  )
}
