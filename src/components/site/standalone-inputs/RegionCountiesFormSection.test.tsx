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

  it('TR-3.7: counties select-all action absent when no regions selected', () => {
    const { container } = render(
      <RegionCountiesFormSection
        id='p7'
        selectedRegions={[]}
        selectedCounties={[]}
        onRegionsChange={() => {}}
        onCountiesChange={() => {}}
      />
    )

    const countyInput = container.querySelector(`input[id="p7-counties"][role="combobox"]`)
    expect(countyInput).toBeNull()
  })

  it('TR-3.8: counties select-all toggle selects every NW-filtered county, then unselects', () => {
    const nwCounties = getCountiesByRegion(['NW'])
    expect(nwCounties.length).toBeGreaterThan(0)

    let selectedCounties: string[] = []
    const onCountiesChange = (next: string[]) => {
      selectedCounties = next
    }

    const { container, rerender } = render(
      <RegionCountiesFormSection
        id='p8'
        selectedRegions={['NW']}
        selectedCounties={[]}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    const countyInput = container.querySelector(`input[id="p8-counties"][role="combobox"]`) as HTMLInputElement | null
    expect(countyInput).toBeTruthy()
    fireEvent.focus(countyInput!)
    fireEvent.click(countyInput!)

    const countyListbox = container.querySelector(`[id="p8-counties-listbox"]`) as HTMLElement | null
    expect(countyListbox).toBeTruthy()
    const q = getQueriesForElement(countyListbox!)
    const buttons = q.queryAllByRole('button')
    const selectAllBtn = buttons.find(b =>
      /select all counties|counties in selected regions/i.test(b.textContent || '')
    ) as HTMLButtonElement | undefined
    expect(selectAllBtn).toBeTruthy()
    const counter = /\d+\/\d+/.exec(selectAllBtn!.textContent || '')
    expect(counter).toBeTruthy()
    expect(counter![0]).toBe(`0/${nwCounties.length}`)

    fireEvent.click(selectAllBtn!)
    expect(selectedCounties.length).toBe(nwCounties.length)
    for (const c of nwCounties) {
      expect(selectedCounties).toContain(c.code)
    }

    rerender(
      <RegionCountiesFormSection
        id='p8'
        selectedRegions={['NW']}
        selectedCounties={selectedCounties}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    fireEvent.click(countyInput!)
    const countyListbox2 = container.querySelector(`[id="p8-counties-listbox"]`) as HTMLElement | null
    expect(countyListbox2).toBeTruthy()
    const q2 = getQueriesForElement(countyListbox2!)
    const buttons2 = q2.queryAllByRole('button')
    const unselectBtn = buttons2.find(b => /unselect all counties|clear all counties/i.test(b.textContent || '')) as
      | HTMLButtonElement
      | undefined
    expect(unselectBtn).toBeTruthy()

    fireEvent.click(unselectBtn!)
    expect(selectedCounties.length).toBe(0)
  })

  it('TR-3.9: individual county selection still works after select-all partial state', () => {
    const nwCounties = getCountiesByRegion(['NW'])
    expect(nwCounties.length).toBeGreaterThanOrEqual(2)

    let selectedCounties: string[] = [nwCounties[0].code]
    const onCountiesChange = (next: string[]) => {
      selectedCounties = next
    }

    const { container, rerender } = render(
      <RegionCountiesFormSection
        id='p9'
        selectedRegions={['NW']}
        selectedCounties={selectedCounties}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    const countyInput = container.querySelector(`input[id="p9-counties"][role="combobox"]`) as HTMLInputElement | null
    fireEvent.focus(countyInput!)
    fireEvent.click(countyInput!)

    const countyListbox = container.querySelector(`[id="p9-counties-listbox"]`) as HTMLElement | null
    const q = getQueriesForElement(countyListbox!)
    const optionButtons = q.queryAllByRole('option') as HTMLButtonElement[]
    expect(optionButtons.length).toBeGreaterThanOrEqual(2)

    fireEvent.click(optionButtons[1])
    expect(selectedCounties.length).toBe(2)
    expect(selectedCounties).toContain(nwCounties[0].code)
    const secondCode =
      nwCounties.find(c => c.name === (optionButtons[1].textContent || '').trim())?.code || nwCounties[1].code
    expect(selectedCounties).toContain(secondCode)
    void rerender
  })

  it('TR-3.10: counties select-all never leaks outside filtered regions (NW+WM only, no Scotland)', () => {
    let selectedCounties: string[] = []
    const onCountiesChange = (next: string[]) => {
      selectedCounties = next
    }

    const { container } = render(
      <RegionCountiesFormSection
        id='p10'
        selectedRegions={['NW', 'WM']}
        selectedCounties={[]}
        onRegionsChange={() => {}}
        onCountiesChange={onCountiesChange}
      />
    )

    const countyInput = container.querySelector(`input[id="p10-counties"][role="combobox"]`) as HTMLInputElement | null
    fireEvent.focus(countyInput!)
    fireEvent.click(countyInput!)

    const countyListbox = container.querySelector(`[id="p10-counties-listbox"]`) as HTMLElement | null
    const q = getQueriesForElement(countyListbox!)
    const buttons = q.queryAllByRole('button')
    const selectAllBtn = buttons.find(b =>
      /select all counties|counties in selected regions/i.test(b.textContent || '')
    ) as HTMLButtonElement | undefined
    expect(selectAllBtn).toBeTruthy()

    fireEvent.click(selectAllBtn!)

    const scotlandCounties = getCountiesByRegion(['SCT'])
    for (const c of scotlandCounties) {
      expect(selectedCounties).not.toContain(c.code)
    }
    const nwPlusWm = [...getCountiesByRegion(['NW']), ...getCountiesByRegion(['WM'])]
    for (const c of nwPlusWm) {
      expect(selectedCounties).toContain(c.code)
    }
    expect(selectedCounties.length).toBe(nwPlusWm.length)
  })
})
