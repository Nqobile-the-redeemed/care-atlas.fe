# Specification: Tender Board Mobile Optimization — Bottom-Sheet Modal & Responsive Hardening

## Problem

The Care Atlas tender board experience was designed for desktop and works poorly on mobile viewports:

1. The existing `HalfScreenModal` (right-side horizontal drawer) uses `translate-x-full / translate-x-0` and anchors to `right-0 top: var(--site-header-height)`. On narrow viewports (<768px) this produces a horizontally-cramped 100vw drawer that still competes with the underlying listing for horizontal space, has no visual affordance of the tender board beneath, and the desktop-style "expand/minimize/close" icon-only header buttons are small touch targets.
2. The tender list `TenderBoardListItem` already has mobile flex-wrap rows but the CTA buttons (Book/Enquiry/Details) collapse to a 3-button vertical stack that is 3× screen-height expensive; no affordance for quick-dismiss or peak-at-underlying-list while mid-form.
3. No device-viewport testing exists for the tender workspace flow (open → fill form → submit booking/enquiry). Modal dismissal, `aria-modal`/focus trap, screen-reader narration of sheet state, and touch targets ≥44px are not verified.
4. Animation is hardcoded to 300ms horizontal ease-out. Mobile users expect bottom-up sheet motion (iOS/Android Material sheet conventions). There is no "minimize to a peek state" intermediate level, which the user's req #2 explicitly requires.
5. `HalfScreenModalContext` currently has no `minimize`/`maximize`/`snapLevel` APIs and `isExpanded` is local UI state inside the desktop drawer — mobile sheet state (peek 0% → expanded 85% → minimized/peek 10% → closed 100%) cannot be driven externally or announced to accessibility tree.

## Users

- Mobile users (iPhone SE 375×667, iPhone 14 Pro 393×852, Pixel 8 412×915, iPad Mini 768×1024) browsing the tender board at `/tenders`.
- Existing desktop users whose experience must not regress (right-side drawer must be preserved unchanged at `md:` and above breakpoints).
- Screen reader users (VoiceOver on iOS Safari, TalkBack on Chrome Android) who require announcements for sheet expand/minimize/close transitions and dialog role semantics.
- Care Atlas ops teams reviewing tender enquiries/bookings — any payload contract change from the mobile flow must remain byte-for-byte identical to the desktop form submission; no new fields or altered serialization.

## Goals

1. **Bottom-sheet modal for mobile tender workspace.** Replace the horizontal drawer on viewports narrower than the Tailwind default `md:` breakpoint (768px) with an interactive bottom sheet that animates upward from the viewport bottom edge, peaking at `85dvh` height so the top 15% of the underlying tender listing remains visible and scrollable (non-blocking underlying list interaction — same philosophy as current non-blocking desktop drawer, but vertical instead of horizontal layout).
2. **Prominent Minimize + Exit buttons inside the mobile sheet header.** Minimize = snap to a small peeking state (~8vh tall with title only, swipable back up); Exit = dismiss the sheet entirely. Both buttons must be text+icon (not icon-only) with ≥44px touch targets. Desktop md:+ continues to use icon-only expand/close unchanged.
3. **Full responsive test coverage.** Implement Vitest jsdom unit tests for 4 canonical mobile device viewports (iPhone SE 375, iPhone 14 Pro 393, Pixel 8 412, iPad Mini 768) verifying that: sheet renders instead of horizontal drawer on <768px, horizontal drawer renders on ≥768px, minimized state reduces height, all 5 tender list item CTA buttons meet touch targets, region/county multi-select comboboxes are operable, and form submission payload matches desktop contract.
4. **Smooth transition animations.** 3 discrete transitions using CSS transitions (no new animation libs): (a) sheet entry from `translate-y-full` → `translate-y-[15%]` (i.e. sheet top = 15vh), 350ms cubic-bezier(0.22,1,0.36,1); (b) minimize from 85dvh → 8dvh peek via height/duration 300ms ease-in-out; (c) exit/dismiss via `translate-y-full` at 250ms (quicker exit than entry per WCAG reduced-motion fallback).
5. **Accessibility compliance.** (a) All interactive sheet controls ≥44px×44px touch targets; (b) sheet announces `role="dialog"` with `aria-modal="true"` on mobile; (c) minimize/close state announced via `aria-live="polite"` region; (d) Escape key closes sheet (already exists on desktop); (e) focus management: open → focus minimize button, minimize → focus sheet title, close → restore focus to the tender-card CTA that opened it.

