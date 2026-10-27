export interface StandalonePaymentSummaryItem {
  label: string
  value: string
}

interface StandalonePaymentSummaryProps {
  items: StandalonePaymentSummaryItem[]
  totalLabel?: string
  totalValue: string
  note?: string
}

export function StandalonePaymentSummary({
  items,
  totalLabel = 'Total',
  totalValue,
  note
}: StandalonePaymentSummaryProps) {
  return (
    <section
      aria-label='Payment summary'
      className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70'
    >
      <dl className='space-y-3'>
        {items.map(item => (
          <div key={`${item.label}-${item.value}`} className='flex items-start justify-between gap-4 text-sm'>
            <dt className='text-slate-600 dark:text-slate-300'>{item.label}</dt>
            <dd className='text-right font-medium text-slate-900 dark:text-slate-100'>{item.value}</dd>
          </div>
        ))}
        <div className='flex items-start justify-between gap-4 border-t border-slate-200 pt-3 dark:border-slate-700'>
          <dt className='font-semibold text-slate-700 dark:text-slate-200'>{totalLabel}</dt>
          <dd className='text-right font-semibold text-slate-950 dark:text-white'>{totalValue}</dd>
        </div>
      </dl>
      {note ? <p className='mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400'>{note}</p> : null}
    </section>
  )
}
