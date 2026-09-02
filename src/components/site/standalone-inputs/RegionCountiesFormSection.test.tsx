import { afterEach, describe, it, expect } from 'vitest'
import { render, getQueriesForElement, cleanup, fireEvent } from '@testing-library/react'

import { RegionCountiesFormSection } from './RegionCountiesFormSection'
import { ALL_REGIONS, getCountiesByRegion } from '@/lib/geography'

afterEach(() => {
  cleanup()
})

describe('RegionCountiesFormSection', () => {
  it('TR-3.1: header action select/unselect all regions via dropdown listbox button', () => {
    let selectedRegions: string[] = []
    const onRegionsChange = (next: string[]) => {
      selectedRegions = next
    }

    const { container, rerender } = render(
      <RegionCountiesFormSection
        id='p1'
        selectedRegions={selectedRegions}
        selectedCounties={[]}
        onRegionsChange={onRegionsChange}
        onCountiesChange={() => {}}
      />
    )

    const regionInput = container.querySelector(`input[id="p1-regions"][role="combobox"]`) as HTMLInputElement | null
    expect(regionInput).toBeTruthy()

    fireEvent.focus(regionInput!)
    fireEvent.click(regionInput!)

    const regionListbox = container.querySelector(`[id="p1-regions-listbox"]`) as HTMLElement | null
    expect(regionListbox).toBeTruthy()
    const q = getQueriesForElement(regionListbox!)
    const buttons = q.queryAllByRole('button')
    const selectAllBtn = buttons.find(b => /select all regions|all 12/i.test(b.textContent || '')) as
      | HTMLButtonElement
      | undefined
    expect(selectAllBtn).toBeTruthy()

    fireEvent.click(selectAllBtn!)
    expect(selectedRegions.length).toBe(ALL_REGIONS.length)
    expect(selectedRegions).toContain('NW')
    expect(selectedRegions).toContain('SCT')
    expect(selectedRegions).toContain('LDN')

    rerender(
      <RegionCountiesFormSection
        id='p1'
        selectedRegions={selectedRegions}
        selectedCounties={[]}
        onRegionsChange={onRegionsChange}
        onCountiesChange={() => {}}
      />
    )

    fireEvent.click(regionInput!)
    const regionListbox2 = container.querySelector(`[id="p1-regions-listbox"]`) as HTMLElement | null
    expect(regionListbox2).toBeTruthy()
    const q2 = getQueriesForElement(regionListbox2!)
    const buttons2 = q2.queryAllByRole('button')
    const unselectBtn = buttons2.find(b => /unselect all regions|unselect all|clear all/i.test(b.textContent || '')) as
      | HTMLButtonElement
      | undefined
    expect(unselectBtn).toBeTruthy()

    fireEvent.click(unselectBtn!)
    expect(selectedRegions.length).toBe(0)
  })

  it('TR-3.2: renders "Select a region to see available counties" disabled card when no regions picked', () => {
    const { getAllByText } = render(
      <RegionCountiesFormSection
        id='p2'
        selectedRegions={[]}
        selectedCounties={[]}
        onRegionsChange={() => {}}
        onCountiesChange={() => {}}
      />
    )

    const matches = getAllByText(/select a region to see available counties/i)
    expect(matches.length).toBeGreaterThanOrEqual(1)
    expect(matches[0].tagName.toLowerCase()).toBe('span')
  })

  it('TR-3.3: counties listbox filtered to NW counties only when NW is the sole selected region', () => {
    const { container } = render(
      <RegionCountiesFormSection
        id='p3'
        selectedRegions={['NW']}
        selectedCounties={[]}
        onRegionsChange={() => {}}
        onCountiesChange={() => {}}
      />
    )

    const countyInput = container.querySelector(`input[id="p3-counties"][role="combobox"]`) as HTMLInputElement | null
    expect(countyInput).toBeTruthy()
    fireEvent.focus(countyInput!)
    fireEvent.click(countyInput!)

    const countyListbox = container.querySelector(`[id="p3-counties-listbox"]`) as HTMLElement | null
    expect(countyListbox).toBeTruthy()

    const content = countyListbox?.textContent || ''
    const nwCounties = getCountiesByRegion(['NW'])
    expect(nwCounties.length).toBeGreaterThanOrEqual(5)
    for (const c of nwCounties.slice(0, 4)) {
      expect(content).toContain(c.name)
    }
    expect(/Antrim|Aberdeen|Gwynedd|Greater London/i.test(content)).toBe(false)
  })

  it('TR-3.4: orphan county auto-pruning effect - LDN county removed after LDN region deselected', () => {
    let selectedCounties = ['merseyside', 'cheshire', 'greater-london']
    let received: string[] | undefined
    const onCountiesChange = (next: string[]) => {
      received = next
      selectedCounties = next
    }

    const { rerender } = render(
      <RegionCountiesFormSection
        id='p4'
        selectedRegions={['NW', 'LDN']}
        selectedCounties={selectedCounties}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    rerender(
      <RegionCountiesFormSection
        id='p4'
        selectedRegions={['NW']}
        selectedCounties={selectedCounties}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    expect(received).toBeDefined()
    expect((received as string[]).includes('greater-london')).toBe(false)
    expect((received as string[]).includes('merseyside')).toBe(true)
    expect((received as string[]).includes('cheshire')).toBe(true)
  })

  it('TR-3.5: regionError rendered when provided', () => {
    const { getByText } = render(
      <RegionCountiesFormSection
        id='p5'
        selectedRegions={[]}
        selectedCounties={[]}
        onRegionsChange={() => {}}
        onCountiesChange={() => {}}
        regionError='Please select at least one region.'
      />
    )

    expect(getByText('Please select at least one region.')).toBeTruthy()
  })

  it('TR-3.6: countyError rendered when provided', () => {
    const { getByText } = render(
      <RegionCountiesFormSection
        id='p6'
        selectedRegions={['NW']}
        selectedCounties={[]}
        onRegionsChange={() => {}}
        onCountiesChange={() => {}}
        countyError='Please pick at least one county.'
      />
    )

    expect(getByText('Please pick at least one county.')).toBeTruthy()
  })
})