## Non-Goals

- **NOT** redesigning the tender listing card layout `TenderBoardListItem`'s 3-CTA vertical stack layout beyond adding min-h-11 touch-target guard and responsive wrappers; user scope is specifically the mobile tender board subcomponents (i.e. the opened workspace modal) and its form subcomponents.
- **NOT** introducing gesture libraries (react-spring, framer-motion, use-gesture, @react-spring/web). Animations are pure CSS `transition` / `transform` + Tailwind classes; optional touch drag-to-dismiss can be implemented with a thin 10–15 line onTouchStart/Move/End handler if time permits, but is not a hard requirement.
- **NOT** changing the tender list responsive breakpoints, filters bar responsiveness, or the standalone `CareAtlasContactForm` / `LeadForm` / `BookingPanel` pages. Scope is strictly the tender board page (`/tenders`) and its open-drawer subcomponents: `HalfScreenModal`, `TenderBoardHalfScreenContent`, `TenderBoardLeadForm`, `TenderBoardSelectedTenderPanel`, `TenderBoardFilters`, `TenderBoardListItem`.
- **NOT** adding back-button history routing / deep-linking for the modal state (nice-to-have but out of scope).
- **NOT** altering `HalfScreenModalContext` API shape beyond additions; existing `openModal`/`closeModal` callers must compile and behave identically post-change.

## Functional Requirements

FR-1. **Viewport-conditional modal morphology.** `HalfScreenModal` must choose between (a) right-side horizontal drawer desktop layout (`md:` ≥768px) identical to current behavior, vs (b) bottom-sheet vertical modal layout on mobile (<768px). Detection via window.matchMedia `(min-width: 768px)` with live listener; SSR-safe (returns null on server, uses useEffect to hydrate after mount — same pattern as existing codebase elsewhere).
FR-2. **85dvh max height with 15% listing visible.** On mobile: sheet's top edge sits at 15vh from the top of the visual viewport, achieved via `transform: translateY(15vh)` combined with `height: 85dvh`, `left-0 right-0 bottom-0` positioning. Backdrop is **not full-opaque black** — use a 30% opacity dark backdrop so the tender list below remains visually visible, matching the non-blocking desktop philosophy.
FR-3. **Minimize → peek 8vh.** Add state `sheetSnap: 'expanded' | 'minimized' | 'closed'` to `HalfScreenModalContext` (defaults to 'expanded' when opening on mobile; desktop `isExpanded` remains its own independent state). Clicking "Minimize" transitions sheet to 8dvh height: a thin grab bar + title chip is visible. Clicking/tapping the minimized peek chip re-expands it. Minimize does not fire `closeModal` — data, selected tender, and form progress are retained.
FR-4. **Exit closes sheet unconditionally.** Click Exit button → animate translate-y-full 250ms → then call `closeModal` so template and data are nulled after the animation (preserving current CLOSE_ANIMATION_MS pattern).
FR-5. **Backdrop tap behavior.** On mobile: tapping the 15%-viewport-top uncovered area OR tapping the 30% transparent backdrop performs **Minimize** (not Exit), because it's the common gesture for "let me look at the next tender card quickly without losing my form state". Exit is only reachable via the explicit Exit text button.
FR-6. **Content scroll independence.** Mobile sheet interior scrolls independently of the underlying page via `overflow-y-auto` within the flex-1 content region, same as desktop. Document scroll on the tender listing is NOT locked when the sheet is open (non-blocking design).
FR-7. **Header text+icon Minimize and Exit controls (mobile only).** Mobile sheet header has two labeled buttons: `[icon] Minimize` (left-aligned, before the title text? No — right header row after expand/close as per desktop) — actually: mobile header is **reflowed**: title left, right button cluster has (a) explicit "Minimize" text+chevron-down button (desktop has icon-only expand), (b) explicit "Exit" text+close button. On md:+ revert to existing icon-only controls without modification.
FR-8. **`HalfScreenModalContext` new exports.** `minimizeModal(): void`, `maximizeModal(): void`, `sheetSnap: 'expanded' | 'minimized' | 'closed' | null` (null on desktop / modal closed). Existing exports (`openModal`, `closeModal`, `updateModalData`, `setModalWidth`) remain with identical signatures.

