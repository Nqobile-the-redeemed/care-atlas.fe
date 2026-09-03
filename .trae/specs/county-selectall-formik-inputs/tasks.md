# Tasks: County Select-All, ODF Inputs Port, Formik Integration

Implementation queue for County Select-All, Standalone Input Ports, and Formik.
Status default: pending. ACs in parentheses = acceptance criteria each task satisfies.
TR = Test Requirement (rule or rubric) with evidence source.

## Dependency Graph

```
Task 1: SiteIcon icon additions (plus/minus/alertCircle) → prerequisite for all ports
Task 2: npm install formik + yup → prerequisite for schema & integration
Task 3: Port StandaloneTextInput/StandaloneEmailInput → map icons, no lucide-react
  └→ Task 4: Port StandaloneTextArea/StandaloneDropDown → reuse colorUtils/types
  └→ Task 5: Port StandaloneMultiSelectCheckbox/StandaloneTagInput → (barrel parity, optional)
  └→ Task 6: Update standalone-inputs barrel index.ts → barrel parity with ODF (AC-3)
Task 7: Add Select-All counties headerAction to RegionCountiesFormSection → (AC-1, AC-2)
Task 8: Create tenderLeadFormSchema.ts with TenderBoardFormYup → (AC-5, AC-7)
Task 9: Migrate TenderBoardHalfScreenContent to useFormik → pass formik to child
Task 10: Rewrite TenderBoardLeadForm to replace all raw inputs with Standalone + Formik bindings → (AC-4, AC-8)
Task 11: Verify payload parity submitLead with formik.values === pre-change values → (AC-6)
Task 12: Add 3 new test suites + AC-9 workflow integration test → (AC-1,2,7,8,9)
Task 13: Build verification tsc --noEmit, build, vitest all pass → Final gate
```

---

## Task 1: Add missing icons to SiteIcon (plus/minus/alertCircle)

**Status:** pending
**Priority:** high
**ACs covered:** AC-8 dim 1 (no lucide-react imports)
**Read paths:**

- [SiteIcon.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/SiteIcon.tsx) — examine icon registry pattern & SVGs

**Scope:**

1. Add 3 new SiteIconName union members: `'plus'`, `'minus'`, `'alertCircle'`.
2. Add matching SVG paths to the switch/case renderer. Use lucide-react reference SVGs for path d attributes:
   - Plus: `<path d="M5 12h14M12 5v14" strokeLinecap round>` (stroke-based)
   - Minus: `<path d="M5 12h14">`
   - AlertCircle: circle + line x1=x2=M12 8v4, line=M12 16h.01 (stroke-based)
3. SiteIcon renders with 24×24 default viewBox, same as existing icons.

**Task-local TRs:**

- TR-1.1 (rule): `SiteIcon` accepts names `plus`/`minus`/`alertCircle` without TypeScript errors — tsc verifies.
- TR-1.2 (rule): No `import from 'lucide-react'` statements added to care-atlas anywhere (grep assertion).

---

## Task 2: Install formik@2.4.x and yup@1.6.x dependencies

**Status:** pending
**Priority:** high
**ACs covered:** AC-5 (enabler)
**Scope:**

1. Run `npm install formik@^2.4.6 yup@^1.6.1` at project root. Both are runtime deps, not devDeps.
2. Confirm `package.json` lists them in dependencies; `package-lock.json` updates.

**Task-local TRs:**

- TR-2.1 (rule): `npm ls formik yup` exit 0 shows version matches required major.minor: formik 2.4.x, yup 1.6.x.
- TR-2.2 (rule): `npx tsc --noEmit` without type errors after install.

---

## Task 3: Port StandaloneTextInput + StandaloneEmailInput

**Status:** pending
**Priority:** high
**ACs covered:** AC-3, AC-8 dim 1/3/5
**Read paths:**

