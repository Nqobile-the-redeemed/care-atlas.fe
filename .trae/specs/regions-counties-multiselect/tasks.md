# Implementation Tasks — Regions and Counties Multi-Select

## Task 1: Port StandaloneMultiSelect from ODF and create standard Option type

Status: pending
Priority: high
Depends on: nothing

Objective: Create a reusable, searchable, tag-based multi-select component in care-atlas.fe
that mirrors ODF `StandaloneMultiSelect.tsx` UI/UX + a shared `Option` type, plus a
`StandaloneMultiSelectCheckbox` fallback.

Files to create/modify:

- `src/components/site/standalone-inputs/StandaloneMultiSelect.tsx` (new)
- `src/components/site/standalone-inputs/index.ts` (barrel)
- `src/core/types.ts` or `src/components/site/standalone-inputs/types.ts`: define Option = {code, name, value?, image?, label?, description?}
- Note: remove `createOption/addOptionEndpoint` parameters since dataset is static.

Test Requirements (rule):

- TR-1.1: StandaloneMultiSelect renders with value=[] → shows placeholder. Type: rule.
  Evidence: render() output.
  Pass: placeholder text visible, no option tags.
- TR-1.2: Search box filters options. Type: rule.
  Evidence: Render 10 options, search "Yorkshire" → Yorkshire-only options remain.
  Pass: filtered list length == Yorkshire-count match.
- TR-1.3: Tag chip (X) button removes option. Type: rule.
  Evidence: value=[optA]. Click optA chip X. value===[].
  Pass: onChange called with [].
- TR-1.4: Error prop renders border-red-500. Type: rule.
  Evidence: className has border-red.
  Pass: error class applied.
- TR-1.5: AllowCreate=false hides "+ add: …" button; create option button never shown.
  Type: rule. Pass: button hidden.
  Test command: `npx vitest run src/components/site/standalone-inputs/__tests__/StandaloneMultiSelect.test.tsx`.

Rubric TR (for code review):

- TR-1.6 (rubric 0-2): Visual fidelity vs ODF StandaloneMultiSelect. 0=barely, 1=similar,
  2=identical UX/tags/colors/search. Threshold: 2.

Completion Evidence: (filled after implementation)

---

## Task 2: Create official UK regions + counties dataset (static, type-safe)

Status: pending
Priority: high
Depends on: Task-1 Option type definition (or define within)

Objective: Create `src/lib/geography/ukRegionsCounties.ts` with export of:

- type UkRegion (code ITL1, name, constituentCountry: England|Scotland|Wales|NI)
- type UkCounty (code, name, regionCode: UkRegion['code'], countyType: 'ceremonial'|'lieutenancy'|'council-area'|'preserved')
- ALL_REGIONS: UkRegion[] (9 English ITL1 + 3 constituent country equivalents)
- ALL_COUNTIES: UkCounty[] (83 ceremonial England + Scotland lieutenancies + Wales
  preserved + NI 6 counties. Total >= 90+ entries.)
- getCountiesByRegion(regionCodes): returns filtered counties.
- getRegionSelectOptions(countyNameLookup): Option[] (name → counties for region)
- getCountySelectOptions(selectedRegionCodes): Option[]

Files created/modified:

- `src/lib/geography/ukRegionsCounties.ts`
- `src/lib/geography/index.ts` (barrel)
- `src/lib/geography/__tests__/ukRegionsCounties.test.ts` (new)

Test Requirements:

