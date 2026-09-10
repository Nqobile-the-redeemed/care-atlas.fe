import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteIcon } from '@/components/site/SiteIcon'

export const metadata: Metadata = {
  title: 'Client Dashboard | Care Atlas',
  description: 'Care Atlas client dashboard for tender tracking, bookings and enquiries.'
}

const clientModules = [
  {
    title: 'Tender Navigator',
    body: 'Browse current care-sector opportunities and open the tender support workflow.',
    href: '/tenders',
    icon: 'file',
    action: 'Browse tenders'
  },
  {
    title: 'Bookings',
    body: 'Meeting activity will appear here after booking support sessions.',
    href: '/calendar',
    icon: 'calendar',
    action: 'View calendar'
  },
  {
    title: 'Profile',
    body: 'Keep your contact and organisation details ready for tender enquiries.',
    href: '/profile',
    icon: 'users',
    action: 'Review profile'
  }
]

const clientMetrics = [
  ['Saved tenders', 'Not yet available', 'Requires saved-tender activity from the API.'],
  ['Enquiries', 'Not yet available', 'Requires authenticated enquiry history from the API.'],
  ['Bookings', 'Not yet available', 'Requires client booking history from the API.']
]

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <section className='rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'>
        <p className='text-brand-600 text-xs font-semibold tracking-[0.08em] uppercase'>Care Atlas client view</p>
        <h1 className='mt-2 text-2xl font-semibold text-gray-950 dark:text-white'>Tender support workspace</h1>
        <p className='mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400'>
          Use this area to browse care-sector tender opportunities, request support and keep your profile details ready.
          Activity metrics will appear once they are backed by real client records.
        </p>
      </section>

      <section className='grid gap-4 md:grid-cols-3'>
        {clientMetrics.map(([title, value, note]) => (
          <div
            key={title}
            className='rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'
          >
            <p className='text-sm text-gray-500 dark:text-gray-400'>{title}</p>
            <p className='mt-2 text-xl font-semibold text-gray-950 dark:text-white'>{value}</p>
            <p className='mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400'>{note}</p>
          </div>
        ))}
      </section>

      <section className='grid gap-4 lg:grid-cols-3'>
        {clientModules.map(module => (
          <Link
            key={module.title}
            href={module.href}
            className='group hover:border-brand-200 hover:shadow-theme-md focus:ring-brand-500/20 rounded-lg border border-gray-200 bg-white p-5 transition focus:ring-4 focus:outline-hidden dark:border-gray-800 dark:bg-gray-900'
          >
            <span className='bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 flex h-11 w-11 items-center justify-center rounded-lg'>
              <SiteIcon name={module.icon} className='h-5 w-5' />
            </span>
            <h2 className='mt-4 text-lg font-semibold text-gray-950 dark:text-white'>{module.title}</h2>
            <p className='mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400'>{module.body}</p>
            <span className='text-brand-700 dark:text-brand-300 mt-5 inline-flex items-center gap-2 text-sm font-semibold'>
              {module.action}
              <SiteIcon name='arrow' className='h-4 w-4 transition group-hover:translate-x-1' />
            </span>
          </Link>
        ))}
      </section>

      <section className='rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900'>
        <h2 className='text-base font-semibold text-gray-950 dark:text-white'>No unexplained empty tabs</h2>
        <p className='mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400'>
          Modules that do not yet have real client data now show an intentional “not yet available” state instead of
          template charts or blank panels.
        </p>
      </section>
    </div>
  )
}