## Non-Functional Requirements

NFR-1. **No new runtime dependencies.** Animations = pure CSS `transition` + transform via Tailwind classes. Touch handling (if implemented) = native React TouchEvent handlers only.
NFR-2. **No performance regression on desktop.** At ≥md breakpoint, the component must render with 0% code-path difference from pre-change behavior (no bottom-sheet computations, no matchMedia listeners running on desktop).
NFR-3. **WCAG 2.2 AA targets met.** Touch targets 44px (NEN 44×44 at minimum), contrast ratios ≥4.5:1 for text buttons, `prefers-reduced-motion` media query respected by removing transforms and using instant 0-duration when user has requested reduced motion.
NFR-4. **SSR hydration safety.** All matchMedia/innerWidth logic must be inside `useEffect` with `useRef` first-ssr-render detection pattern identical to the site header (per project_memory `--site-header-height` CSS var convention).
NFR-5. **Form payload byte-identical.** Mobile tender board booking/enquiry submission produces JSON payloads that serialize to the exact same keys/values as desktop submission (compare vitest snapshots of submit body).

## Constraints & Dependencies

- Tailwind 4.0 default breakpoints (sm=640, md=768, lg=1024). Mobile/desktop split at 768px (`md:`) is the canonical cut-off used elsewhere in the codebase; do not invent custom 640px breakpoint.
- Animation timing reference: existing `CLOSE_ANIMATION_MS = 300` in `HalfScreenModalContext.tsx:41`. Mobile entry 350ms / minimize 300ms / exit 250ms are close enough to reuse existing timeout patterns without code churn.
- Dependencies: `useHalfScreenModal` hook is currently consumed by `TenderBoardClient.tsx:18`. New context exports (minimizeModal/maximizeModal/sheetSnap) must not break existing TS typing of the hook — all new fields are optional or have defaults so callers that don't destructure still compile.
- Existing project constraint (per project_memory): components anchored below header must use `top: var(--site-header-height)`. Desktop drawer still observes this. Mobile sheet intentionally anchors from the BOTTOM (bottom-0) and does NOT apply the site-header variable to its top because its top is governed by `translateY(15vh)` + 85dvh height.

## Open Questions (None — assumptions applied below)

**Assumption 1 (re: Minimize semantics):** User's "Minimize" means collapse to a peek state that preserves form state (not minimize=close). If user meant "close" — the explicit Exit button covers that, so we ship both.
**Assumption 2 (re: 85% height):** Of the visual viewport, not including the site header. The 85dvh measurement is from the bottom of the viewport upward; top of sheet is at `100% - 85dvh = 15vh` measured against the visual viewport, which naturally clears the site header (because site header is ~72px and 15vh on a 667px iPhone SE = ~100px which is ≥72px). No additional adjustment needed.
**Assumption 3 (re: form subcomponents):** "Tender board subcomponents" = `TenderBoardLeadForm` + `TenderBoardBookingFields` + `RegionCountiesFormSection` inside the opened workspace modal — those need to have their internal controls (StandaloneMultiSelect inputs, tabs, buttons) audited for min-44px touch targets, responsive layout, and correct behavior inside a 393px-wide viewport.

---

## Acceptance Criteria

**AC-1 (rule):** On viewport width < 768px, when `openTenderWorkspace` is called the tender workspace is rendered as a bottom-anchored sheet with `height: 85dvh` and underlying tender listing content visible in the top 15vh strip + partially through the backdrop.
Evidence: Vitest test with jsdom `window.innerWidth = 393; window.matchMedia = jest (mock)`; assert rendered DOM's sheet element CSS transform includes translateY and fixed bottom-0; desktop drawer `right-0 translate-x-*` classes are absent.