- TR-2.1 (rule): ALL_REGIONS contains >= 12 entries (England regions+ 3 country equivalents
  (≥9 English).
  Evidence: `ALL_REGIONS.length >= 12`. Pass: >= 12.
- TR-2.2 (rule): ALL_COUNTIES has `county.length >=90`.
  Pass: length >=90.
- TR-2.3 (rule): every county's regionCode exists in ALL_REGIONS.
  Evidence: Object.fromEntries of county.regionCode→true against ALL_REGIONS set.
  Pass: no missing keys (100% valid region references).
- TR-2.4 (rule): getCountiesByRegion(['LDN']) returns only LDN counties, non-empty set containing
  Greater London or `greater-london` county code.
  Pass: count >= 1, contains 'greater-london' region.
- TR-2.5 (rule): Scotland region code "SCT" + Wales WLS + NI "NIR".
  Pass: codes exist in ALL_REGIONS.
- TR-2.6 (rubric 0-2): Dataset completeness (ceremonial counties coverage of England). 0=≤50%
  names, 1=80-95%, 2≥95%.
  Threshold:≥95%, score >=2.
  Evidence: dataset inspection.
  Test command: `npx vitest run src/lib/geography/__tests__/ukRegionsCounties.test.ts`

Completion Evidence: (filled after)

---

## Task 3: Build combined RegionCountiesFormSection with region→county linkage + select-all regions shortcut

Status: pending
Priority: high
Depends on: Task-1, Task-2

Objective: Single reusable compound `<RegionCountiesFormSection>` component that:

- Takes `selectedRegions: string[], selectedCounties: string[], onRegionsChange,
onCountiesChange, errors?: {regions?, counties?}, className?`
- Regions multi-select has "Select all regions" button (checkbox at top of list + top-level
  button when dropdown open).
- Counties selector automatically shows only counties whose regionCode is in selectedRegions.
  selectedRegions empty → shows "Select a region to see available counties" empty state.
- When regions change: if counties was holding a removed region, auto-deselect those counties
  (filter out orphan selections and fires onCountiesChange() with filtered list).

Files created/modified:

- `src/components/site/standalone-inputs/RegionCountiesFormSection.tsx` (new)
- Tests: `__tests__/RegionCountiesFormSection.test.tsx` (new)

Test Requirements:

- TR-3.1 (rule): selectAll toggle. Render section, click "Select all regions".
  onRegionsChange called with length == ALL_REGIONS.length. Click again → empty array.
  Pass: two onChange calls have expected sizes.
- TR-3.2 (rule): Counties list with 0 regions selected == zero options + empty message visible.
  Pass: counties selector options === 0.
- TR-3.3 (rule): Select region "North West" (code NW). County list contains Lancashire,
  Cumbria, Greater Manchester, Merseyside, Cheshire.
  Pass: >=5 options returned.
- TR-3.4 (rule): Select region NW, select county 'lancashire' → deselect NW region. Result:
  onCountiesChange fires with [] (lancashire removed).
  Pass: final counties array === [].
- TR-3.5 (rule): region error displays.
  Pass: classes contain error-red border counties.
- TR-3.6 (rule): county error displays.
  Pass: error class visible.

Completion Evidence: (filled after)

---

## Task 4: Update TenderBoard API payload types and slice to support tenderPreferences.counties + wiring

Status: pending
Priority: high
Depends on: Task 3 (data types needed)

Objective: Update payloads so selectedRegions, selectedCounties travel through API forms.

Files:

- `src/lib/api/tenders.ts` — TenderLeadPayload.tenderPreferences: add `counties?: string[]`.
  In `sendTenderLead()`: set `tender_preferences` JSON include `{regions, categories, counties,
channels, notes}`.
- `src/features/tenders/tenderBoard.types.ts` — TenderBoardForm: address.county remains
  (string, free postal). Add `selectedRegions?: string[]` and `selectedCounties?: string[]`
  to TenderBoardForm type. Or keep as separate props in `HalfScreenContent` local state if
  not Redux slice form. The tender drawer uses HalfScreenContent local state
  constants.ts, not. Check which. Since both exist update both slice + local emptyTenderBoardForm:
  - tenderBoardSlice.ts initialState.selectedRegions, selectedCounties: string[].
  - tender-board/constants.ts emptyTenderBoardForm: add selectedRegions:[], counties:[]
    (or keep in separate usestate in HalfScreenContent). We will keep in Redux slice form.

Test Requirements:

- TR-4.1 (rule): sendTenderLead payload includes regions and counties inside
  tender_preferences JSON. FormData `tender_preferences` key. JSON.parse() contains keys and
  counties array.
  Pass: parsed.counties (parsed) contains non-empty array.
- TR-4.2 (rule): tenderBoardSlice.reset form clears regions and counties arrays.
  Pass: form.selectedRegions === [] and form.selectedCounties === [] after reset.

Test command: `npx vitest run src/lib/api/tenders.test.ts src/features/tenders/tenderBoardSlice.test.ts` (add new test if needed)

Completion Evidence: (filled after)

---

## Task 5: Integrate RegionCountiesFormSection into TenderBoardLeadForm (both tabs)

Status: pending
Priority: high
Depends on: Task 3, Task 4

Objective: Swap out the current plain-text county `<input>` in TenderBoardLeadForm and add
a regions multi-select directly above address.county (postal county line can still remain
as plain text line after counties).

Files:

- `src/components/site/tender-board/TenderBoardLeadForm.tsx`
  - Remove plain-text county line, insert RegionCountiesFormSection.
  - Keep `address.county` (postal county) for address.address separate.
  - Both enquiry and booking tabs, selectedRegions, selectedCounties: string[] passed into
    the component props.
- `TenderBoardHalfScreenContent.tsx`: manage the state and wire submitLead() booking and
  enquiry dispatch branches to include the arrays.

Note: TenderBoardHalfScreenContent already `selectedRegions`, `selectedCategories` for
tender preferences page. Reuse the same state for the form section too. If duplicate,
unify: only one selectedRegions state (used in both tender preferences notification page
and the form section — sensible as user intent is "I care about these regions for both").

Test Requirements:

- TR-5.1 (rule): Enquiry submitLead reads selectedRegions and selectedCounties into
  sendTenderLead payload tenderPreferences.regions / counties. Mock sendTenderLead; check args.
  Pass: mock call regions+counties length≥1 in payload.
- TR-5.2 (rule): Booking submitLead passes same preferences to createPublicBooking (if it
  carries preferences) or at least we pass through (booking intake message may carry region
  list via existing tenderPreferencesNotes mapping). Ensure at least the preferences tender
  preferences carries them in payload message.
  Pass: intake.message contains region names.
- TR-5.3 (rule): Booking panel's existing address.county input still renders and
  kept as separate for address postal county. (just add the form section above it).
  Completion Evidence: (filled after)

---

## Task 6: Integrate into CareAtlasContactForm (standalone enquiry form)

Status: pending
Priority: high
Depends on: Task 3

Objective: Add `<RegionCountiesFormSection>` to CareAtlasContactForm above password fields
section. Manage via local usestate. Submit via formData.set() in `details: Record<string,string>`
(or stringify) details as `regions`, `counties`.

Files:

- `src/components/site/CareAtlasContactForm.tsx`

Test Requirements:

- TR-6.1 (rule): Form submit builds a details JSON with regions[] and counties[] keys.
  Evidence: dispatch(submitEnquiry) called with correct `details` parsed keys.
  Pass: details contain both arrays; length check.
- TR-6.2 (rule): Select all works.
  Pass: all 12 regions added to the form; onChange callback has all entries.
- TR-6.3 (rule): Counties filter based on regions.
  Pass: counties visible only after region selected.

Completion Evidence: (filled after)

---

## Task 7: Integrate into LeadForm (multi-variant enquiry form)

Status: pending
Priority: high
Depends on: Task 3, Task 6

Objective: Extend LeadForm baseFields with two "non-standard" fields that
cannot be rendered by the generic input renderer (because they are compound widgets not single
FieldType entries). Render them as a separate block "Interested counties"
(between profileType and attachments fields). Keep FieldType simple; don't add 'regions'/'counties'
type. Use custom render.

Files:

- `src/components/site/LeadForm.tsx`. After profileType field add the RegionCountiesFormSection.
- Details payload include regions/counties in the `details` object (same as CareAtlasContactForm).

Test Requirements:

- TR-7.1 (rule): LeadForm renders the section on all variants (enquiry booking).
  Pass: section visible.
- TR-7.2 (rule): submit regions, counties via details.
  Pass: dispatch payload contains keys.

Completion Evidence: (filled after)

---

## Task 8: Integrate into BookingPanel (standalone book meeting form)

Status: pending
Priority: high
Depends on: Task 3, Task 7

Objective: Add RegionCountiesFormSection to BookingPanel (between consultation type selector
and notes for the meeting textarea). Manage via useState. Submit as intake.message carrying
counties/regions, and/or customer.website? No — keep intake details. BookingPayload
has no details field; we'll add regions and counties to intake.message string or keep
as new payload keys: intake.regions (string[]), intake.counties (string[]). Better extend
Intake type: `BookingPayload.intake.regions?: string[]; counties?: string[];` then pass in JSON body.

Files:

- `src/lib/api/bookings.ts` BookingPayload.intake: add optional regions, counties string[].
- `BookingPanel.tsx`: add section, wire into createPublicBooking call.

Test Requirements:

- TR-8.1 (rule): Extended BookingPayload.intake type.
  Pass: tsc --noEmit accepts regions, counties under intake.
- TR-8.2 (rule): createPublicBooking JSON body contains regions and counties arrays.
  Vitest test + mock fetch. Pass: parsed body has arrays of length ≥1.

Completion Evidence: (filled after)

---

## Task 9: Run TypeScript, build, and final tests

Status: pending
Priority: medium
Depends on: Tasks 1-8

Objective: Verify the build is green.

Files: none (modify only to fix type issues).

Test Requirements:

- TR-9.1 (rule): `npx tsc --noEmit` — 0 errors.
  Pass: exit 0.
- TR-9.2 (rule): `npm run build` exit 0, all 68 routes generated.
  Pass: next build output contains "68 routes generated".
- TR-9.3 (rule): Vitest `npx vitest run` — ≥6 tests pass (from tasks 1-8).
  Pass: 0 failing tests.
- TR-9.4 (rubric 0-2): Readability and naming. 0=mixed names, 1=OK, 2=consistent with
  existing codebase conventions. Threshold 2.

Completion Evidence: (filled after)
