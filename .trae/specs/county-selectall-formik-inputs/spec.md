# Specification: County Select-All, ODF Standalone Inputs Port, Formik Integration

## Problem

1. **Missing counties Select-All**: The regions multi-select in [RegionCountiesFormSection.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/standalone-inputs/RegionCountiesFormSection.tsx) has a 1-click "Select all regions" shortcut via `headerAction`, but the paired counties multi-select has no equivalent action. Users targeting entire regions (e.g., 22 Scottish lieutenancies or 52 English ceremonial counties) must click 20–50 individual county chips instead of one click.
2. **Inconsistent input primitives**: [TenderBoardLeadForm.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/tender-board/TenderBoardLeadForm.tsx) uses 12 raw HTML `<input>`/`<select>`/`<textarea>` with a plain `inputClass` string constant. The RegionCountiesFormSection already uses ported-from-ODF `StandaloneMultiSelect` widgets; the rest of the form diverges from the standardized standalone-input pattern the user explicitly sourced from ODF.fe in the prior regions-counties task: `d:\nobs1\Documents\ODF.fe\src\features\dashboard\settings\_components\settings-tabs\_components\half-page-modals\_components\standalone-inputs\`.
3. **No form state/validation framework**: All tender/enquiry/booking forms currently use ad-hoc `useState` + `setForm(prev => ({ ... prev, field: event.target.value }))` with validation scattered in submit handlers (password length/match, required fields). The user has requested Formik to formalize state, touched/dirty tracking, and validation schema binding.

## Users

- **Sales ops filling forms via mobile bottom-sheet**: Select-All counties dramatically reduces taps for national coverage campaigns.
- **Care Atlas product team**: Having ONE canonical set of input primitives (port of ODF StandaloneInputs) used across both lead capture contexts — standalone pages (CareAtlasContactForm/LeadForm/BookingPanel) AND tender board drawer/sheet (TenderBoardLeadForm) — reduces maintenance surface, and allows any future ODF standalone-input fixes to be cleanly backported to care-atlas.fe by simple file-copy.
- **Developers building future tender board variants**: Formik + typed schemas means add-a-field = add 1 Formik.Field + schema line, not copy/paste of useState setter + onChange.
- **Backend contract consumers**: Input standardization eliminates HTML-value drift (e.g., `select` native stringifying a number code, or `phone` whitespace accidentally committed because there's no normalization).

## Goals

1. **Add Select/Unselect all counties headerAction** to the counties `StandaloneMultiSelect` inside `RegionCountiesFormSection` — mirrors the existing regions Select-All in appearance (toggle button with counter, same class names) and in semantics:
   - If every currently-visible county is selected → "Unselect all counties" (count = N/N)
   - If fewer than all visible → "Select all counties in selected regions" (count = M/N)
   - Counties are only ever drawn from `countyOptions` (which is filtered by selectedRegions) so Select-All counties never bleeds across regions.
2. **Port remaining 6 ODF standalone input siblings** to care-atlas.fe:
   - `StandaloneTextInput`
   - `StandaloneEmailInput`
   - `StandaloneTextArea`
   - `StandaloneDropDown`
   - (Plus less-used siblings `StandaloneMultiSelectCheckbox` and `StandaloneTagInput` — optional, shipped so the barrel is complete and parity with ODF index.ts barrel exports is 1:1 identical)
3. **Replace every non-RegionCountiesFormSection input in TenderBoardLeadForm** with the ported standalone components: name/email/phone/whatsapp/company/address × 6/password × 2/message/notes → StandaloneTextInput, StandaloneEmailInput, StandaloneTextArea; preferredContactMethod select → StandaloneDropDown.
4. **Install Formik** (v2.4.x per ODF lockfile `^2.4.6`) into care-atlas.fe with **typed schemas** for TenderBoardForm types, and integrate it into the TenderBoardLeadForm so `form` values flow from Formik `useFormik<TenderBoardForm>()` instead of local `useState`, with a Yup schema enforcing required/min-length/password-match/password-min-8/email validations that are currently handled imperatively at submit.
5. **Full barrel parity** — after port, `src/components/site/standalone-inputs/index.ts` exports exactly the same set as ODF barrel index.ts lines 2–8 + types, so a team developer swapping between the two repos sees identical component naming and no "is X available?" mental overhead.

## Non-Goals

- **NOT** refactoring `CareAtlasContactForm`, `LeadForm`, or `BookingPanel` standalone pages to use Formik or the new standalone input primitives this iteration. Scope is **TenderBoardLeadForm.tsx** only (the form explicitly named by the user in "replace the existing form inputs that are not RegionCountiesFormSection"). The other 3 standalone enquiry/booking forms remain untouched per scope.
- **NOT** installing additional libs beyond Formik and Yup. Validation is Yup (the ecosystem standard Formik pair) not Zod/custom. No react-hook-form migration — Formik is explicitly requested ("please install formic [sic] onto the forms").
- **NOT** adding cross-field validation beyond what currently exists: password min 8 chars + password matches confirmation, required fields (name, email, phone, line1, city, postcode, message, consent), message min 10 chars.
- **NOT** altering RegionCountiesFormSection region Select-All or county orphan-prune logic (they already work correctly per spec AC-3.3/3.4 from prior session).
- **NOT** adding lucide-react as a dependency. ODF standalone-inputs currently import icons from `lucide-react` (Plus/Minus/AlertCircle); care-atlas.fe already has `SiteIcon` central registry pattern from project_memory. The ported components must map lucide icon names to the equivalent `SiteIcon` names from `SiteIcon.tsx`, and import NO icon libraries (preserves project convention of centralized icons).

## Functional Requirements

FR-1. **Counties Select-All toggle**:

- In `RegionCountiesFormSection.tsx` counties `StandaloneMultiSelect.headerAction` prop render a button identical to regions Select-All.
- Toggling "Select all counties" adds every county in `countyOptions` to `selectedCounties` (deduped).
- Toggling "Unselect all counties" empties `selectedCounties` completely (same as regions behavior).
- Counter = `{selectedCounties.length}/{countyOptions.length}`.
- Button DISABLED (visually opacity-50, no pointer events) when `countyOptions.length === 0` (zero visible counties because zero regions selected) — with tooltip/disabled label "No counties available".
- Select-All counties does NOT change selectedRegions — it only acts within the current visible countyOptions (per requirement: "select all available counties", available = currently filtered countyOptions = intersection with selectedRegions).

FR-2. **Port Standalone Text/Email/TextArea/DropDown to care-atlas.fe**:

- All ports: same Props interface, same label uppercase-xs CSS pattern, same border-red-500 error state with AlertCircle icon, same aria-invalid + aria-describedby error wiring, same flex-col/flex-grow/gap-2 wrapper.
- ODF-specific `font-neue` class + `dark:*` color classes removed or mapped to neutral care-atlas equivalents (no dark mode configured yet, so dark classes are no-ops — safe to keep as dead code for future dark-mode parity).
- **Icon mapping**: lucide-react imports → `SiteIcon` imports as follows:
  - `Plus` → existing `SiteIcon` key `plus` (add icon to SiteIcon if missing)
  - `Minus` → `minus` (add if missing)
  - `AlertCircle` → `alertCircle` (add if missing)
- `StandaloneDropDown` replaces ODF `next/image` import with care-atlas `img` inline-eslint disable pattern (same as ported StandaloneMultiSelect).
- All standalone components continue to NOT require Formik (hence the ODF filename prefix "Standalone"). They accept the same controlled `value/onChange(error?)` signature and can be wrapped by Formik `<Field as={}>` helper OR Formik `useField()` hook OR used standalone.

FR-3. **TenderBoardLeadForm input refactor to standalone primitives**:

- Replace 12 raw `<input>`, 1 native `<select>`, 2 raw `<textarea>` with:
  - StandaloneTextInput × 10: name, phone, whatsapp, company, line1, line2, city, county (postal), postcode, password, passwordConfirmation (11 fields — note password type field = text input with type prop)
  - StandaloneEmailInput × 1: email
  - StandaloneTextArea × 2: message, tenderPreferenceNotes
  - StandaloneDropDown × 1: preferredContactMethod (options = email/phone/whatsapp, Option code + name pairs)
- Hidden honeypot `website` input stays as raw `<input className="hidden">` because Standalone\* pattern would expose a visible label; it's anti-spam and deliberately hidden.
- Consent checkbox stays as native checkbox because ODF has no StandaloneCheckbox yet (no parity loss; documented as exception).
- All forms use `min-h-11` pattern preserved (existing touch-target compliance from mobile-optimization task).

FR-4. **Formik installation and TenderBoardLeadForm integration**:

- Install `formik@^2.4.6` + `yup@^1.6.1` (matches ODF.fe package.json versions; ^2.4.6 compatible with React 19 since Formik supports React >=16.8).
- New form file `src/components/site/tender-board/tenderLeadFormSchema.ts` exporting:
  - `TenderBoardFormYup: ObjectSchema<TenderBoardForm>` — typed Yup schema validating existing rules:
    - name/email/phone/line1/city/postcode/message: required
    - email: valid email format
    - password: optional string, but if present ≥ 8 chars
    - passwordConfirmation: must match password, present if password present
    - message: minLength 10
    - consent: required boolean `true`
    - all other fields: string optional
- `TenderBoardHalfScreenContent` (parent of TenderBoardLeadForm) currently holds all `form` state via `useState(emptyTenderBoardForm)` AND the submit handler. It must migrate the form state from `useState` → `const formik = useFormik<TenderBoardForm>({ initialValues, validationSchema: TenderBoardFormYup, onSubmit: (values) => submitLeadWithValues(values) })`.
- `formik` object (or its destructured values/handleChange/handleSubmit/errors/touched) is passed INTO `TenderBoardLeadForm` via props. Props interface of TenderBoardLeadForm changes from `form + setForm` to `formik: FormikProps<TenderBoardForm>` plus any additional fields currently not managed by Formik (selectedRegions, selectedCounties, booking slots, notice, error, submitting etc. remain as props).
- Submission flow: clicking submit button → formik.handleSubmit → Yup validation runs → if invalid → first error field auto-focused via formik; if valid → proceeds to existing `submitLead` payload builder with formik.values.
- **Payload parity rule**: formik.values serialized to sendTenderLead / createPublicBooking JSON must be byte-identical to pre-Formik values. No key renaming, no string casing changes, no type coercion of any field; the same fields flow through `submitLead` as before.

FR-5. **RegionCountiesFormSection Formik-ready wrapper (optional but recommended)**: Provide a thin helper component or plain prop mapping so `selectedRegions/selectedCounties` can be driven via Formik field arrays if desired. Fallback to existing non-Formik props kept so standalone usages (CareAtlasContactForm/LeadForm/BookingPanel) don't break.

## Non-Functional Requirements

NFR-1. **Icon registry**: All `SiteIcon` names required by ported inputs (`plus`, `minus`, `alertCircle`) must exist; add them to `SiteIcon.tsx` if missing by mirroring the SVG path pattern of existing similar icons. Never import lucide-react directly.
NFR-2. **TypeScript strict clean**: `npx tsc --noEmit` exit 0 after changes. All Props interfaces exported so downstream consumers may import them.
NFR-3. **No ODF cross-repo imports**: Every standalone component file is a local copy inside `src/components/site/standalone-inputs/` folder; no `../../../../ODF.fe/...` relative imports.
NFR-4. **SSR hydration safe**: Formik `useFormik` + `useField` work in client components (`'use client'` already at top of all affected files). No server-rendered form state.
NFR-5. **Zero test regressions**: existing 20 Vitest tests (6 test files) must continue passing after all changes; new tests must be added for the counties Select-All toggle behavior and the TenderBoardLeadForm formik validation schema error surface.

## Constraints & Dependencies

- `formik@^2.4.6` + `yup@^1.6.1` versions pegged to match ODF.fe's package.json versions (from `d:\nobs1\Documents\ODF.fe\package.json` lines 42,45,58).
- ODF StandaloneDropDown uses `type Option = @/core/types` import — care-atlas uses the local `utils/types.ts` Option type already. Map ODF import to local types.
- care-atlas already has colorUtils.ts + types.ts under standalone-inputs/utils/ from prior port — no need to copy them again, they're reused.
- barrel parity: `src/components/site/standalone-inputs/index.ts` must match ODF barrel lines 2–8 order & naming; current barrel exports StandaloneMultiSelect + RegionCountiesFormSection + types — extend the barrel with the 6 new ports in same order as ODF.
- Project constraint from prior sessions: password inputs must retain `type="password"` `autoComplete="new-password"` + min 8 char rule.

## Assumptions (Open Questions resolved without user input)

**Assumption 1:** "Select all available counties" means all counties currently in filtered countyOptions = all counties in user-selected regions. It does NOT mean select-all-103-counties-in-the-UK regardless of region selection — that would violate the prior task's strict region→county linkage rule and cause invalid code→region references.

**Assumption 2:** Formik installation scope is explicitly `TenderBoardLeadForm.tsx` and its immediate parent `TenderBoardHalfScreenContent`. The user wrote "please install formic onto the forms within the care atlas website" — the tender board enquiry+booking form is the canonical form referenced by the immediately-preceding "inputs in TenderBoardLeadForm.tsx replace..." requirement. Extending Formik to CareAtlasContactForm/LeadForm/BookingPanel would be 3x additional work out of scope for this task.

**Assumption 3:** "Transferred components operate without conflicts" means: ported components' wrappers must output label + input + error DOM aligned to existing care-atlas spacing (gap-2/3 used elsewhere in TenderBoardLeadForm, not ODF's gap-2 only). Minor spacing adjustments like changing `className` prop defaults are acceptable if needed to match current form layout vertical rhythm.

---

## Acceptance Criteria

**AC-1 (rule):** Counties Select-All headerAction button renders inside the counties StandaloneMultiSelect when `countyOptions.length > 0`; displays "Select all counties in selected regions" (counter M/N) OR "Unselect all counties" (N/N) when all visible selected.
Evidence: Vitest render at [RegionCountiesFormSection.test.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/standalone-inputs/RegionCountiesFormSection.test.tsx) with 2 regions + 10 counties → assert Select-all-counties button with counter present.

**AC-2 (rule):** Clicking counties Select-All adds every county in countyOptions to selectedCounties; second click deselects all; intermediate manual additions register in counter correctly; and the change correctly triggers onCountiesChange(newCodesArray) with length verified.
Evidence: Vitest user-event clicks → assert array lengths exactly equal to countyOptions.length, then 0, then M (partial) after intermediate.

**AC-3 (rule):** Ported 6 standalone components (StandaloneTextInput, StandaloneEmailInput, StandaloneTextArea, StandaloneDropDown, + optional parity StandaloneMultiSelectCheckbox, StandaloneTagInput) all exist as standalone .tsx files in care-atlas.fe `src/components/site/standalone-inputs/` and barrel index.ts exports all 7 components in order matching ODF.
Evidence: `Glob` output showing files exist; Vitest smoke test rendering each with minimal props and checking label rendered + onChange fires.

**AC-4 (rule):** Every non-RegionCountiesFormSection input in TenderBoardLeadForm uses one of the ported standalone primitives (StandaloneTextInput × passwords etc., StandaloneEmailInput for email, StandaloneTextArea × messages, StandaloneDropDown for preferredContactMethod). Raw `<input>`, `<select>`, `<textarea>` (except the honeypot website hidden input + consent checkbox which are documented exceptions) are not present.
Evidence: Vitest render TenderBoardLeadForm → `queryAllByRole('textbox')` and `queryByRole('combobox', {name: 'Preferred contact method'})` have the standalone wrapper classnames; grep of raw non-exception `<input>` count ≤ 2 (checkbox + honeypot).

**AC-5 (rule):** Formik installed into package.json, Yup schema `TenderBoardFormYup` exported from tenderLeadFormSchema.ts, and TenderBoardHalfScreenContent drives form state via `useFormik<TenderBoardForm>({initialValues, validationSchema, onSubmit})` — no `useState(emptyTenderBoardForm)` for those 14 fields remaining (selectedRegions/selectedCounties still useState per design because they're compound widgets, not single Formik fields).
Evidence: grep shows no `setForm(current => ({...current, email: …}))` patterns remain in TenderBoardHalfScreenContent; `npm ls formik yup` shows both packages in dependency tree after install.

**AC-6 (rule):** Payload parity — submitLead with same formik.values input produces EXACT same JSON.stringified body for both sendTenderLead enquiry and createPublicBooking booking routes as pre-Formik submission (excluding the dynamic recaptchaToken which is always new per request).
Evidence: Vitest snapshot compare `JSON.stringify(body, Object.keys(body).sort())` minus recaptcha token — pre-change snapshot (hardcoded) matches post-change new submission with identical values.

**AC-7 (rule):** Yup validation enforces the existing rules without needing submit-handler imperative checks. Specifically: name/email/phone/line1/city/postcode/message required; password≥8 if present; passwordConfirmation matches if password present; message length≥10; consent true. Submitting invalid form focuses first error field, does NOT call submitLead.
Evidence: Vitest test submitting all-empty form → assertion submitLead spy calls === 0; then errors.touched object has 8 required fields; populate name/email/phone/line1/city/postcode but password '123' and confirmation '456' → errors.passwordConfirmation = match error.

**AC-8 (rubric 0–5, pass ≥ 4):** Code port quality score. Score on 5 dimensions, one point each:

1. No `lucide-react` imports anywhere in care-atlas standalone-inputs folder (icons come via SiteIcon).
2. No `next/image` import in DropDown (uses `img` with eslint-disable, matches StandaloneMultiSelect pattern).
3. Props interfaces of each ported component are supersets of ODF original with identical typing (no fields removed).
4. TenderBoardLeadForm retains EXACT same field order (name→email→phone→whatsapp→preferredContact→booking→company→regionCounties→address→passwords→messages→consent) as current code (UX consistency).
5. All error messages render with proper `aria-live="polite"` + `id={name}-error` + `aria-describedby` linking (WCAG identical to ODF originals).
   Evidence: Static audit + per-component smoke tests.

**AC-9 (rule, E2E-ish user scenario):** Full county select-all workflow test:

1. User selects 2 regions (e.g., NW + WM) → counties dropdown shows only NW+WM counties.
2. User clicks "Select all counties" → selectedCounties.length === countyOptions.length exactly (not 103).
3. User deselects one county manually → counter shows N-1/N.
4. User clicks "Unselect all counties" → selectedCounties.length === 0.
5. User clicks send enquiry with regions + counties populated → fetch body sendTenderLead has both `tenderPreferences.regions` and `tenderPreferences.counties` arrays with correct code strings.
   Evidence: Vitest integration test rendering HalfScreenModalProvider + TenderBoardHalfScreenContent + selectedTender mock populated, triggering each step in sequence via fireEvent + user-event.
