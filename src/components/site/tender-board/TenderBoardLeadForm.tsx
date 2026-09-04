'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { BookingEventType, BookingSlot } from '@/lib/api/bookings'
import type { TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'

import { inputClass } from './constants'
import { TenderBoardBookingFields } from './TenderBoardBookingFields'
import type { TenderBoardForm, TenderBoardSelectedTender } from './types'

type TenderBoardLeadFormProps = {
  selectedTender: TenderBoardSelectedTender | null
  leadKind: TenderLeadKind
  setLeadKind: Dispatch<SetStateAction<TenderLeadKind>>
  form: TenderBoardForm
  setForm: Dispatch<SetStateAction<TenderBoardForm>>
  selectedEventSlug: string
  setSelectedEventSlug: Dispatch<SetStateAction<string>>
  eventTypes: BookingEventType[]
  selectedEventType?: BookingEventType
  slots: BookingSlot[]
  slotGroups: Record<string, BookingSlot[]>
  selectedSlot: BookingSlot | null
  setSelectedSlot: Dispatch<SetStateAction<BookingSlot | null>>
  bookingOptionsLoading: boolean
  notice: string
  error: string
  handoffUrl: string | null
  submitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function TenderBoardLeadForm({
  selectedTender,
  leadKind,
  setLeadKind,
  form,
  setForm,
  selectedEventSlug,
  setSelectedEventSlug,
  eventTypes,
  selectedEventType,
  slots,
  slotGroups,
  selectedSlot,
  setSelectedSlot,
  bookingOptionsLoading,
  notice,
  error,
  handoffUrl,
  submitting,
  onSubmit
}: TenderBoardLeadFormProps) {
  return (
    <>
      <div className='mt-5 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1'>
        {(['enquiry', 'booking'] as TenderLeadKind[]).map(kind => (
          <button
            key={kind}
            type='button'
            onClick={() => setLeadKind(kind)}
            className={`min-h-10 rounded-md text-sm font-semibold capitalize ${
              leadKind === kind ? 'shadow-theme-xs bg-white text-gray-950' : 'text-gray-600 hover:text-gray-950'
            }`}
          >
            {kind}
          </button>
        ))}
      </div>

      <form className='mt-5 space-y-3' onSubmit={onSubmit}>
        <input
          className='hidden'
          tabIndex={-1}
          autoComplete='off'
          value={form.website}
          onChange={event => setForm(current => ({ ...current, website: event.target.value }))}
        />
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-1'>
          <input
            required
            value={form.name}
            onChange={event => setForm(current => ({ ...current, name: event.target.value }))}
            placeholder='Full name'
            className={inputClass}
          />
          <input
            required
            type='email'
            value={form.email}
            onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
            placeholder='Email'
            className={inputClass}
          />
          <input
            required
            value={form.phone}
            onChange={event => setForm(current => ({ ...current, phone: event.target.value }))}
            placeholder='Phone'
            className={inputClass}
          />
          <input
            value={form.whatsapp}
            onChange={event => setForm(current => ({ ...current, whatsapp: event.target.value }))}
            placeholder='WhatsApp number'
            className={inputClass}
          />
          <select
            value={form.preferredContactMethod}
            onChange={event =>
              setForm(current => ({
                ...current,
                preferredContactMethod: event.target.value as TenderBoardForm['preferredContactMethod']
              }))
            }
            aria-label='Preferred contact method'
            className={inputClass}
          >
            <option value='email'>Prefer email</option>
            <option value='phone'>Prefer phone</option>
            <option value='whatsapp'>Prefer WhatsApp</option>
          </select>
          {leadKind === 'booking' && (
            <TenderBoardBookingFields
              bookingOptionsLoading={bookingOptionsLoading}
              eventTypes={eventTypes}
              selectedEventSlug={selectedEventSlug}
              selectedEventType={selectedEventType}
              slots={slots}
              slotGroups={slotGroups}
              selectedSlot={selectedSlot}
              onEventTypeChange={setSelectedEventSlug}
              onSelectSlot={setSelectedSlot}
            />
          )}
          <input
            value={form.company}
            onChange={event => setForm(current => ({ ...current, company: event.target.value }))}
            placeholder='Company or provider name'
            className={inputClass}
          />
        </div>
        <textarea
          required
          minLength={10}
          value={form.message}
          onChange={event => setForm(current => ({ ...current, message: event.target.value }))}
          placeholder='Tell us what you need help with'
          rows={5}
          className={`${inputClass} w-full py-3`}
        />
        <label className='flex gap-3 text-sm leading-6 text-gray-600'>
          <input
            required
            type='checkbox'
            checked={form.consent}
            onChange={event => setForm(current => ({ ...current, consent: event.target.checked }))}
            className='mt-1 h-4 w-4 rounded border-gray-300'
          />
          I agree for Care Atlas to contact me about this tender and related opportunities.
        </label>
        {notice && (
          <div className='border-success-200 bg-success-50 text-success-800 rounded-lg border p-3 text-sm'>
            <p className='font-semibold'>{notice}</p>
            {handoffUrl && (
              <div className='mt-3'>
                <a
                  href={handoffUrl}
                  className='bg-brand-600 hover:bg-brand-700 inline-flex min-h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-white'
                >
                  Continue to Orbit Mirai
                </a>
              </div>
            )}
          </div>
        )}
        {error && <p className='bg-error-50 text-error-700 rounded-lg p-3 text-sm font-medium'>{error}</p>}
        <button
          type='submit'
          disabled={submitting || !selectedTender}
          className='bg-brand-600 hover:bg-brand-700 focus:ring-brand-500/20 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold text-white focus:ring-4 focus:outline-hidden disabled:opacity-50'
        >
          <SiteIcon name={leadKind === 'booking' ? 'calendar' : 'mail'} className='h-4 w-4' />
          {submitting ? 'Sending...' : leadKind === 'booking' ? 'Book meeting' : 'Send enquiry'}
        </button>
      </form>
    </>
  )
}
