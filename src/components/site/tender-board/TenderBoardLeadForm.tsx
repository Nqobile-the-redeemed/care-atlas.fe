'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { FormikProps } from 'formik'
import type { BookingEventType, BookingSlot } from '@/lib/api/bookings'
import type { TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'
import { StandaloneTextInput, StandaloneEmailInput, StandaloneTextArea, StandaloneDropDown } from '../standalone-inputs'

import { PREFERRED_CONTACT_OPTIONS } from './tenderLeadFormSchema'
import { TenderBoardBookingFields } from './TenderBoardBookingFields'
import { TenderBoardLeadKindSelector } from './TenderBoardLeadKindSelector'
import { Button } from '../ui'
import type { TenderBoardForm, TenderBoardSelectedTender } from './types'

type TenderBoardLeadFormProps = {
  selectedTender: TenderBoardSelectedTender | null
  leadKind: TenderLeadKind
  setLeadKind: Dispatch<SetStateAction<TenderLeadKind>>
  formik: FormikProps<TenderBoardForm>
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
  onSubmit: (values: TenderBoardForm) => void
}

function fieldError<T extends keyof TenderBoardForm>(
  formik: FormikProps<TenderBoardForm>,
  field: T
): string | undefined {
  return formik.touched[field] ? (formik.errors[field] as string | undefined) : undefined
}

export function TenderBoardLeadForm({
  selectedTender,
  leadKind,
  setLeadKind,
  formik,
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
  const handleSubmit = async (_event: FormEvent<HTMLFormElement>) => {
    _event.preventDefault()
    const touched: Partial<Record<keyof TenderBoardForm, boolean>> = {}
    ;(Object.keys(formik.values) as Array<keyof TenderBoardForm>).forEach(key => {
      touched[key] = true
    })
    formik.setTouched(touched)
    await formik.validateForm()
    await onSubmit(formik.values)
  }

  return (
    <>
      <TenderBoardLeadKindSelector value={leadKind} onChange={setLeadKind} />

      <form className='mt-5 space-y-5' onSubmit={handleSubmit}>
        <input
          className='hidden'
          tabIndex={-1}
          autoComplete='off'
          name='website'
          value={formik.values.website}
          onChange={event => formik.setFieldValue('website', event.target.value)}
        />
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-1'>
          <StandaloneTextInput
            name='name'
            label='Full name'
            required
            placeholder='Full name'
            value={formik.values.name}
            onChange={value => formik.setFieldValue('name', value)}
            error={fieldError(formik, 'name')}
          />
          <StandaloneEmailInput
            name='email'
            label='Email'
            required
            placeholder='Email'
            value={formik.values.email}
            onChange={value => formik.setFieldValue('email', value)}
            error={fieldError(formik, 'email')}
          />
          <StandaloneTextInput
            name='phone'
            label='Phone'
            required
            placeholder='Phone'
            value={formik.values.phone}
            onChange={value => formik.setFieldValue('phone', value)}
            error={fieldError(formik, 'phone')}
            autoComplete='tel'
          />
          <StandaloneTextInput
            name='whatsapp'
            label='WhatsApp'
            placeholder='WhatsApp number'
            value={formik.values.whatsapp}
            onChange={value => formik.setFieldValue('whatsapp', value)}
            error={fieldError(formik, 'whatsapp')}
            autoComplete='tel'
          />
          <StandaloneDropDown
            name='preferredContactMethod'
            label='Preferred contact method'
            value={formik.values.preferredContactMethod}
            onChange={value => formik.setFieldValue('preferredContactMethod', value)}
            options={PREFERRED_CONTACT_OPTIONS}
            placeholder='Choose contact method'
            error={fieldError(formik, 'preferredContactMethod')}
          />
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
          <StandaloneTextInput
            name='company'
            label='Company'
            placeholder='Company or provider name'
            value={formik.values.company}
            onChange={value => formik.setFieldValue('company', value)}
            error={fieldError(formik, 'company')}
            autoComplete='organization'
          />
        </div>
        <StandaloneTextArea
          name='message'
          label='Your message'
          required
          minLength={10}
          placeholder='Tell us what you need help with'
          rows={5}
          value={formik.values.message}
          onChange={value => formik.setFieldValue('message', value)}
          error={fieldError(formik, 'message')}
        />
        <label className='flex gap-3 text-sm leading-6 text-gray-600'>
          <input
            required
            type='checkbox'
            checked={formik.values.consent}
            onChange={event => {
              void formik.setFieldValue('consent', event.target.checked)
            }}
            className='mt-1.5 h-5 w-5 rounded border-gray-300'
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
        <Button
          type='submit'
          disabled={submitting || !selectedTender}
          loading={submitting}
          fullWidth
          leftIcon={<SiteIcon name={leadKind === 'booking' ? 'calendar' : 'mail'} className='h-4 w-4' />}
        >
          {leadKind === 'booking' ? 'Book meeting' : 'Send enquiry'}
        </Button>
      </form>
    </>
  )
}
