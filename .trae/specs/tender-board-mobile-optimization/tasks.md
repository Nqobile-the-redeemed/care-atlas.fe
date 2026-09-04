# Tasks: Tender Board Mobile Optimization

Implementation queue for the Mobile Bottom-Sheet & Responsive Hardening spec.
Every task carries status = `pending` unless in progress. Rule/rubric TRs satisfy
ACs enumerated in spec.md.

## Dependency Graph

```
Task 1 (HalfScreenModalContext API ext + snap state) → must be done first.
  ├→ Task 2 (matchMedia viewport hook utility)
  │   └→ Task 3 (HalfScreenModal morphology: bottom-sheet mobile / desktop drawer)
  │       └→ Task 4 (Minimize + Exit mobile header buttons + events)
  │           └→ Task 5 (Animations: entry/minimize/exit + prefers-reduced-motion)
  │               └→ Task 6 (Accessibility: dialog/aria-live/focus trap/return focus)
  │
  ├→ Task 7 (Tender board subcomponents responsive hardening: item CTAs + filters + form)
  └→ Task 8 (Payload equivalence: mobile vs desktop form submission)
      └→ Task 9 (Test suite: 4 device viewports, snapshot payload, animations, a11y)
```

---

## Task 1: Extend HalfScreenModalContext with sheet snap state

**Status:** pending
**Priority:** high
**ACs covered:** AC-3, AC-4, AC-5 (enabler)
**Read paths:**

- [HalfScreenModalContext.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/context/HalfScreenModalContext.tsx) (full file, especially lines 19–39 type block, lines 64–108 open/close)

**Scope of changes:**

1. Add `sheetSnap: 'expanded' | 'minimized' | 'closed' | null` to `HalfScreenModalState`. `null` when modal closed OR desktop (mobile-only concept). Default `null`.
2. Add to `HalfScreenModalContextProps`:
   - `minimizeModal(): void` — sets `sheetSnap = 'minimized'` only if `isOpen === true` and `sheetSnap !== 'closed'`
   - `maximizeModal(): void` — sets `sheetSnap = 'expanded'` under same guard
3. `openModal` must set `sheetSnap: 'expanded'` (mobile will render this; desktop ignores it later in HalfScreenModal).
4. `closeModal` must set `sheetSnap: 'closed'` before the existing `CLOSE_ANIMATION_MS` timeout that nulls data/template, then `sheetSnap: null` after timeout.
5. Exports preserved; `HalfScreenModalProvider` value memoization updated.

**Task-local TRs:**

- TR-1.1 (rule): `useHalfScreenModal().sheetSnap` type is `'expanded' | 'minimized' | 'closed' | null` and initial value is `null`.
- TR-1.2 (rule): After `openModal({...})` is invoked, `sheetSnap === 'expanded'`.
- TR-1.3 (rule): After `minimizeModal()`, `sheetSnap === 'minimized'` AND `isOpen === true` (not closed).
- TR-1.4 (rule): After `maximizeModal()`, `sheetSnap === 'expanded'`.
- TR-1.5 (rule): After `closeModal()` + 300ms timeout, `sheetSnap === null` AND `template === null` AND `data === null`.
  Evidence: Vitest unit test rendering a consumer inside `HalfScreenModalProvider` inside jsdom, asserting on state transitions at each step via `act(() => { jest.runAllTimers() })`.

---

## Task 2: Create `useMediaQuery` SSR-safe viewport hook utility

**Status:** pending
**Priority:** high
**ACs covered:** AC-1, AC-2 (enabler)
**Read paths:** project_memory → SSR safety; current codebase any existing `useMediaQuery` (grep first; if absent create).

**Scope:**

1. New file at `src/hooks/useMediaQuery.ts` export `function useMediaQuery(query: string, options?: { ssrDefault?: boolean }): boolean`.
2. SSR-safe pattern: return `ssrDefault ?? false` on server (typeof window === undefined), then on client mount `useEffect` adds `window.matchMedia(query).addListener` with cleanup, returns live boolean.
3. No imports from Next.js internals; pure React + TS.

**Task-local TRs:**

- TR-2.1 (rule): Hook returns `ssrDefault` when `window` is undefined.
- TR-2.2 (rule): Hook subscribes to matchMedia change events and updates value when media query condition changes at runtime (e.g., desktop→mobile via user resizing the window).
  Evidence: Vitest jsdom with `window.matchMedia = vi.fn().mockReturnValue({matches:false, addListener: vi.fn(), removeListener: vi.fn()})`; simulate event firing → value flipped.