**AC-2 (rule):** On viewport width ≥ 768px, the existing right-side horizontal drawer (`translate-x-full / translate-x-0`, anchored `right-0 top: var(--site-header-height)`) renders exactly as pre-change with zero class-name regressions.
Evidence: Vitest snapshot diff of rendered drawer at 1024px matches baseline pre-change snapshot.

**AC-3 (rule):** Mobile sheet header contains two text+icon buttons labeled "Minimize" and "Exit"; both have computed touch-target box dimensions ≥ 44px × 44px.
Evidence: Vitest `getByRole('button', {name: /minimize/i})` + `getByRole('button', {name: /exit/i})` present; jsdom clientWidth/clientHeight stubbed 48×48 with `min-h-11` class present.

**AC-4 (rule):** Clicking Minimize toggles sheet snap state between expanded (85dvh) and minimized (~8dvh peek) without clearing form fields. Re-clicking the peek state re-expands without data loss.
Evidence: Vitest click Minimize → assert sheet height class changed to peek; form data still in state by simulating a text input change before minimize → after minimize/re-expand text still matches.

**AC-5 (rule):** Clicking Exit closes the sheet with exit animation and clears the modal template+data in the same `CLOSE_ANIMATION_MS` pattern as current desktop close.
Evidence: Vitest click Exit → after 300ms `useHalfScreenModal().template === null && data === null`.

**AC-6 (rule):** Underlying tender list is still scrollable and interactive while sheet is open (mobile + desktop both). Tapping the non-sheet top 15vh area of a mobile screen triggers Minimize, not Exit.
Evidence: Vitest simulate click on the backdrop div (outside sheet) → `sheetSnap === 'minimized'`.

**AC-7 (rubric, scale 0–5, pass ≥ 4):** Responsive layout quality across 4 canonical mobile viewports.
Dimensions to self-audit:

- 375×667 iPhone SE (smallest modern phone, risk: sheet overlaps status bar? no — bottom anchored safe): sheet header title truncates gracefully; 3 CTA buttons don't overflow; password input min 8 char validation still works.
- 393×852 iPhone 14 Pro (reference): RegionCountiesFormSection two-column layout collapses to single column correctly; combobox dropdown popup fits within 393px wide sheet body (no horizontal scroll).
- 412×915 Pixel 8 (Android reference): StandaloneMultiSelect keyboard combobox navigation works; form submit with recaptcha token generated no wider than viewport.
- 768×1024 iPad Mini (transition breakpoint md:): Morphology swaps correctly to desktop horizontal drawer; icon-only expand/close render.
  Score anchors: 5 = all 4 devices pass with zero horizontal scroll; 4 = 1 minor truncation fixable by truncate class (accepted).
  Evidence: Self-report via checklist in tasks.md Task 8 for each of 4 dimensions + vitest test asserting at each width the `document.body.scrollWidth <= viewportWidth` (no horizontal scroll).

**AC-8 (rubric, scale 0–5, pass ≥ 4):** Animation smoothness and WCAG-reduced-motion compliance.
Anchors: 5 = 3 transitions (entry/minimize/exit) all have cubic-bezier easing; reduced-motion media query forces durations=0s. 4 = 2 of 3 correct; missing one transition but no jarring instant snaps on normal motion.
Evidence: CSS class inspection in tests, media-query match mock for `prefers-reduced-motion: reduce`.

**AC-9 (rule):** Accessibility: `role="dialog"` + `aria-modal="true"` on mobile sheet with `aria-labelledby` pointing to h2 title; header buttons labeled by visible text + aria-label; sheet state changes (expanded/minimized) announced via `aria-live="polite"` region; focus returned to opener trigger button on close.
Evidence: Vitest `expect(sheet).toHaveAttribute('role','dialog')` + `expect(ariaLiveRegion.textContent).toContain('minimized')` + focus-returned to opener via `.focus()` mock called.

**AC-10 (rule):** Payload equivalence — a booking or enquiry submitted via mobile-sheet context serializes FormData/JSON body to exact same structure as a desktop drawer submission (same set of keys, same string[]/string types for regions/counties, same password_confirmation serialization).
Evidence: Vitest snapshots of `sendTenderLead`/`createPublicBooking` fetch mock body for identical form input — mobile and desktop renders produce identical JSON.stringified bodies.
