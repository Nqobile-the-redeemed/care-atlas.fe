'use client'

export type CareSpecificationGroup = {
  key: string
  label: string
  options: Array<{ value: string; label: string; count: number }>
}

export type CareSpecification = {
  reviewStatus: string
  components?: Array<{ service: string; regulation: string; hourlyRateMinor?: number }>
  eligibilityNotes?: string[]
  evidence?: Array<{ document: string; locator: string; excerpt: string }>
}

export function TenderCareSpecificationSummary({ profile }: { profile?: CareSpecification | null }) {
  if (profile?.reviewStatus !== 'reviewed' || !profile.evidence?.length) return null
  return (
    <section className='mt-5 border-t border-gray-200 pt-5'>
      <h3 className='text-base font-semibold'>Care service requirements</h3>
      <ul className='mt-3 grid gap-2 text-sm'>
        {profile.components?.map(component => (
          <li key={component.service} className='break-words'>
            <strong className='capitalize'>{component.service.replaceAll('_', ' ')}</strong>
            {' - '}
            {component.regulation === 'non_regulated' ? 'Non-regulated support' : 'Regulated care'}
          </li>
        ))}
        {profile.eligibilityNotes?.map(note => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <details className='mt-3 text-sm'>
        <summary className='cursor-pointer py-2 font-semibold'>Supporting documents</summary>
        <ul className='grid gap-3'>
          {profile.evidence.map(item => (
            <li key={item.document + item.locator} className='break-words'>
              <p className='font-medium'>
                {item.document} - {item.locator}
              </p>
              <p className='mt-1'>{item.excerpt}</p>
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

export const CARE_SPECIFICATION_KEYS = ['service_regulation', 'cqc_eligibility', 'support_type'] as const

export function readCareSpecifications(params: { getAll: (key: string) => string[] }) {
  return Object.fromEntries(CARE_SPECIFICATION_KEYS.map(key => [key, params.getAll(key)]))
}

export function TenderCareSpecificationFilters({
  groups,
  selected,
  onToggle
}: {
  groups: CareSpecificationGroup[]
  selected: Record<string, string[]>
  onToggle: (key: string, value: string) => void
}) {
  return (
    <div className='grid min-w-0 gap-3'>
      {groups.map(group => (
        <details key={group.key} className='min-w-0 border-b border-gray-200 pb-3'>
          <summary className='cursor-pointer py-2 text-sm font-semibold'>
            {group.label}
            {(selected[group.key]?.length ?? 0) > 0 && (
              <span className='ml-2 text-xs font-normal'>({selected[group.key].length})</span>
            )}
          </summary>
          <fieldset className='grid gap-1'>
            <legend className='sr-only'>{group.label}</legend>
            {group.options.map(option => (
              <label key={option.value} className='flex min-h-11 cursor-pointer items-center gap-2 text-sm'>
                <input
                  type='checkbox'
                  checked={selected[group.key]?.includes(option.value) ?? false}
                  onChange={() => onToggle(group.key, option.value)}
                  className='h-4 w-4 shrink-0'
                />
                <span className='min-w-0 flex-1 break-words'>{option.label}</span>
                <span className='shrink-0 text-xs tabular-nums'>{option.count}</span>
              </label>
            ))}
          </fieldset>
        </details>
      ))}
    </div>
  )
}
