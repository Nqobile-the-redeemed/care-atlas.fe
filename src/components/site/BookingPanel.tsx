'use client'

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  BookingEventType,
  BookingSlot,
  createPublicBooking,
  getBookingAvailability,
  getBookingEventTypes
} from '@/lib/api/bookings'
import { SiteIcon } from './SiteIcon'
import { RegionCountiesFormSection } from './standalone-inputs'

type BookingStatus = 'idle' | 'loading' | 'submitting' | 'success' | 'error'

function fieldClass(hasError = false) {
  return `w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 shadow-theme-xs placeholder:text-gray-400 focus:ring-4 focus:outline-hidden ${
    hasError
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500/10'
      : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10'
  }`
}

function formatSlotDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(new Date(`${date}T12:00:00`))
}

function groupSlots(slots: BookingSlot[]) {
  return slots.reduce<Record<string, BookingSlot[]>>((groups, slot) => {
    groups[slot.date] = [...(groups[slot.date] ?? []), slot]
    return groups
  }, {})
}

export function BookingPanel() {
  const [eventTypes, setEventTypes] = useState<BookingEventType[]>([])
  const [selectedEventSlug, setSelectedEventSlug] = useState('')
  const [slots, setSlots] = useState<BookingSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [status, setStatus] = useState<BookingStatus>('loading')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [regions, setRegions] = useState<string[]>([])
  const [counties, setCounties] = useState<string[]>([])
  const formStartedAt = useRef(Math.floor(Date.now() / 1000))
  const slotGroups = useMemo(() => groupSlots(slots), [slots])
  const selectedEventType = eventTypes.find(eventType => eventType.slug === selectedEventSlug)

  useEffect(() => {
    let alive = true

    async function loadEventTypes() {
      try {
        setStatus('loading')
        const response = await getBookingEventTypes()
        if (!alive) return
        setEventTypes(response.data)
        setSelectedEventSlug(response.data[0]?.slug ?? '')
        setStatus('idle')
      } catch (error) {
        if (!alive) return
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Booking options could not be loaded.')
      }
    }

    loadEventTypes()

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!selectedEventSlug) return

    let alive = true

    async function loadAvailability() {
      try {
        setSelectedSlot(null)
        const response = await getBookingAvailability({
          eventTypeSlug: selectedEventSlug,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London'
        })
        if (!alive) return
        setSlots(response.data.slots)
      } catch (error) {
        if (!alive) return
        setSlots([])
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Availability could not be loaded.')
      }
    }

    loadAvailability()

    return () => {
      alive = false
    }
  }, [selectedEventSlug])

  function validate(formData: FormData) {
    const nextErrors: Record<string, string> = {}

    ;['name', 'email', 'phone'].forEach(field => {
      if (!String(formData.get(field) ?? '').trim()) {
        nextErrors[field] = 'This field is required.'
      }
    })

    const email = String(formData.get('email') ?? '').trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    const password = String(formData.get('password') ?? '')
    const passwordConfirmation = String(formData.get('passwordConfirmation') ?? '')
    if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }
    if (!passwordConfirmation) {
      nextErrors.passwordConfirmation = 'Confirm your password.'
    } else if (password && password !== passwordConfirmation) {
      nextErrors.passwordConfirmation = 'Passwords do not match.'
    }

    if (!selectedSlot) {
      nextErrors.slot = 'Choose a consultation time.'
    }

    if (!formData.get('consent')) {
      nextErrors.consent = 'Please confirm Care Atlas can contact you about this booking.'
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const nextErrors = validate(formData)

    setErrors(nextErrors)
    setMessage('')

    if (Object.keys(nextErrors).length > 0 || !selectedSlot) return

    try {
      setStatus('submitting')
      const response = await createPublicBooking({
        eventTypeSlug: selectedEventSlug,
        startAt: selectedSlot.startAt,
        endAt: selectedSlot.endAt,
        timezone: selectedSlot.timezone,
        customer: {
          name: String(formData.get('name') ?? '').trim(),
          email: String(formData.get('email') ?? '').trim(),
          phone: String(formData.get('phone') ?? '').trim(),
          companyName: String(formData.get('companyName') ?? '').trim(),
          password: String(formData.get('password') ?? ''),
          passwordConfirmation: String(formData.get('passwordConfirmation') ?? '')
        },
        intake: {
          serviceInterest: selectedEventType?.name,
          currentStage: String(formData.get('currentStage') ?? '').trim(),
          message: String(formData.get('bookingMessage') ?? '').trim(),
          regions,
          counties
        },
        consent: true,
        formStartedAt: formStartedAt.current,
        sourceUrl: window.location.href,
        website: String(formData.get('website') ?? '')
      })

      setStatus('success')
      setMessage(
        response.data.googleMeetUrl
          ? `Booking confirmed. Your reference is ${response.data.bookingReference}.`
          : `Booking received. Your reference is ${response.data.bookingReference}; we will confirm the Meet link shortly.`
      )
      setSelectedSlot(null)
      form.reset()
      setRegions([])
      setCounties([])
      formStartedAt.current = Math.floor(Date.now() / 1000)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'The booking could not be confirmed.')
    }
  }

  return (
    <div id='booking' className='border-brand-100 bg-brand-25 shadow-theme-sm rounded-lg border p-6'>
      <div className='flex items-start gap-4'>
        <span className='bg-brand-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white'>
          <SiteIcon name='calendar' className='h-5 w-5' />
        </span>
        <div>
          <h2 className='text-2xl font-semibold text-gray-950'>Book a Care Atlas consultation</h2>
          <p className='mt-2 text-sm leading-6 text-gray-600'>
            Pick a consultation type and a live slot. We will create the calendar booking and send the confirmation by
            email.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`mt-5 rounded-lg border p-4 text-sm leading-6 ${
            status === 'success'
              ? 'border-success-200 bg-success-50 text-success-800'
              : 'border-error-200 bg-error-50 text-error-700'
          }`}
          role='status'
        >
          {message}
        </div>
      )}

      <form className='mt-6 grid gap-5' noValidate onSubmit={handleSubmit}>
        <input type='text' name='website' tabIndex={-1} autoComplete='off' aria-hidden='true' className='hidden' />

        <div>
          <label htmlFor='eventType' className='mb-1.5 block text-sm font-semibold text-gray-800'>
            Consultation type
          </label>
          <select
            id='eventType'
            value={selectedEventSlug}
            onChange={event => setSelectedEventSlug(event.target.value)}
            className={fieldClass()}
            disabled={status === 'loading' || eventTypes.length === 0}
          >
            {eventTypes.map(eventType => (
              <option key={eventType.id} value={eventType.slug}>
                {eventType.name} - {eventType.durationMinutes} min
              </option>
            ))}
          </select>
          {selectedEventType?.description && (
            <p className='mt-2 text-xs leading-5 text-gray-500'>{selectedEventType.description}</p>
          )}
        </div>

        <div>
          <div className='mb-2 flex items-center justify-between gap-3'>
            <label className='block text-sm font-semibold text-gray-800'>Available times</label>
            <span className='text-xs font-medium text-gray-500'>{slots.length} slots</span>
          </div>
          {status === 'loading' ? (
            <div className='rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600'>Loading slots...</div>
          ) : slots.length === 0 ? (
            <div className='rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600'>
              No slots are available right now. Please send an enquiry and we will arrange a time.
            </div>
          ) : (
            <div className='max-h-72 space-y-4 overflow-y-auto pr-1'>
              {Object.entries(slotGroups).map(([date, daySlots]) => (
                <div key={date}>
                  <p className='mb-2 text-xs font-semibold text-gray-500 uppercase'>{formatSlotDate(date)}</p>
                  <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                    {daySlots.map(slot => {
                      const active = selectedSlot?.startAt === slot.startAt
                      return (
                        <button
                          key={slot.startAt}
                          type='button'
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition focus:ring-4 focus:outline-hidden ${
                            active
                              ? 'border-brand-600 bg-brand-600 focus:ring-brand-500/20 text-white'
                              : 'border-brand-200 text-brand-800 hover:border-brand-400 hover:bg-brand-50 focus:ring-brand-500/10 bg-white'
                          }`}
                        >
                          {slot.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.slot && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.slot}</p>}
        </div>

        <div className='grid gap-5 md:grid-cols-2'>
          <div>
            <label htmlFor='name' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Full name *
            </label>
            <input id='name' name='name' className={fieldClass(Boolean(errors.name))} placeholder='Your name' />
            {errors.name && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor='email' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Email address *
            </label>
            <input
              id='email'
              name='email'
              type='email'
              className={fieldClass(Boolean(errors.email))}
              placeholder='you@example.co.uk'
            />
            {errors.email && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor='phone' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Phone number *
            </label>
            <input
              id='phone'
              name='phone'
              type='tel'
              className={fieldClass(Boolean(errors.phone))}
              placeholder='Best number to reach you'
            />
            {errors.phone && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor='companyName' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Organisation
            </label>
            <input
              id='companyName'
              name='companyName'
              className={fieldClass()}
              placeholder='Company or provider name'
            />
          </div>
          <div className='md:col-span-2'>
            <label htmlFor='currentStage' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Current stage
            </label>
            <select id='currentStage' name='currentStage' className={fieldClass()} defaultValue=''>
              <option value='' disabled>
                Select an option
              </option>
              <option>Exploring options</option>
              <option>Preparing documents</option>
              <option>Ready to launch</option>
              <option>Need urgent support</option>
            </select>
          </div>
        </div>

        <RegionCountiesFormSection
          id='booking'
          selectedRegions={regions}
          selectedCounties={counties}
          onRegionsChange={setRegions}
          onCountiesChange={setCounties}
        />

        <div className='grid gap-5 md:grid-cols-2'>
          <div className='md:col-span-2'>
            <label htmlFor='bookingMessage' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Notes for the meeting
            </label>
            <textarea
              id='bookingMessage'
              name='bookingMessage'
              rows={4}
              className={fieldClass()}
              placeholder='Add anything useful before the call.'
            />
          </div>
          <div>
            <label htmlFor='booking-password' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Password *
            </label>
            <input
              id='booking-password'
              name='password'
              type='password'
              autoComplete='new-password'
              className={fieldClass(Boolean(errors.password))}
              placeholder='At least 8 characters'
            />
            {errors.password && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.password}</p>}
          </div>
          <div>
            <label htmlFor='booking-password-confirmation' className='mb-1.5 block text-sm font-semibold text-gray-800'>
              Confirm password *
            </label>
            <input
              id='booking-password-confirmation'
              name='passwordConfirmation'
              type='password'
              autoComplete='new-password'
              className={fieldClass(Boolean(errors.passwordConfirmation))}
              placeholder='Re-enter your password'
            />
            {errors.passwordConfirmation && (
              <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.passwordConfirmation}</p>
            )}
          </div>
        </div>

        <div>
          <label className='flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm leading-6 text-gray-700'>
            <input
              type='checkbox'
              name='consent'
              className='text-brand-600 focus:ring-brand-500 mt-1 h-4 w-4 rounded border-gray-300'
              aria-invalid={Boolean(errors.consent)}
            />
            <span>Care Atlas can contact me about this booking and related support.</span>
          </label>
          {errors.consent && <p className='text-error-600 mt-1.5 text-xs font-medium'>{errors.consent}</p>}
        </div>

        <button
          type='submit'
          disabled={status === 'submitting' || !selectedEventSlug}
          className='bg-brand-600 shadow-theme-xs hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition focus:ring-4 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-60'
        >
          <SiteIcon name='check' className='h-4 w-4' />
          {status === 'submitting' ? 'Booking...' : 'Confirm booking'}
        </button>
      </form>
    </div>
  )
}
