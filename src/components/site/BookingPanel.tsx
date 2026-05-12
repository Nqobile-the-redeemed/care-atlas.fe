import { SiteIcon } from './SiteIcon'

const slots = ['Tuesday 10:00', 'Wednesday 14:30', 'Friday 09:30']

export function BookingPanel() {
  return (
    <div id='booking' className='border-brand-100 bg-brand-25 shadow-theme-sm rounded-lg border p-6'>
      <div className='flex items-start gap-4'>
        <span className='bg-brand-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white'>
          <SiteIcon name='calendar' className='h-5 w-5' />
        </span>
        <div>
          <h2 className='text-2xl font-semibold text-gray-950'>Booking slot placeholder</h2>
          <p className='mt-2 text-sm leading-6 text-gray-600'>
            This module is ready for a calendar integration such as Calendly, Google Calendar, Outlook, CRM scheduling
            or a custom booking engine.
          </p>
        </div>
      </div>
      <div className='mt-5 grid gap-3 sm:grid-cols-3'>
        {slots.map(slot => (
          <button
            key={slot}
            type='button'
            className='border-brand-200 text-brand-800 shadow-theme-xs hover:border-brand-400 hover:bg-brand-50 focus:ring-brand-500/10 rounded-lg border bg-white px-4 py-3 text-left text-sm font-semibold transition focus:ring-4 focus:outline-hidden'
          >
            {slot}
            <span className='mt-1 block text-xs font-medium text-gray-500'>Sample consultation slot</span>
          </button>
        ))}
      </div>
    </div>
  )
}
