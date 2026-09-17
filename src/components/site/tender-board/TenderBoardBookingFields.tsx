'use client'

import type { BookingEventType, BookingSlot } from '@/lib/api/bookings'

import { StandaloneDropDown } from '../standalone-inputs'
import { BookingDateSlotPicker } from '../booking/BookingDateSlotPicker'

type TenderBoardBookingFieldsProps = {
  bookingOptionsLoading: boolean
  eventTypes: BookingEventType[]
  selectedEventSlug: string
  selectedEventType?: BookingEventType
  slots: BookingSlot[]
  slotGroups: Record<string, BookingSlot[]>
  selectedSlot: BookingSlot | null
  onEventTypeChange: (slug: string) => void
  onSelectSlot: (slot: BookingSlot | null) => void
}

export function TenderBoardBookingFields({
  bookingOptionsLoading,
  eventTypes,
  selectedEventSlug,
  selectedEventType,
  slots,
  slotGroups,
  selectedSlot,
  onEventTypeChange,
  onSelectSlot
}: TenderBoardBookingFieldsProps) {
  const eventTypeOptions = eventTypes.map(eventType => ({
    code: eventType.slug,
    value: eventType.slug,
    name: `${eventType.name} - ${eventType.durationMinutes} min`
  }))

  return (
    <div className='space-y-3 sm:col-span-2 lg:col-span-1'>
      <StandaloneDropDown
        name='bookingEventType'
        label='Consultation type'
        value={selectedEventSlug}
        onChange={onEventTypeChange}
        options={eventTypeOptions}
        placeholder={eventTypes.length === 0 ? 'Loading consultation types...' : 'Choose consultation type'}
        disabled={bookingOptionsLoading || eventTypes.length === 0}
      />
      {selectedEventType?.description && (
        <p className='text-xs leading-5 text-gray-500'>{selectedEventType.description}</p>
      )}
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-3'>
        <div className='mb-2 flex items-center justify-between gap-3'>
          <p className='text-sm font-semibold text-gray-800'>Available times</p>
          <span className='text-xs font-medium text-gray-500'>{slots.length} slots</span>
        </div>
        <BookingDateSlotPicker
          slots={slots}
          slotGroups={slotGroups}
          selectedSlot={selectedSlot}
          loading={bookingOptionsLoading}
          onSelectSlot={onSelectSlot}
          onClearSlot={() => onSelectSlot(null)}
        />
      </div>
    </div>
  )
}
