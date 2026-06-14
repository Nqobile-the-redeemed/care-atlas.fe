import Link from 'next/link'
import type { JobRole } from '@/data/careers'
import { ButtonLink } from './ui'

export function JobRoleCard({ role }: { role: JobRole }) {
  return (
    <article className='shadow-theme-xs flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>{role.type}</p>
          <h2 className='mt-3 text-xl font-semibold text-gray-950'>{role.title}</h2>
          <p className='text-brand-700 mt-2 text-sm font-medium'>{role.location}</p>
        </div>
        <span className='bg-brand-50 text-brand-700 rounded-full px-3 py-1 text-xs font-semibold'>{role.team}</span>
      </div>

      <p className='mt-4 flex-1 text-sm leading-6 text-gray-600'>{role.summary}</p>

      <div className='mt-5 flex flex-wrap gap-2'>
        {role.tags.map(tag => (
          <span key={tag} className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700'>
            {tag}
          </span>
        ))}
      </div>

      <div className='mt-6 grid gap-3 sm:grid-cols-2'>
        <ButtonLink href={`/careers/${role.slug}`} variant='secondary' className='w-full'>
          View role
        </ButtonLink>
        <ButtonLink href={`/careers/${role.slug}#register-interest`} variant='primary' className='w-full'>
          {role.ctaLabel}
        </ButtonLink>
      </div>

      <Link href='/careers' className='text-brand-700 hover:text-brand-800 mt-4 text-sm font-semibold'>
        Careers overview
      </Link>
    </article>
  )
}