---

## Task 3: Refactor `HalfScreenModal` to conditionally render bottom-sheet vs desktop drawer by viewport

**Status:** pending
**Priority:** high
**ACs covered:** AC-1, AC-2, FR-1, FR-2
**Read paths:**

- [HalfScreenModal.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/HalfScreenModal.tsx) (full file)

**Scope:**

1. Import `useMediaQuery` from Task 2; query = `'(min-width: 768px)'` → `isDesktop`.
2. Render **two morphologies** inside outer pointer-events-none fixed wrapper:
   - **Desktop (isDesktop === true):** reuse current `<section>` verbatim. No class changes.
   - **Mobile (isDesktop === false):** new bottom-sheet `<section>`: `left-0 right-0 bottom-0 fixed z-50 transform translate-y-[15%] h-[85dvh] w-full flex flex-col bg-white shadow-2xl border-t border-gray-200 rounded-t-2xl transition-transform duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)]`. Add `rounded-t-2xl` to match Material/iOS sheet conventions. Backdrop 30% opaque dark div rendered behind sheet but only on mobile.
3. Sheet open/close translate state: `isOpen && sheetSnap !== 'closed' ? translate-y-[15%] : translate-y-full`.
4. Minimize transform override: if `sheetSnap === 'minimized'` on mobile, change `translate-y-[calc(100%-8dvh)]` (so only 8dvh peek shows) via inline style or dynamic className; height still 85dvh (so content scroll pos preserved when re-expand).
5. Content scroll wrapper `overflow-y-auto` inside flex-1 div — same on both morphologies.
6. Desktop: `isExpanded` useState untouched (Task 3 only adds the mobile branch, nothing else on desktop).

**Task-local TRs:**

- TR-3.1 (rule): When isDesktop=false & isOpen=true → rendered `<section>` has `rounded-t-2xl` class and inline style `height:85dvh`; no `translate-x-full` (horizontal) classes present.
- TR-3.2 (rule): When isDesktop=true → rendered `<section>` uses current `translate-x-0/translate-x-full` classes; `right-0 top: var(--site-header-height)` style unchanged.
- TR-3.3 (rule): Mobile backrop renders only on mobile + isOpen (30% black bg).
  Evidence: Vitest conditional render snapshot for mobile vs desktop.

---

## Task 4: Mobile header — add prominent Minimize + Exit text buttons

**Status:** pending
**Priority:** high
**ACs covered:** AC-3, AC-4, AC-5
**Read paths:** HalfScreenModal.tsx lines 72–103 current header block.

**Scope:**

1. Add **mobile-only header variant** (`!isDesktop`):
   - Left: title (`{headerConfig?.title}`, truncated) + subtitle if exists.
   - Right button cluster, flex items-center gap-2:
     - **Minimize button:** `min-h-11 min-w-[96px]` (≥44px touch), label `[chevron-down icon] Minimize` when expanded → switches to `[chevron-up icon] Expand` when minimized. `onClick = sheetSnap === 'expanded' ? minimizeModal() : maximizeModal()`.
     - **Exit button:** `min-h-11 min-w-[80px] bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg px-3 text-sm font-semibold`, label `[× icon] Exit`. onClick = closeModal().
2. On desktop: existing icon-only expandOut/expandIn + close buttons remain EXACTLY as they are (no text labels added to desktop).
3. Focus management (partial a11y): on open mobile sheet → focus Minimize button via `useRef<HTMLButtonElement>` + focus() in useEffect([isOpen,isDesktop]); this anchors AT keyboard nav.

**Task-local TRs:**

- TR-4.1 (rule): On mobile, `getByRole('button', {name: /minimize/i})` AND `getByRole('button', {name: /exit/i})` are present.
- TR-4.2 (rule): Minimize button has `min-h-11` class, Exit button has `min-h-11` class (≥44px touch).
- TR-4.3 (rule): Click Minimize on expanded sheet → minimizes. Click Minimize again → expands. Click Exit → closeModal called exactly once.
  Evidence: Vitest user-event clicks; mock `minimizeModal`/`maximizeModal`/`closeModal` via context consumer spy.

---

## Task 5: Animations entry/minimize/exit + prefers-reduced-motion

**Status:** pending
**Priority:** medium
**ACs covered:** AC-8 (rubric)
**Scope:**

