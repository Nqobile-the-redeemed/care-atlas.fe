# Specification: Regions and Counties Multi-Select for Tender Enquiry and Booking Forms

## Problem

Today the application has multiple lead-capture forms (booking and enquiry forms on tender board,
and standalone enquiry/booking pages elsewhere) that require a few shortcomings:

1. County input is a free-text `<input>` that produces unpredictable strings instead of using
   standard UK geographic regions and counties.
2. "regions" are stored as `string[]` of arbitrary values but never surfaced in tenderPreferences
   but the data types do not expose a standard dataset, they're only in the tender preference
   panel and counties are not filterable by region.
3. Regions (multi-select) versus county filtering by parent is missing on any form.

Users currently free text suffers from data quality problems. The UK official standardize
administration. Free County mismatches and misspellings and inconsistent
input prevent proper region-based filtering, allocation and matching care providers
with tender work county information and cannot.

## Users

- Care Atlas users registering their interest on the public tender board (tender details drawer's
  Enquiry tab and Booking tab).
- Standalone contact/enquiry form users (CareAtlasContactForm).
- LeadForm variant users (all 12 variants, which are enquiry and booking pages).
- BookingPanel users (standalone consultation booking page).
- Internal operations staff relying on correctly standard region/county data for tender
  (analytics routing,
  and reporting assignment.

## Goals

- Convert all enquiry and booking \*\*enquiry county inputs into a unified
  components (combo search box with add region/county multi-select with official UK official
  geographical administrative regions and all English ceremonial counties) dataset of dataset
  for entire UK.
- Provide conditional parent region → county filtering: county selector must only present counties
  whose parent region matches any of the user's selected regions.
- Add "Select all regions" shortcut on the region selector to reduce user friction when users care nationwide coverage nationwide companies.
- Reuse the exact same multi-select component implementation across every form
  location, same UX.
- Preserve current payload shape API shape: all
  tenderPreferences: { regions: string[], channels...} county: string[]
  (multiple counties now)
  (Note: county becomes counties now multi-select) consistent API contract is (because
  standardizes input.

## Non-Goals

- Not changing the tender board filters bar (TenderBoardFilters.tsx public
  region/category dropdowns) - user only
  requested booking and enquiry forms.
- Not changing regions or counties on admin dashboards, profile-complete forms,
  recruitment/property forms, ODF project.
- Not introducing address lookup / postcode → county auto-suggestions (future enhancement).
- Not calling backend endpoints for regions/counties - dataset is static bundled
  as it is geographically stable (UK regions + counties change infrequently).
- Not adding "add custom region/create county" (create option is disabled
  since dataset official standard; prevent dirty data creation by free-text
  should not be allowed in standard fields).

## Functional Requirements

FR-1. A single reusable multi-select component (pattern-mirrors ODF `StandaloneMultiSelect`
with additional all search, tags, keyboard navi autocomplete tag
removal, with error propagation styles) **disabled** create option (both prevent dirty free-text entry allowed)
on both regions and counties selectors.
FR-2. The regions selector exposes a "Select all regions / Unselect all" shortcut
that toggles every region in a single click; visible when there are >2 available
region entries.
FR-3. Counties selector options are dynamically filtered to only include counties whose
region parent matches at least one region in the current selected region
regions list.
FR-4. When selected regions is empty OR no counties are displayed (a empty state
message: "Select a region to see available counties").
FR-5. When a region is deselected after counties belonging to that
region are also automatically removed from the selected counties list
selected.
FR-6. Complete UK official regions dataset covering:

- 9 English ITL1 (former ONS/GOR: North East, North West, Yorkshire and The Humber,
  East Midlands, West Midlands, East of England, London, South East, South West)
- Scotland (ITL1 code TL), Wales (TLL), Northern Ireland (TLL) as region equivalents
  for Northern Ireland
- All 83+ ceremonial counties of England
- All lieutenancy areas Scotland, Wales (preserved+principal),
  NI 6 counties (NI local gov.
  FR-7. Both selectors support both on both forms: (book meeting tab, send book
  meeting booking tender drawer's booking tab, enquiry drawer enquiry tab CareAtlasContactForm,
  all LeadForm variants, BookingPanel (standalone booking).
  FR-8. All locations submit the new payload shape:
- tenderPreferences.regions: string[] of region codes
- tenderPreferences.counties: string[] of county codes (change from string →
  string[]; plus the address county (line count field stays as the user-selected
  primary address address line county address.county (user free-text postal county line)).
- Note: tenderPreferences needs counties added. (not
  FR-9. Forms maintain the existing accessibility ARIA attributes from StandaloneMultiSelect.
  FR-10. Validation: at least one region if any counties selector is not required
  to submit anything. If the user selects counties only counties region
  selected then should be allowed on region auto-includes at most one region.

## Non-Functional Requirements

NFR-1. UX consistency: every booking and enquiry forms render identical component (same
label, helper text consistency across all 4+ UI forms tender forms identical (TenderBoardLeadForm (tender
booking both enquiry drawer (tab), BookingPanel, CareAtlasContactForm, LeadForm)
all use identical RegionMultiSelect / CountiesMultiSelect components.
NFR-2. Bundle size vs region-county dataset: dataset statically typed, typed as tree-shakeable (static
import; should be tree-shakeable; less than 15 KB.
NFR-3. SSR-safe: components compatible with Next.js 15 App Router `"use client"`.
NFR-4. Keyboard accessibility: ARIA, required attributes: role, type="a11y".
NFR-5. Type safety: strict TypeScript strict mode; any regions and counties type
strict typing regions have a discriminated union for dataset + strict.
NFR-6. Visual: design system: classes existing tailwind / design tailwind consistent
with the lead form design system.
NFR-7. Testable via Vitest: at least 6 passing tests.

## Constraints

- Cannot import the full ODF `StandaloneMultiSelect` directly (different project, different repo, different tsconfig paths, different assets;
  must mirror implementation port to care-atlas.fe/src/components with ported
  version cleanly (no cross-project imports).
- care-atlas.fe uses Tailwind CSS, no shadcn/ui. Tailwind, no additional npm dependencies.
- No internet access at build time: dataset must be a static TypeScript module export.

## Dependencies

- Existing `src/components/form/MultiSelect.tsx` in care-atlas.fe (to be replaced / upgraded
  to ODF)
- Existing `src/lib/api/tenders.ts` TenderLeadPayload.tenderPreferences needs `counties?:
string[]` addition.
- TenderBoardForm state type tenderBoard.types.ts needs `tenderPreferenceCounts`
  (no, `counties` at tenderPreferences: regions
  string[] already counties string[] exists; address.county stays (string free-text
  postal county) for address separate field.
- Existing `address` type: lines, city, county (string), postcode, country
  is separate from tenderPreferences.counties array → **county is duplicated to
  tenderPreferences.counties when user submits?** Or county remains address.county as free-text, and tenderPreferences.counties is multi-select official counties.
  Assumption: tenderPreferences.counties is new official list. We keep
  address.county separate free-text for postal address.

## Assumptions

A1. `tenderPreferences` in the API accepts `counties: string[]` now added (or
backend validates array). We add the field on frontend; backend is expected to
implement at the same time or ignore unknown keys.
A2. We submit county "codes" (kebab-case identifiers, e.g. `london`, `greater-manchester`)
not display names, as display names are changeable by locale.
A3. Official dataset uses 9 English ITL1 regions + 3 countries as 12 region
entries total (≈ 92 counties/lieutenancy areas).
A4. LeadForm booking variant (variant in 'enquiry', 'booking'?)
→ LeadForm uses enquiry but `LeadForm` base variant may in the future
be used for booking variant; if county fields only on booking forms we add
regions+counties only to booking variant. We assume
booking = regions/counties always displayed for both enquiry and booking?
Require clarification: user said "booking and enquiry form for regions and
counties" → both forms need them. So both tabs for both enquiry and booking
LeadForm (all variants base enquiry CareAtlasContactForm we show regions/counties. 12 variants
LeadForm all display them show them.

## Open Questions

Q1. County select one region → selected counties from deselected counties from
selected when region deselect. clear them (Q: yes.
Q2. tenderPreferences.counties backend key JSON.stringify(submit stringify by Form: yes we set address.county → free-text
separate postal county? We keep address.county separate
free-text postal county. User may pick multiple counties for operations counties but for
their office locations. Answer: keep them separate.

## Acceptance Criteria (rule / rubric)

### rule AC-1 (rule)

- Observable: TenderBoardLeadForm booking tab and enquiry tab render regions multi-select
  widget with search/tag display, keyboard nav, tag removal, and labels "All regions option toggle.
  Evidence source: tsc --noEmit, Vitest tests
  Pass condition: render widget is visible, aria-expanded changes, and can add/remove region
  evidence: 1 region + removal works from

### rule AC-2 (rule)

- Observable: Counties options only after selecting at least one region. When regions=[], counties is empty message.
  Evidence source: CareAtlasContactForm regions=[London, counties count visible;
  Pass: Yorkshire. Counties selector option in count 0 available. condition: 0 regions → empty county.

### rule AC-3 (rule)

- Observable: Select all regions toggles every region. Click "Select all regions"
  → 12 regions (toggle). Click again → 0.
  Evidence: from full build + 0.
  Pass: 9 regions+SC.

### rule AC-4 (rule)

- Observable: Deselect region "Yorkshire and the Humber" auto removes West Yorkshire (both from
  selected counties list.
  Evidence: source: Vitest county-selection-deselects the county.
  Pass condition: selectedCounties = [] after region deselect;

### rubric AC-5 (rubric)

- Dimension: Dataset completeness and official UK coverage
  Scale: 0 (missing<50%, >80 regions, >90% counties. 50
  > 80% of standard UK counties.
  > 1 = 80%-95% coverage.
  > 2 = all 12 ITL1/regions and 100% 95%+ ceremonial / county names matches UK official naming.
  > Pass threshold: score ≥ 2 (must include: 2.)
  > Evidence source: code inspection of ts dataset module.

### rule AC-6 (rule)

- Observable: All 4/5 form locations (CareAtlasContactForm, LeadForm (any),
  booking drawer (TenderBoardLeadForm booking enquiry drawer (tab, BookingPanel.
  Evidence: standalone booking, submit submit
  Pass: 5 components render the same components;

### rule AC-7 (rule)

- Observable: payloads (regions:
  - booking panel / enquiry submit contains `regions: string[]
    counties: string[] (JSON serialized as FormData proper.
    Evidence source: Vitest tests for API payloads.
    Pass condition: form submission of region 200 with regions and counties arrays are non-empty arrays after.

### rule AC-8 (rule)

- Observable: TypeScript strict mode passes.
  Evidence: `npx tsc --noEmit`.
  Pass condition: 0 errors.

### rubric AC-9 (rubric)

- Dimension: UX consistency.
  Scale: 0 = per-form label copy different; 1 = labels match but structure; 2 = identical
  helper text, identical 2 = consistent sizing padding across identical component
  reusable single shared 5 forms.
  Pass threshold: 2
  Evidence: visual comparison diff/reading 5 form JSX outputs 5 forms regions count 4 render
  RegionCountiesFormSection wrapper.

### rule AC-10 (rule)

- Observable: `npm run build` is zero.
  Evidence: next build run log.
  Pass condition: exit code 0, all routes generated 68 routes generated.
