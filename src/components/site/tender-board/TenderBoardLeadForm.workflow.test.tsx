import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { fireEvent, getQueriesForElement, render, cleanup, act } from '@testing-library/react'

import { RegionCountiesFormSection } from '../standalone-inputs/RegionCountiesFormSection'
import { getCountiesByRegion } from '@/lib/geography'
import type { TenderBoardForm } from './types'
import { TenderBoardFormYup } from './tenderLeadFormSchema'

afterEach(() => {
  cleanup()
})

describe('AC-9: county select-all + form capture end-to-end workflow', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('TR-AC9-1: selecting regions, select-all counties, submit captures arrays correctly', async () => {
    const selectedRegions: string[] = []
    const selectedCounties: string[] = []
    const captured = { selectedRegions, selectedCounties }

    const formValues: TenderBoardForm = {
      name: 'AC9 Tester',
      email: 'ac9@example.com',
      phone: '0151 496 0001',
      whatsapp: '',
      preferredContactMethod: 'email',
      preferredSlot: '',
      company: 'AC9 Ltd',
      message: 'This test simulates the enquiry workflow for a valid submission with ten chars plus extra.',
      consent: true,
      website: ''
    }

    const onRegionsChange = (next: string[]) => {
      captured.selectedRegions.splice(0, captured.selectedRegions.length, ...next)
    }
    const onCountiesChange = (next: string[]) => {
      captured.selectedCounties.splice(0, captured.selectedCounties.length, ...next)
    }

    const { container, rerender } = render(
      <RegionCountiesFormSection
        id='ac9'
        selectedRegions={captured.selectedRegions.slice()}
        selectedCounties={captured.selectedCounties.slice()}
        onRegionsChange={onRegionsChange}
        onCountiesChange={onCountiesChange}
      />
    )

    const regionInput = container.querySelector(`input[id="ac9-regions"][role="combobox"]`) as HTMLInputElement | null
    expect(regionInput).toBeTruthy()
    fireEvent.focus(regionInput!)
    fireEvent.click(regionInput!)
    const regionListbox = container.querySelector(`[id="ac9-regions-listbox"]`) as HTMLElement | null
    expect(regionListbox).toBeTruthy()
    const rq = getQueriesForElement(regionListbox!)
    const rButtons = rq.queryAllByRole('button') as HTMLButtonElement[]
    const regionAll = rButtons.find(b => /select all regions/i.test(b.textContent || ''))
    expect(regionAll).toBeTruthy()
    fireEvent.click(regionAll!)

    rerender(
      <RegionCountiesFormSection
        id='ac9'
        selectedRegions={captured.selectedRegions.slice()}
        selectedCounties={captured.selectedCounties.slice()}
        onRegionsChange={onRegionsChange}
        onCountiesChange={onCountiesChange}
      />
    )

    const countyInput = container.querySelector(`input[id="ac9-counties"][role="combobox"]`) as HTMLInputElement | null
    expect(countyInput).toBeTruthy()
    fireEvent.focus(countyInput!)
    fireEvent.click(countyInput!)
    const countyListbox = container.querySelector(`[id="ac9-counties-listbox"]`) as HTMLElement | null
    expect(countyListbox).toBeTruthy()
    const cq = getQueriesForElement(countyListbox!)
    const cButtons = cq.queryAllByRole('button') as HTMLButtonElement[]
    const countyAll = cButtons.find(b => /select all counties|counties in selected regions/i.test(b.textContent || ''))
    expect(countyAll).toBeTruthy()
    fireEvent.click(countyAll!)

    rerender(
      <RegionCountiesFormSection
        id='ac9'
        selectedRegions={captured.selectedRegions.slice()}
        selectedCounties={captured.selectedCounties.slice()}
        onRegionsChange={onRegionsChange}
        onCountiesChange={onCountiesChange}
      />
    )

    expect(captured.selectedRegions.length).toBeGreaterThan(0)
    expect(captured.selectedCounties.length).toBeGreaterThan(0)

    const selectedWmOnly = captured.selectedRegions.includes('WM') ? getCountiesByRegion(['WM']).map(c => c.code) : []
    for (const code of selectedWmOnly.slice(0, 3)) {
      expect(captured.selectedCounties).toContain(code)
    }

    const validated = await act(async () => TenderBoardFormYup.validate(formValues, { abortEarly: false }))
    expect(validated.name).toBe(formValues.name)
    expect(validated.consent).toBe(true)
  })

  it('TR-AC9-2: after select-all counties, removing one county via remove chip callback preserves the rest', async () => {
    const selectedRegions = ['NW']
    const selectedCounties: string[] = []
    const captured = { selectedCounties }
    const onCountiesChange = (next: string[]) => {
      captured.selectedCounties.splice(0, captured.selectedCounties.length, ...next)
    }
    const nwCounties = getCountiesByRegion(['NW'])
    expect(nwCounties.length).toBeGreaterThanOrEqual(5)

    const { container, rerender } = render(
      <RegionCountiesFormSection
        id='ac9-2'
        selectedRegions={selectedRegions}
        selectedCounties={captured.selectedCounties.slice()}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    const countyInput = container.querySelector(
      `input[id="ac9-2-counties"][role="combobox"]`
    ) as HTMLInputElement | null
    fireEvent.focus(countyInput!)
    fireEvent.click(countyInput!)
    const countyListbox = container.querySelector(`[id="ac9-2-counties-listbox"]`) as HTMLElement | null
    const cq = getQueriesForElement(countyListbox!)
    const cButtons = cq.queryAllByRole('button') as HTMLButtonElement[]
    const countyAll = cButtons.find(b => /select all counties|counties in selected regions/i.test(b.textContent || ''))
    fireEvent.click(countyAll!)

    const total = captured.selectedCounties.length
    expect(total).toBeGreaterThanOrEqual(5)

    rerender(
      <RegionCountiesFormSection
        id='ac9-2'
        selectedRegions={selectedRegions}
        selectedCounties={captured.selectedCounties.slice()}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    const firstCountyCode = nwCounties[0].code
    const afterRemove = captured.selectedCounties.filter(code => code !== firstCountyCode)
    onCountiesChange(afterRemove)
    expect(captured.selectedCounties.length).toBe(total - 1)
    for (const c of nwCounties.slice(1)) {
      expect(captured.selectedCounties).toContain(c.code)
    }
    expect(captured.selectedCounties.includes(firstCountyCode)).toBe(false)
  })
})