1. Entry transition on mobile: `transform` + `transition-property: transform, height; transition-duration: 350ms; transition-timing-function: cubic-bezier(0.22,1,0.36,1)`. Wrap with Tailwind `@media (prefers-reduced-motion: reduce)` via arbitrary variant `motion-reduce:duration-0 motion-reduce:transition-none` (Tailwind 4 default supports `motion-reduce:` variant).
2. Minimize transition: when `sheetSnap` flips, CSS translate to `translate-y-[calc(100%-8dvh)]` — transition duration 300ms ease-in-out, motion-reduce instant.
3. Exit transition: `translate-y-full` — 250ms, motion-reduce 0ms. Timing aligned with existing `CLOSE_ANIMATION_MS` (300ms) — exit 250ms plus 50ms buffer before context nulls template.
4. No framer-motion/react-spring; pure Tailwind transition classes.

**Task-local TRs:**

- TR-5.1 (rubric, 0–2, pass ≥ 1): animation class coverage. Score 2 if all 3 transitions (350/300/250) present with correct easing + `motion-reduce:duration-0` applied. Score 1 if 2 correct.
- TR-5.2 (rule): When `window.matchMedia('(prefers-reduced-motion: reduce)')` matches, all transition durations are `0s` on sheet classes.
  Evidence: Vitest assertion on rendered className includes `motion-reduce:duration-0`; media mock for reduced motion.

---

## Task 6: Accessibility dialog semantics + aria-live announcements + focus return

**Status:** pending
**Priority:** high
**ACs covered:** AC-9 (rule)
**Scope:**

1. Mobile sheet `<section>` adds:
   - `role="dialog"` (already exists on desktop section, keep consistent)
   - `aria-modal="true"` (MOBILE ONLY because desktop drawer is non-blocking)
   - `aria-labelledby={titleId}` (same as desktop)
   - Add `aria-describedby` pointing to subtitle if present
2. Add a visually-hidden `aria-live="polite"` region inside the modal wrapper. Contents:
   - "Tender details sheet opened" on open
   - "Sheet minimized, tap the title bar to expand" when minimizeModal fires
   - "Sheet expanded to full height" on maximize
   - "Sheet closed" on close
