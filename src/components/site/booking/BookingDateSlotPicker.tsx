'use client'

import { useEffect, useMemo, useState } from 'react'

import type { BookingSlot } from '@/lib/api/bookings'

type BookingDateSlotPickerProps = {
  slots: BookingSlot[]
  slotGroups: Record<string, BookingSlot[]>
  selectedSlot: BookingSlot | null
  loading?: boolean
  onSelectSlot: (slot: BookingSlot) => void
  onClearSlot: () => void
}

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function parseDateKey(value: string) {
  return new Date(`${value}T12:00:00`)
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(date)
}

function dayLabel(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  }).format(parseDateKey(value))
}

function slotDurationLabel(slot: BookingSlot) {
  const start = new Date(slot.startAt).getTime()
  const end = new Date(slot.endAt).getTime()
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null

  return `${Math.round((end - start) / 60000)} min`
}

function buildMonthDays(monthDate: Date) {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const lastOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const days: Array<{ key: string; inMonth: boolean }> = []

  for (let index = 0; index < startOffset; index += 1) {
    const date = new Date(firstOfMonth)
    date.setDate(firstOfMonth.getDate() - (startOffset - index))
    days.push({ key: dateKey(date), inMonth: false })
  }

  for (let day = 1; day <= lastOfMonth.getDate(); day += 1) {
    days.push({ key: dateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)), inMonth: true })
  }

  while (days.length % 7 !== 0) {
    const date = parseDateKey(days[days.length - 1].key)
    date.setDate(date.getDate() + 1)
    days.push({ key: dateKey(date), inMonth: false })
  }

  return days
}

export function BookingDateSlotPicker({
  slots,
  slotGroups,
  selectedSlot,
  loading = false,
  onSelectSlot,
  onClearSlot
}: BookingDateSlotPickerProps) {
  const availableDates = useMemo(() => Object.keys(slotGroups).sort(), [slotGroups])
  const [selectedDate, setSelectedDate] = useState('')
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const firstSlotDate = availableDates[0]
    return firstSlotDate ? parseDateKey(firstSlotDate) : new Date()
  })

  useEffect(() => {
    if (availableDates.length === 0) {
      setSelectedDate('')
      return
    }

    setSelectedDate(current => (current && availableDates.includes(current) ? current : availableDates[0]))
    setVisibleMonth(current => {
      const currentKey = dateKey(current)
      const hasCurrentMonthSlot = availableDates.some(date => date.startsWith(currentKey.slice(0, 7)))
      return hasCurrentMonthSlot ? current : parseDateKey(availableDates[0])
    })
  }, [availableDates])

  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth])
  const visibleSlots = selectedDate ? (slotGroups[selectedDate] ?? []) : []
  const firstAvailableMonth = availableDates[0]?.slice(0, 7)
  const lastAvailableMonth = availableDates[availableDates.length - 1]?.slice(0, 7)
  const currentMonth = dateKey(visibleMonth).slice(0, 7)
  const canGoPrevious = Boolean(firstAvailableMonth && currentMonth > firstAvailableMonth)
  const canGoNext = Boolean(lastAvailableMonth && currentMonth < lastAvailableMonth)

  function changeMonth(offset: number) {
    setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1))
  }

  function selectDate(date: string) {
    setSelectedDate(date)
    if (selectedSlot?.date !== date) onClearSlot()
  }

  if (loading) {
    return <p className='rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600'>Loading slots...</p>
  }

  if (slots.length === 0) {
    return (
      <p className='rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600'>
        No live slots are available right now.
      </p>
    )
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-3'>
      <div className='flex items-center justify-between gap-2'>
        <button
          type='button'
          onClick={() => changeMonth(-1)}
          disabled={!canGoPrevious}
          aria-label='Previous booking month'
          className='h-9 w-9 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
        >
          &lt;
        </button>
        <p className='text-sm font-semibold text-gray-900'>{monthLabel(visibleMonth)}</p>
        <button
          type='button'
          onClick={() => changeMonth(1)}
          disabled={!canGoNext}
          aria-label='Next booking month'
          className='h-9 w-9 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
        >
          &gt;
        </button>
      </div>

      <div className='mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-gray-500'>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className='mt-2 grid grid-cols-7 gap-1'>
        {monthDays.map(day => {
          const daySlots = slotGroups[day.key] ?? []
          const isAvailable = daySlots.length > 0
          const isSelected = selectedDate === day.key

          return (
            <button
              key={day.key}
              type='button'
              disabled={!day.inMonth || !isAvailable}
              onClick={() => selectDate(day.key)}
              aria-pressed={isSelected}
              aria-label={`${dayLabel(day.key)}${isAvailable ? `, ${daySlots.length} slots available` : ', no slots available'}`}
              className={`aspect-square rounded-lg border text-sm font-semibold transition focus:ring-4 focus:outline-hidden ${
                isSelected
                  ? 'border-brand-600 bg-brand-600 text-white focus:ring-brand-500/20'
                  : isAvailable
                    ? 'border-brand-200 bg-brand-50 text-brand-800 hover:border-brand-400 focus:ring-brand-500/10'
                    : day.inMonth
                      ? 'border-gray-100 bg-gray-50 text-gray-300'
                      : 'border-transparent bg-transparent text-transparent'
              }`}
            >
              {Number(day.key.slice(-2))}
            </button>
          )
        })}
      </div>

      <div className='mt-4'>
        <div className='mb-2 flex items-center justify-between gap-3'>
          <p className='text-xs font-semibold uppercase text-gray-500'>
            {selectedDate ? dayLabel(selectedDate) : 'Choose a date'}
          </p>
          <span className='text-xs font-medium text-gray-500'>{visibleSlots.length} slots</span>
        </div>
        {visibleSlots.length === 0 ? (
          <p className='rounded-lg bg-gray-50 p-3 text-sm text-gray-600'>No slots are available on this date.</p>
        ) : (
          <div className='grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3'>
            {visibleSlots.map(slot => {
              const slotKey = `${slot.startAt}-${slot.consultantUserId ?? 'any'}`
              const active =
                selectedSlot?.startAt === slot.startAt && selectedSlot?.consultantUserId === slot.consultantUserId
              const duration = slotDurationLabel(slot)

              return (
                <button
                  key={slotKey}
                  type='button'
                  onClick={() => onSelectSlot(slot)}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold transition focus:ring-4 focus:outline-hidden ${
                    active
                      ? 'border-brand-600 bg-brand-600 focus:ring-brand-500/20 text-white'
                      : 'border-brand-200 text-brand-800 hover:border-brand-400 hover:bg-brand-50 focus:ring-brand-500/10 bg-white'
                  }`}
                >
                  {slot.label}
                  <span className='block text-[10px] font-normal'>
                    {[duration, slot.consultant?.name].filter(Boolean).join(' / ')}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