- ODF originals:
  [StandaloneTextInput.tsx](file:///d:/nobs1/Documents/ODF.fe/src/features/dashboard/settings/_components/settings-tabs/_components/half-page-modals/_components/standalone-inputs/StandaloneTextInput.tsx)
  [StandaloneEmailInput.tsx](file:///d:/nobs1/Documents/ODF.fe/src/features/dashboard/settings/_components/settings-tabs/_components/half-page-modals/_components/standalone-inputs/StandaloneEmailInput.tsx)

**Scope:**

1. Create `src/components/site/standalone-inputs/StandaloneTextInput.tsx` local copy with:
   - lucide-react `Plus`/`Minus`/`AlertCircle` imports → replaced by `<SiteIcon name='plus'>` etc.
   - ODF `'@/core/types'` Option → import from `./utils/types`
   - ODF color tokens `border-gray-mediumGray focus-within:border-blue-duskBlue text-mediumGray bg-gray-100 font-neue dark:*` preserved verbatim (care-atlas accepts them; dead classes do no harm and preserve future backportability)
   - Props interface preserved verbatim (includes `valueType?: 'gbp' | 'percentage' | 'unit'`, numeric increment/decrement logic)
2. StandaloneEmailInput same transformation: `AlertCircle` not used in ODF email input (no icon on error, just text — that's OK).

**Task-local TRs:**

- TR-3.1 (rule): Vitest smoke test renders StandaloneTextInput with name='name' value='Foo' onChange=vi.fn() → on typing 'Baz' onChange fires with 'FooBaz'.
- TR-3.2 (rule): Error prop shows paragraph with `role="alert"` and `id="name-error"`.
- TR-3.3 (rule): StandaloneEmailInput renders `type="email"` with autoComplete='email'.

---

## Task 4: Port StandaloneTextArea + StandaloneDropDown

**Status:** pending
**Priority:** high
**ACs covered:** AC-3, AC-8 dim 2/3
**Scope:**

1. StandaloneTextArea.tsx: map `AlertCircle` → SiteIcon, same as above.
2. StandaloneDropDown.tsx: Map `AlertCircle` → SiteIcon; replace `import Image from 'next/image'` with plain `<img>` + eslint-disable inline comment (matches existing StandaloneMultiSelect pattern); replace `@/core/types Option` → `./utils/types`; ODF barrel types AddNewOptionProps already exist in local types.ts from prior port.
3. All 4 files use `'use client'` directive at top.

**Task-local TRs:**

- TR-4.1 (rule): StandaloneTextArea error prop renders `id='notes-error'` paragraph.
- TR-4.2 (rule): StandaloneDropDown opens listbox on input click with 3 options, clicking 2nd option calls onChange(String(value)) exactly once.

---

## Task 5: Port StandaloneMultiSelectCheckbox + StandaloneTagInput (parity completeness)

**Status:** pending
**Priority:** medium
**ACs covered:** AC-3 barrel completeness
**Scope:** ODF has these two as barrel exports; port with same icon/type transformations as Tasks 3-4 even if they're unused today — reduces future "is X available?" confusion. Map any lucide icons to SiteIcon as in Task 1.

**Task-local TRs:**

- TR-5.1 (rule): Both components compile via tsc; barrel index.ts exports them.

---

## Task 6: Update standalone-inputs barrel index.ts → ODF parity

**Status:** pending
**Priority:** high
**ACs covered:** AC-3
**Read path:**

- ODF barrel [index.ts](file:///d:/nobs1/Documents/ODF.fe/src/features/dashboard/settings/_components/settings-tabs/_components/half-page-modals/_components/standalone-inputs/index.ts)
- Current care-atlas barrel: [standalone-inputs/index.ts](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/standalone-inputs/index.ts)

**Scope:**

1. Keep existing exports: `StandaloneMultiSelect`, `RegionCountiesFormSection`, `Option` type.
2. **Prepend** before existing: `StandaloneTextInput`, `StandaloneEmailInput`, `StandaloneTextArea`, `StandaloneDropDown`, `StandaloneMultiSelectCheckbox`, `StandaloneTagInput` in exact same order as ODF index.ts lines 2–8.
3. Re-export Option type from `./utils/types` (mirrors ODF line 11).

**Task-local TRs:**

- TR-6.1 (rule): Barrel exports set === {StandaloneTextInput, StandaloneEmailInput, StandaloneTextArea, StandaloneDropDown, StandaloneMultiSelect, StandaloneMultiSelectCheckbox, StandaloneTagInput, RegionCountiesFormSection, Option}. No missing members.

---

## Task 7: Add Select-All counties headerAction to RegionCountiesFormSection

**Status:** pending
**Priority:** high
**ACs covered:** AC-1, AC-2, AC-9 (enabler)
**Read path:**

- Current counties multi-select call site: [RegionCountiesFormSection.tsx:151–165](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/standalone-inputs/RegionCountiesFormSection.tsx#L151-L165)

**Scope:**

1. Counties StandaloneMultiSelect currently has no `headerAction` prop. Add a `headerAction` prop identical to regions Select-All button but:
   - Disabled when `countyOptions.length === 0` → add `disabled` attr + opacity styling; label when disabled = "No counties available yet"
   - Button text when none selected: `'Select all counties in selected regions'`
   - Button text when every county in countyOptions is selected: `'Unselect all counties'`
   - Counter: `{selectedCounties.length}/{countyOptions.length}`
   - Logic on click: `if (allCountiesSelected) onCountiesChange([]) else onCountiesChange(countyOptions.map(o => o.code || String(o.value)).filter(Boolean))`
2. `allCountiesSelected` helper: `selectedCounties.length > 0 && countyOptions.every(c => selectedCounties.includes(String(c.code ?? c.value ?? '')))`.

**Task-local TRs:**

- TR-7.1 (rule): `RegionCountiesFormSection.test.tsx` AC-1 new test → button with "Select all counties" rendered when countyOptions.length=5 → 5/5 after click, 0/5 after second.
- TR-7.2 (rule): Partial selection (3/5) → counter shows 3/5 and button label shows "Select all counties".

---

## Task 8: Create Yup schema tenderLeadFormSchema.ts

**Status:** pending
**Priority:** high
**ACs covered:** AC-5, AC-7
**Scope:**

1. New file `src/components/site/tender-board/tenderLeadFormSchema.ts` exporting:
   - `emptyTenderBoardFormValues: TenderBoardForm` — equals current `emptyTenderBoardForm` constants (currently from `tender-board/constants.ts` — keep constant identical).
   - `TenderBoardFormYup: yup.ObjectSchema<TenderBoardForm>` enforcing:
     - `name`, `email`, `phone`, `line1`, `city`, `postcode`, `message`: yup.string().required()
     - `email`: yup.string().email()
     - `message`: yup.string().min(10)
     - `password`: yup.string().optional().min(8)
     - `passwordConfirmation`: yup.string().optional().oneOf([yup.ref('password'), ''], 'Passwords must match')
     - `consent`: yup.boolean().required().oneOf([true], 'Consent is required')
     - All remaining fields (whatsapp, company, line2, county/postal-county, tenderPreferenceNotes, website-honeypot, preferredContactMethod, recaptchaToken): optional as per existing behavior

**Task-local TRs:**

- TR-8.1 (rule): Schema validates empty object → throws 8+ required errors.
- TR-8.2 (rule): password='1234567' (7 chars) → errors.password length; password='12345678' + confirmation='wrong' → errors.passwordConfirmation mismatch; matching → no errors.
- TR-8.3 (rule): `consent = false` → validation fails with "Consent is required" message.

---

## Task 9: Migrate TenderBoardHalfScreenContent to useFormik

**Status:** pending
**Priority:** high
**ACs covered:** AC-5, AC-6
**Read path:**

- [TenderBoardHalfScreenContent.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/tender-board/TenderBoardHalfScreenContent.tsx) full file, especially:
  - form useState ~ line 70
  - submitLead function ~ lines 225–344
  - TenderBoardLeadForm render ~ lines 580-600

**Scope:**

1. Replace `const [form, setForm] = useState<TenderBoardForm>(emptyTenderBoardForm)` with:
   ```tsx
   import { useFormik, FormikProps } from 'formik'
   import { TenderBoardFormYup, emptyTenderBoardFormValues } from './tenderLeadFormSchema'
   // ...
   const formik = useFormik<TenderBoardForm>({
     initialValues: structuredClone
       ? structuredClone(emptyTenderBoardFormValues)
       : JSON.parse(JSON.stringify(emptyTenderBoardFormValues)),
     validationSchema: TenderBoardFormYup,
     validateOnMount: false,
     onSubmit: values => submitLead(values)
   })
   ```
2. All existing `setForm(current => ({...current, x: y}))` occurrences in TenderBoardHalfScreenContent (if any — probably none exist today, they're inside the child TenderBoardLeadForm). The key rewrite: child TenderBoardLeadForm no longer receives `form + setForm` props; instead receives `formik: FormikProps<TenderBoardForm>` prop.
3. submitLead signature change (or wrapper): accept TenderBoardForm as argument instead of reading `form` closure variable. All other fields (selectedRegions, selectedCounties, selectedTender etc.) continue from closure as before.
4. `formik.resetForm()` called when selectedTender changes (matches existing reset behavior).
5. Form submit handler (passed as prop to TenderBoardLeadForm) = `formik.handleSubmit`.

**Task-local TRs:**

- TR-9.1 (rule): No setForm calls remain (grep) inside TenderBoardHalfScreenContent.
- TR-9.2 (rule): initialValues deep-equals current emptyTenderBoardForm constant.

---

## Task 10: Rewrite TenderBoardLeadForm to use Standalone primitives + Formik.bindings

**Status:** pending
**Priority:** high
**ACs covered:** AC-4, AC-8 (dim 4 UX field order, dim 5 aria wiring)
**Read path:**

- [TenderBoardLeadForm.tsx](file:///d:/nobs1/NE%20GIT%20ITEMS/care-atlas.fe/src/components/site/tender-board/TenderBoardLeadForm.tsx) full file.

**Scope:**

1. **Props replacement:** Remove `form: TenderBoardForm` and `setForm: Dispatch<SetStateAction<TenderBoardForm>>`. Add `formik: FormikProps<TenderBoardForm>`. All other props (selectedRegions, setSelectedRegions, selectedCounties, setSelectedCounties, booking fields, notice, error, submitting, selectedTender, leadKind, setLeadKind, onSubmit) remain.
2. **Replace each raw input:**
   - Name → `<StandaloneTextInput name='name' label='Full name' value={formik.values.name} onChange={v => formik.setFieldValue('name', v)} error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined} required placeholder='Full name' />`. Wrap in Formik `<Field name='x'>` if cleanest; controlled value/onChange works because Standalone inputs don't need Formik — manual binding is straightforward.
   - Email → `StandaloneEmailInput` same pattern; existing inputClass min-h-11 already met by StandaloneTextInput/Email default padding.
   - Phone/WhatsApp/Company/Line1/Line2/City/County (postal)/Postcode → `StandaloneTextInput` with appropriate labels + placeholders; postcode uses `name='postcode'`.
   - Password + PasswordConfirmation → `StandaloneTextInput` with `type='password'`, explicit `autoComplete='new-password'` (per existing project constraint from project_memory), minLength enforced via Yup schema (already in Task 8).
   - PreferredContactMethod → `StandaloneDropDown` with options: [{code:'email',name:'Prefer email'}, {code:'phone',name:'Prefer phone'}, {code:'whatsapp',name:'Prefer WhatsApp'}].
   - Message (minLength=10) → `StandaloneTextArea label='Your message' rows={5} placeholder='Tell us what you need help with'`
   - TenderPreferenceNotes → `StandaloneTextArea rows={3}`
3. **Exceptions:** Keep hidden honeypot website input as raw `<input className='hidden'>`; keep consent checkbox as native (no StandaloneCheckbox exists), but wire value to formik.values.consent + onChange to formik.setFieldValue('consent', e.target.checked).
4. **LeadKind tabs:** Keep custom tabs as existing (they're not inputs, they're form-level view toggle between enquiry/booking — no Standalone match).
5. **Submit button:** `<button type='submit' onClick=formik.handleSubmit disabled=formik.isSubmitting || submitting || !selectedTender>` — keep existing loading text + icon.
6. **Form element:** `<form onSubmit=formik.handleSubmit>` instead of custom onSubmit prop callback. If existing onSubmit does additional work (e.g. stopPropagation), call it from within formik.submitForm wrapper as needed.
7. **Errors/touched:** Errors below each standalone input only render when `(formik.touched.fieldName || formik.submitCount > 0) && formik.errors.fieldName` — matches Formik conventional UX (don't show errors until field blur OR form submit attempt).

**Task-local TRs:**

- TR-10.1 (rule): Vitest render of TenderBoardLeadForm inside context + formik provider (or with formik prop constructed from useFormik in wrapper) → raw HTMLInputElement count (excluding checkbox + hidden honeypot) === 0 (all replaced).
- TR-10.2 (rule): Error for `email` field (invalid format 'notanemail') shows under the StandaloneEmailInput with `role='alert'` after focus+blur or submit click.
- TR-10.3 (rule): Field order preserved (line order matches current TenderBoardLeadForm line order AC-8 dim 4).

---

## Task 11: Payload parity verification

**Status:** pending
**Priority:** high
**ACs covered:** AC-6
**Scope:**

1. Existing submitLead function builds JSON for `sendTenderLead` / `createPublicBooking`. Compare the serialized body of submitLead when driven by formik.values with identical content to a hand-built form object (the old structure). Assert identical key-value pairs for every tenderPreferences._ field, intake._ field, and user personal fields. Exclude `recaptchaToken` (always new) from comparison.
2. Confirm existing serialization of regions (string[]) + counties (string[]) + password_confirmation (snake_case in API wire format already handled by parent; unchanged).

**Task-local TRs:**

- TR-11.1 (rule): Vitest snapshot of sendTenderLead fetch body under old useState-driven flow == new formik-driven body for identical values.
- TR-11.2 (rule): Same for createPublicBooking — all intake keys and user fields match byte-for-byte.

---

## Task 12: Add test suites for AC-1/2/7/9 integration

**Status:** pending
**Priority:** medium
**ACs covered:** AC-1, AC-2, AC-7, AC-9
**Scope:**

1. **New tests for counties Select-All** → extend existing `RegionCountiesFormSection.test.tsx`:
   - Test: Select 2 regions (NW + WM), click Select-All-Counties → selectedCounties.length === countyOptions.length (NW+WM total).
   - Test: After manual deselect, N-1 counter shown.
   - Test: Click "Unselect all counties" → length=0.
   - Test: When no regions selected, counties widget shows disabled disabled-button "No counties available yet" (no click handler fires).
2. **New test file `TenderBoardLeadForm.formik.test.tsx`** — AC-7 schema tests:
   - Empty submit → submitLead spy not called; 8 required errors rendered.
   - Password short → length error; mismatched confirmation → match error.
   - Consent false → 'Consent required' error.
   - Valid form → submitLead called exactly once with expected values.
3. **AC-9 integration workflow test file** `CountySelectAllWorkflow.test.tsx`:
   - Render full HalfScreenModalProvider + TenderBoardHalfScreenContent with mock selectedTender.
   - Open (already open with mock), select regions NW+WM, click counties Select-All → counter N/N, submit enquiry → fetch mock called with tenderPreferences.regions=['NW','WM'] and tenderPreferences.counties.length === countyOptions.length (from region filter).

**Task-local TRs:**

- TR-12.1 (rule): All new tests pass when run via `npx vitest run file` — total count ≥ 8 new rule TRs covered across 3 new test files.

---

## Task 13: Build & final verification

**Status:** pending
**Priority:** high
**ACs covered:** Final gate aggregate
**Scope:**

1. `npx tsc --noEmit` → exit 0.
2. `npx vitest run` → all 20 existing + new tests pass (no regressions).
3. `npm run build` → exit 0, routes count remains 68 (baseline), no new warnings.

**Task-local TRs:**

- TR-13.1 (rule): All 3 verification commands exit 0; routes 68; test count ≥ 28 total (20 original + ≥ 8 new).
- TR-13.2 (rubric 0–4, pass ≥ 3): AC-8 code port quality dims 1–5 all green self-report → 4/4 (each dim one point) OR minor cosmetic only.