3. Focus return: capture `document.activeElement` BEFORE open into a `useRef<HTMLElement | null>` (the opener button, e.g. TenderBoardListItem's Book/Enquiry/Details). On close, after `CLOSE_ANIMATION_MS` fires, call `capturedOpenerRef.current?.focus()`. Desktop already has `closeButtonRef.current?.focus()` on open — keep that, add focus return on close to both morphologies.
4. Backdrop tap on mobile → Minimize (not Exit): per FR-5. Wire backdrop `onMouseDown = (e) => { if (e.target === backdrop) minimizeModal(); }`.

**Task-local TRs:**

- TR-6.1 (rule): Mobile sheet section has `aria-modal="true"` AND `role="dialog"`. Desktop drawer does NOT have `aria-modal` (non-blocking).
- TR-6.2 (rule): Live region contains the expected text after each state transition.
- TR-6.3 (rule): Close sheet → focus() method called on the opener button element that was stored in ref (spy mock via vitest fn).
- TR-6.4 (rule): Click backdrop (outside sheet) on mobile → `minimizeModal` called (not `closeModal`).

---

## Task 7: Tender board subcomponents — responsive hardening & touch targets

**Status:** pending
**Priority:** high
**ACs covered:** AC-7 (rubric)
**Read paths:**

- [TenderBoardListItem.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/tender-board/TenderBoardListItem.tsx) lines 47–72 (CTAs)
- [TenderBoardFilters.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/tender-board/TenderBoardFilters.tsx) lines 31–79 (grid)
- [TenderBoardLeadForm.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/tender-board/TenderBoardLeadForm.tsx) (leadKind tab toggles + region/county section)

**Scope:**

1. **ListItem CTAs:** Current 3-CTA vertical stack on mobile (`flex-col gap-2 sm:flex-row`). Enforce `min-h-11 min-w-0` on each; add `w-full sm:w-auto` so they fill width on mobile. Ensure overall item has no horizontal overflow when rendered at 375px.
2. **Filters:** Current `md:grid-cols-[minmax(0,1fr)_180px_180px_auto]` — mobile default already single-column (falls back to 1-col grid). Add `min-h-11` to the submit button; ensure selects/inputs have `min-h-11` (currently inherit from `inputClass` — inspect `constants.ts` and bump if < 44px).
3. **LeadForm inside sheet:**
   - leadKind tabs (Enquiry / Booking) → ensure 44px tall touchable with `min-h-11` on each tab, wrap to 2 rows on 375px only if label truncation acceptable, otherwise side-scroll chip row (overflow-x-auto).
   - RegionCountiesFormSection inside 393px viewport → collapse its two-column layout to single column (`grid gap-5 md:grid-cols-2` already exists? inspect and add if not).
   - password + password_confirmation fields already `type=password`; ensure `min-h-11` height classes present.
4. **TenderBoardBookingFields:** Same touch target audit for date/time slot pickers.

**Task-local TRs:**

- TR-7.1 (rule): Every `<button>` and `<a>` in tender-board/ folder + TenderBoardClient that is interactive on mobile contains `min-h-11` or inline style with height ≥44px (allowlist `<button>` that are purely icon-X remove chips in StandaloneMultiSelect are 36px because they're in a list — that's acceptable WCAG exception for inline dismiss controls within a 48px combobox wrapper; document why).
- TR-7.2 (rule): On viewport width=375px (iPhone SE), `document.body.scrollWidth === 375` (no horizontal overflow) when rendering filters + 1 list item + opened sheet in DOM.
- TR-7.3 (rubric 0–2, pass ≥ 1): Form layout inside 393px-wide sheet — region/county stacked single column, tabs fit without horizontal truncation; score 2 if both fit, score 1 if region/county stacked but tabs horizontal scroll minor.

---

## Task 8: Payload equivalence mobile vs desktop

**Status:** pending
**Priority:** high
**ACs covered:** AC-10 (rule)
**Read paths:**

- [TenderBoardHalfScreenContent.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/tender-board/TenderBoardHalfScreenContent.tsx) submitLead lines ~225–344
- tenders.ts, bookings.ts, enquiries.ts contracts (from regions-counties task)

**Scope:**

1. Vitest integration test that sets up same mock form input twice:
   - Case A: `window.innerWidth = 1024` (desktop drawer)
   - Case B: `window.innerWidth = 393` (mobile sheet)
2. For each case: simulate user input for (a) sendTenderLead enquiry, (b) createPublicBooking booking, capture fetch POST body.
3. Assert `JSON.stringify(bodyCaseA.enquiryPayload) === JSON.stringify(bodyCaseB.enquiryPayload)` byte-identical for the data fields (allow per-request recaptchaToken to differ by excluding that key from comparison).

**Task-local TRs:**

- TR-8.1 (rule): For sendTenderLead: `tenderPreferences.regions`, `tenderPreferences.counties`, `firstName`, `lastName`, `email`, `phone`, `companyName`, `preferredContactMethod`, `message`, `source`, `tenderId` are all identical between mobile and desktop submissions.
- TR-8.2 (rule): For createPublicBooking: `intake.serviceInterest`, `intake.currentStage`, `intake.message`, `intake.regions`, `intake.counties` + user fields all match byte-for-byte.

---

## Task 9: Responsive device test suite x4 + snapshot of rendered outputs

**Status:** pending
**Priority:** medium
**ACs covered:** AC-7 rubric (4 devices) + aggregate all other TRs
**Scope:**

1. New test files (aggregate):
   - `src/context/HalfScreenModalContext.mobile.test.tsx` — Tasks 1, 2 context tests
   - `src/components/site/HalfScreenModal.mobile.test.tsx` — Tasks 3, 4, 5, 6 morphology, animations, a11y tests on both mobile+desktop branches
   - `src/components/site/TenderBoardClient.mobile.test.tsx` — Tasks 7, 8 responsive viewport x4 + payload equivalence
2. Device viewport simulation helper: `function simulateViewport(width: number, height: number, cb: () => void)` that stubs `window.innerWidth/innerHeight`, dispatches resize event (for Task 2 media hook change listener to fire), runs cb, restores values.
3. Test each of (375, 393, 412, 768) widths for:
   - Morphology (bottom-sheet or drawer) correct for breakpoint
   - No horizontal scroll: `document.body.scrollWidth <= width`
   - Header Minimize + Exit buttons present on 375/393/412; absent on 768 (desktop uses icon-only expand/close)
   - Payload submission captured at 393 vs 768 produces identical form values
4. Build verification: `npx tsc --noEmit` and `npm run build` exit 0.

**Task-local TRs:**

- TR-9.1 (rule): All individual TRs from tasks 1–8 pass (aggregator rule).
- TR-9.2 (rubric, 0–4, pass ≥ 3): 4 device widths. Score 1 pt per device with NO horizontal scroll + correct morphology. Score ≥ 3 means ≤ 1 minor device truncation to fix.
- TR-9.3 (rule): `npx tsc --noEmit` exit 0 + `npm run build` exit 0 + routes generated matches baseline (68).
