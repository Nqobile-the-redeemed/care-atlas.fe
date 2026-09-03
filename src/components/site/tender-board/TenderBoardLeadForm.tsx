'use client'

import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { FormikProps } from 'formik'
import type { BookingEventType, BookingSlot } from '@/lib/api/bookings'
import type { TenderLeadKind } from '@/lib/api/tenders'

import { SiteIcon } from '../SiteIcon'
import {
  RegionCountiesFormSection,
  StandaloneTextInput,
  StandaloneEmailInput,
  StandaloneTextArea,
  StandaloneDropDown
} from '../standalone-inputs'

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
  submitting: boolean
  onSubmit: (values: TenderBoardForm) => void
  selectedRegions: string[]
  setSelectedRegions: Dispatch<SetStateAction<string[]>>
  selectedCounties: string[]
  setSelectedCounties: Dispatch<SetStateAction<string[]>>
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
  submitting,
  onSubmit,
  selectedRegions,
  setSelectedRegions,
  setSelectedCounties,
  selectedCounties
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
            placeholder='Company'
            value={formik.values.company}
            onChange={value => formik.setFieldValue('company', value)}
            error={fieldError(formik, 'company')}
            autoComplete='organization'
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
        <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-1'>
          <StandaloneTextInput
            name='line1'
            label='Address line 1'
            required
            placeholder='Address line 1'
            value={formik.values.line1}
            onChange={value => formik.setFieldValue('line1', value)}
            error={fieldError(formik, 'line1')}
            autoComplete='address-line1'
          />
          <StandaloneTextInput
            name='line2'
            label='Address line 2'
            placeholder='Address line 2'
            value={formik.values.line2}
            onChange={value => formik.setFieldValue('line2', value)}
            error={fieldError(formik, 'line2')}
            autoComplete='address-line2'
          />
          <StandaloneTextInput
            name='city'
            label='Town or city'
            required
            placeholder='Town or city'
            value={formik.values.city}
            onChange={value => formik.setFieldValue('city', value)}
            error={fieldError(formik, 'city')}
            autoComplete='address-level2'
          />
          <StandaloneTextInput
            name='county'
            label='County'
            placeholder='County'
            value={formik.values.county}
            onChange={value => formik.setFieldValue('county', value)}
            error={fieldError(formik, 'county')}
            autoComplete='address-level1'
          />
          <StandaloneTextInput
            name='postcode'
            label='Postcode'
            required
            placeholder='Postcode'
            value={formik.values.postcode}
            onChange={value => formik.setFieldValue('postcode', value)}
            error={fieldError(formik, 'postcode')}
            autoComplete='postal-code'
          />
          <StandaloneTextInput
            name='password'
            label='Password'
            placeholder='Password (min 8 chars)'
            type='password'
            value={formik.values.password}
            onChange={value => formik.setFieldValue('password', value)}
            error={fieldError(formik, 'password')}
            autoComplete='new-password'
          />
          <StandaloneTextInput
            name='passwordConfirmation'
            label='Confirm password'
            placeholder='Confirm password'
            type='password'
            value={formik.values.passwordConfirmation}
            onChange={value => formik.setFieldValue('passwordConfirmation', value)}
            error={fieldError(formik, 'passwordConfirmation')}
            autoComplete='new-password'
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
        <StandaloneTextArea
          name='tenderPreferenceNotes'
          label='Tender alert preferences'
          placeholder='Tender alerts or regions you want to hear about'
          rows={3}
          value={formik.values.tenderPreferenceNotes}
          onChange={value => formik.setFieldValue('tenderPreferenceNotes', value)}
          error={fieldError(formik, 'tenderPreferenceNotes')}
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
        {notice && <p className='bg-success-50 text-success-700 rounded-lg p-3 text-sm font-medium'>{notice}</p>}
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
