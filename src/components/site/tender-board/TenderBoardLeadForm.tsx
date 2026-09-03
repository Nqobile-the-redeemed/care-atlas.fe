'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { BookingEventType, BookingSlot } from '@/lib/api/bookings'
import type { TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'
import { RegionCountiesFormSection } from '../standalone-inputs'

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
  submitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  selectedRegions: string[]
  setSelectedRegions: Dispatch<SetStateAction<string[]>>
  selectedCounties: string[]
  setSelectedCounties: Dispatch<SetStateAction<string[]>>
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
  submitting,
  onSubmit,
  selectedRegions,
  setSelectedRegions,
  selectedCounties,
  setSelectedCounties
}: TenderBoardLeadFormProps) {
  return (
    <>
      <div className='mt-5 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1'>
        {(['enquiry', 'booking'] as TenderLeadKind[]).map(kind => (
          <button
            key={kind}
            type='button'
            onClick={() => setLeadKind(kind)}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold capitalize ${
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
            placeholder='Company'
            className={inputClass}
          />
        </div>
        <RegionCountiesFormSection
          id='tender-board'
          selectedRegions={selectedRegions}
          selectedCounties={selectedCounties}
          onRegionsChange={setSelectedRegions}
          onCountiesChange={setSelectedCounties}
          regionLabel='Preferred operating regions'
          countyLabel='Target counties'
        />
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-1'>
          <input
            required
            value={form.line1}
            onChange={event => setForm(current => ({ ...current, line1: event.target.value }))}
            placeholder='Address line 1'
            className={inputClass}
          />
          <input
            value={form.line2}
            onChange={event => setForm(current => ({ ...current, line2: event.target.value }))}
            placeholder='Address line 2'
            className={inputClass}
          />
          <input
            required
            value={form.city}
            onChange={event => setForm(current => ({ ...current, city: event.target.value }))}
            placeholder='Town or city'
            className={inputClass}
          />
          <input
            value={form.county}
            onChange={event => setForm(current => ({ ...current, county: event.target.value }))}
            placeholder='County'
            className={inputClass}
          />
          <input
            required
            value={form.postcode}
            onChange={event => setForm(current => ({ ...current, postcode: event.target.value }))}
            placeholder='Postcode'
            className={inputClass}
          />
          <input
            value={form.password}
            onChange={event => setForm(current => ({ ...current, password: event.target.value }))}
            placeholder='Password (min 8 chars)'
            type='password'
            autoComplete='new-password'
            className={inputClass}
          />
          <input
            value={form.passwordConfirmation}
            onChange={event => setForm(current => ({ ...current, passwordConfirmation: event.target.value }))}
            placeholder='Confirm password'
            type='password'
            autoComplete='new-password'
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
        <textarea
          value={form.tenderPreferenceNotes}
          onChange={event => setForm(current => ({ ...current, tenderPreferenceNotes: event.target.value }))}
          placeholder='Tender alerts or regions you want to hear about'
          rows={3}
          className={`${inputClass} w-full py-3`}
        />
        <label className='flex gap-3 text-sm leading-6 text-gray-600'>
          <input
            required
            type='checkbox'
            checked={form.consent}
            onChange={event => setForm(current => ({ ...current, consent: event.target.checked }))}
            className='mt-1.5 h-5 w-5 rounded border-gray-300'
          />
          I agree for Care Atlas to contact me about this tender and related opportunities.
        </label>
        {notice && <p className='bg-success-50 text-success-700 rounded-lg p-3 text-sm font-medium'>{notice}</p>}
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
