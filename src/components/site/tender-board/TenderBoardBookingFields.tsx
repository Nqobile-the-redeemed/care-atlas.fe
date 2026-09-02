'use client'

import type { BookingEventType, BookingSlot } from '@/lib/api/bookings'

import { inputClass } from './constants'
import { formatSlotDate } from './utils'

type TenderBoardBookingFieldsProps = {
  bookingOptionsLoading: boolean
  eventTypes: BookingEventType[]
  selectedEventSlug: string
  selectedEventType?: BookingEventType
  slots: BookingSlot[]
  slotGroups: Record<string, BookingSlot[]>
  selectedSlot: BookingSlot | null
  onEventTypeChange: (slug: string) => void
  onSelectSlot: (slot: BookingSlot) => void
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
  return (
    <div className='space-y-3 sm:col-span-2 lg:col-span-1'>
      <select
        value={selectedEventSlug}
        onChange={event => onEventTypeChange(event.target.value)}
        aria-label='Consultation type'
        className={`${inputClass} w-full`}
        disabled={bookingOptionsLoading || eventTypes.length === 0}
      >
        {eventTypes.length === 0 ? (
          <option value=''>Loading consultation types...</option>
        ) : (
          eventTypes.map(eventType => (
            <option key={eventType.id} value={eventType.slug}>
              {eventType.name} - {eventType.durationMinutes} min
            </option>
          ))
        )}
      </select>
      {selectedEventType?.description && (
        <p className='text-xs leading-5 text-gray-500'>{selectedEventType.description}</p>
      )}
      <div className='rounded-lg border border-gray-200 bg-gray-50 p-3'>
        <div className='mb-2 flex items-center justify-between gap-3'>
          <p className='text-sm font-semibold text-gray-800'>Available times</p>
          <span className='text-xs font-medium text-gray-500'>{slots.length} slots</span>
        </div>
        {bookingOptionsLoading ? (
          <p className='text-sm text-gray-600'>Loading slots...</p>
        ) : slots.length === 0 ? (
          <p className='text-sm text-gray-600'>No live slots are available right now.</p>
        ) : (
          <div className='max-h-64 space-y-4 overflow-y-auto pr-1'>
            {Object.entries(slotGroups).map(([date, daySlots]) => (
              <div key={date}>
                <p className='mb-2 text-xs font-semibold text-gray-500 uppercase'>{formatSlotDate(date)}</p>
                <div className='grid grid-cols-2 gap-2'>
                  {daySlots.map(slot => {
                    const active = selectedSlot?.startAt === slot.startAt

                    return (
                      <button
                        key={slot.startAt}
                        type='button'
                        onClick={() => onSelectSlot(slot)}
                        className={`min-h-9 rounded-lg border px-3 py-2 text-sm font-semibold transition focus:ring-4 focus:outline-hidden ${
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
      </div>
    </div>
  )
}
