# Pitfalls Research: Fuelion

**Domain:** Vehicle expense tracking application (Polish market)
**Researched:** 2026-01-30
**Confidence:** MEDIUM (based on domain patterns, existing codebase analysis, and industry knowledge)

## Summary

Fuelion's expansion carries several high-risk pitfalls that span data entry UX, statistics/charting, image upload, and expense categorization. The **most critical risks** stem from the existing codebase state: mixed Chakra/Tailwind styling creates maintenance overhead, disabled TypeScript strict mode allows runtime errors to slip through, and absence of tests means refactoring carries high regression risk. For the core features being added, the primary pitfalls are: (1) friction-heavy data entry killing the "quick entry" value proposition, (2) charts that calculate incorrectly for partial-tank scenarios, (3) image uploads without proper size/format validation causing storage bloat and UX failures, and (4) expense categorization that doesn't match real-world Polish vehicle ownership patterns.

---

## Data Entry UX Pitfalls

### Pitfall 1: Too Many Required Fields

- **What goes wrong:** Users bounce during fueling entry because form demands country, region, station, currency when they just want to log "50L for 320 PLN at 155,000 km". Core value proposition ("quick data entry") is destroyed.
- **Warning signs:** Form has 10+ visible fields; users entering fake data just to submit; high form abandonment rate; complaints about "takes too long"
- **Prevention:**
  - Implement smart defaults from User profile (default_country, default_region, favorite_station, default_currency_id already exist in schema)
  - Make location/station truly optional - show expanded form only when user clicks "Add details"
  - Pre-fill date with today, currency with user default (PLN)
  - Auto-calculate cost_per_unit from cost/quantity (don't require all three)
- **Phase:** Foundation/Data Entry phase - implement defaults BEFORE adding new expense types

### Pitfall 2: Mileage Entry Errors

- **What goes wrong:** Users enter wrong mileage (e.g., 15500 instead of 155000) and statistics become wildly inaccurate. Current form allows any value >= vehicle.mileage but doesn't validate reasonability.
- **Warning signs:** Statistics showing 1000 km/L consumption; sudden jumps in mileage that don't match previous entries; users reporting "broken" statistics
- **Prevention:**
  - Validate: new mileage should be reasonably close to (previous_mileage + typical_distance)
  - Show warning (not error) for unusual jumps: "This adds 15,000 km since last entry. Is this correct?"
  - Allow distance_traveled OR mileage entry (not both simultaneously causing sync bugs - see lines 272-301 in NewFuelingForm.tsx where this already has a race condition)
- **Phase:** Data Entry phase - add validation layer before statistics phase relies on this data

### Pitfall 3: Decimal Separator Confusion (Polish Market)

- **What goes wrong:** Polish users expect comma as decimal separator (7,50 PLN/L), but JavaScript parseFloat expects dot. Users entering "7,50" get NaN or 7.
- **Warning signs:** Cost/quantity values always integers; users complaining they "can't enter decimals"; data precision loss
- **Prevention:**
  - Use locale-aware number input that accepts both comma and dot
  - Current NumberInput component (components/Form/NumberInput.tsx) likely uses raw parseFloat
  - Display formatted values with Polish locale (7,50) but store as floats
- **Phase:** Data Entry phase - critical for Polish market

### Pitfall 4: Date Entry Friction

- **What goes wrong:** Users fueling today must navigate date picker to find "today". Users logging yesterday's fueling after forgetting must click multiple times.
- **Warning signs:** 90%+ of entries have today's date; users complaining about date entry
- **Prevention:**
  - Default to today's date (partially done)
  - Add "Today" and "Yesterday" quick buttons
  - Consider: most users log same day or previous day, optimize for that
- **Phase:** Data Entry phase - low effort, high impact

---

## Statistics & Charts Pitfalls

### Pitfall 5: Partial Tank Fuel Consumption Calculation

- **What goes wrong:** Fuel consumption (L/100km) calculation is only accurate with full_tank=true entries. If user enters partial fills, calculating consumption between those entries gives meaningless numbers.
- **Warning signs:** Wildly varying consumption numbers (3 L/100km one entry, 20 L/100km next); users not understanding why stats are "wrong"
- **Prevention:**
  - Only calculate consumption between consecutive full_tank=true entries
  - Skip partial fills in consumption calc, but include them in cost totals
  - Clearly explain this in UI: "Consumption calculated from full tank entries only"
  - If user has no full tank entries, show "Not enough data" instead of wrong number
- **Phase:** Statistics phase - must implement before showing any consumption charts

### Pitfall 6: Empty State Handling for Charts

- **What goes wrong:** Charts crash or show confusing output when user has 0-2 data points. Recharts/Chart.js with empty arrays can throw errors or show blank space with axes.
- **Warning signs:** JavaScript errors in console on new user accounts; blank chart areas; axes showing but no data
- **Prevention:**
  - Define minimum data requirements per chart type (line chart needs 2+ points, trend needs 5+)
  - Show meaningful empty states: "Add 3 more fuelings to see your consumption trend"
  - Never pass empty arrays to chart libraries
- **Phase:** Statistics phase - handle before each chart is implemented

### Pitfall 7: Time Period Selection Mismatch

- **What goes wrong:** User selects "Last 30 days" but has entries from 6 months ago. Chart shows either nothing or doesn't match user expectation.
- **Warning signs:** Users confused why charts are empty when they have data; support requests about "missing data"
- **Prevention:**
  - Auto-detect user's data range and default to showing all relevant data
  - If filtering reduces data below minimum, show warning: "Only 2 entries in this period. Showing all time instead."
  - Consider: "Since first entry" as default, with options to narrow
- **Phase:** Statistics phase - UX decision needed early

### Pitfall 8: Y-Axis Scale Making Small Differences Look Huge

- **What goes wrong:** Consumption varying 7.2-7.5 L/100km shows as dramatic swings when Y-axis starts at 7.0. Users panic about "huge increase" that's actually noise.
- **Warning signs:** Users misinterpreting charts; making decisions based on normal variation
- **Prevention:**
  - Start Y-axis at 0 for consumption charts (standard practice)
  - For cost charts, starting at 0 may waste space - use min-max with padding
  - Consider reference lines showing "good" ranges for context
- **Phase:** Statistics phase - chart configuration detail

---

## Image Upload Pitfalls

### Pitfall 9: No File Size Limits

- **What goes wrong:** User uploads 15MB HEIC photo from iPhone. Upload times out or fills storage. Multiple uploads crash the app or exhaust cloud storage budget.
- **Warning signs:** Slow uploads; storage costs spiking; timeout errors; users on mobile complaining about "stuck" uploads
- **Prevention:**
  - Client-side validation: reject files > 5MB before upload
  - Server-side validation: double-check, never trust client
  - Compress/resize images server-side (or use service like Cloudinary/ImageKit)
  - Convert HEIC to JPEG (common iPhone format not universally supported)
- **Phase:** Image Upload phase - implement limits FIRST, then upload logic

### Pitfall 10: Missing Image Format Validation

- **What goes wrong:** User uploads PDF pretending to be image, or SVG with embedded scripts. Security vulnerability and broken image displays.
- **Warning signs:** Broken image icons in UI; security scan warnings; users uploading non-photos
- **Prevention:**
  - Whitelist formats: JPEG, PNG, WebP (maybe HEIC with conversion)
  - Validate by magic bytes, not just file extension
  - Use established upload library (e.g., uploadthing, Cloudinary) that handles this
- **Phase:** Image Upload phase - security requirement

### Pitfall 11: No Image Deletion/Orphan Cleanup

- **What goes wrong:** User uploads image, then deletes the expense. Image remains in storage forever. Over time, storage fills with orphaned images.
- **Warning signs:** Storage usage grows faster than user/expense count; images accessible after expense deletion
- **Prevention:**
  - Cascade delete: when expense deleted, delete associated images
  - Periodic cleanup job for orphans (image exists but no expense references it)
  - Track image-to-expense relationship in database
- **Phase:** Image Upload phase - database design decision

### Pitfall 12: Mobile Upload UX Failures

- **What goes wrong:** Upload flow works on desktop but fails on mobile. Camera integration doesn't work; progress unclear; connection drops mid-upload.
- **Warning signs:** Mobile users can't upload; support tickets from mobile users; uploads "disappear"
- **Prevention:**
  - Test on actual mobile devices (not just responsive desktop)
  - Support camera capture directly (input type="file" accept="image/\*" capture="environment")
  - Show upload progress; allow retry on failure
  - Consider offline-first: queue uploads when connection is poor
- **Phase:** Image Upload phase - test mobile specifically

---

## Expense Tracking Domain Pitfalls

### Pitfall 13: Expense Categories Don't Match Reality

- **What goes wrong:** Categories are too generic ("maintenance") or too specific ("timing belt replacement"). Users can't find the right category or everything ends up in "Other".
- **Warning signs:** 50%+ expenses categorized as "Other"; users requesting new categories; categories with 0 usage
- **Prevention:**
  - Research Polish vehicle ownership expenses: Insurance (OC/AC), Technical inspection (przeglad techniczny), Registration fees, Parking, Tolls (autostrady), Washing, Tires, Oil changes, Repairs, Accessories
  - Allow sub-categories for detailed users, but don't require them
  - "Other" with required description field
- **Phase:** Expense Types phase - category design is foundational

### Pitfall 14: Missing Recurring Expense Pattern

- **What goes wrong:** User has to manually enter annual insurance every year. No reminder, no pre-fill from last year. Friction increases, data becomes incomplete.
- **Warning signs:** Expenses with same type and similar amount appearing yearly with gaps; users forgetting to log recurring costs
- **Prevention:**
  - Identify recurring patterns: insurance (annual), inspection (annual/bi-annual), registration
  - Offer "repeat from last year" or reminder system
  - Don't over-engineer initially - simple duplicate feature may suffice
- **Phase:** Future phase - nice-to-have, not MVP for expense types

### Pitfall 15: Cost vs. Value Confusion

- **What goes wrong:** User logs tire purchase (2000 PLN) but those tires have residual value. Total cost calculations treat it as pure expense vs. investment.
- **Warning signs:** Users not logging purchases because "it's not really an expense"; TCO calculations misleading
- **Prevention:**
  - For MVP: all entries are expenses (money out)
  - Clearly label as "expenses" not "costs" or "total cost of ownership"
  - Future: differentiate consumables (fuel, oil) from investments (tires, parts) if needed
- **Phase:** Expense Types phase - terminology decision

### Pitfall 16: Multi-Vehicle Expense Allocation

- **What goes wrong:** User has 3 vehicles, buys bulk oil or shared parking spot. Can't allocate expense across vehicles; forced to pick one or duplicate manually.
- **Warning signs:** Users with multiple vehicles frustrated; workarounds like "split across vehicles manually"
- **Prevention:**
  - For MVP: expense belongs to ONE vehicle (simpler, covers 90% of cases)
  - Acknowledge limitation in UX; don't pretend to support multi-vehicle allocation
  - Future consideration: optional split expense feature
- **Phase:** Expense Types phase - scope decision (recommend: don't build split allocation for MVP)

---

## Existing Codebase Risks

### Mixed Chakra/Tailwind Styling

- **Risk:** Inconsistent styling approach creates confusion. Some components use Chakra's Box/Flex with props (e.g., Layout.tsx, Header.tsx), others use Tailwind className (e.g., statistics.tsx, vehicles/new.tsx). New features will perpetuate inconsistency.
- **Evidence:** Header.tsx uses `<Box bg="white" borderBottom="1px">`, statistics.tsx uses `className='bg-white p-4'`. VehicleCard.tsx (in components/) uses Tailwind, Card.tsx uses Chakra.
- **Mitigation:**
  - **Decision:** Pick ONE as primary. Recommendation: Chakra for components (already in Layout), Tailwind for page-level layout if needed.
  - **Pattern:** All new components use Chakra. Only use Tailwind for quick prototyping or overrides.
  - **Gradual migration:** When touching existing Tailwind components, convert to Chakra if scope allows.
  - **Avoid:** Never mix in same component (no `<Box className="...">`).
- **Phase:** Address in EVERY phase - establish pattern in Phase 1 and enforce

### No Tests

- **Risk:** Adding charts, image upload, expense types, and statistics calculations with no test coverage means bugs go undetected until production. Refactoring mixed styles safely is impossible.
- **Evidence:** No test files in glob results; no test script in package.json; no testing framework in dependencies.
- **Mitigation:**
  - **Minimum:** Add Vitest + React Testing Library before statistics phase
  - **Critical tests:** Fuel consumption calculation (partial tank logic), mileage validation, expense totals
  - **Pragmatic approach:** Don't aim for 80% coverage overnight. Test calculation logic and critical paths.
  - **Warning:** Statistics calculations MUST have tests - financial/consumption data shown to users must be correct
- **Phase:** Add testing infrastructure in Foundation phase, before Statistics phase

### TypeScript Strict Mode Off

- **Risk:** Runtime errors from null/undefined access, implicit any allowing bugs to propagate. Forms like NewFuelingForm.tsx have untyped `field` and `form` in Field callbacks (lines 121, 135, etc.).
- **Evidence:** tsconfig.json has `"strict": false`. Field callback params have implicit any: `{({ field, form }) =>`.
- **Mitigation:**
  - **Immediate:** Don't enable strict mode globally (too much existing code would break)
  - **Incremental:** Enable `strictNullChecks` first (catches most impactful bugs)
  - **New code:** Type all new code fully, even with strict mode off
  - **Formik typing:** Use `useFormik` hook with generic type instead of `<Formik>` component for better inference
- **Phase:** Enable strictNullChecks in Foundation phase; full strict is future milestone

### QueryClient in \_app.tsx Scope Issue

- **Risk:** QueryClient instantiated outside component may cause issues with SSR hydration. Current setup creates queryClient at module level.
- **Evidence:** \_app.tsx line 8: `const queryClient = new QueryClient();` outside component
- **Mitigation:**
  - Move QueryClient instantiation inside component with useState/useMemo
  - Or use documented pattern from TanStack Query docs for Next.js Pages Router
- **Phase:** Foundation phase - fix before adding more queries

### No API Input Validation

- **Risk:** API routes accept body directly without validation. Malicious or malformed input could corrupt database or cause errors.
- **Evidence:** fueling/index.ts line 14-15: `prisma.fueling.create({ data: body })` - trusting client input
- **Mitigation:**
  - Add Zod schemas for all API inputs
  - Validate before database operations
  - Return structured errors for validation failures
- **Phase:** Foundation phase - before adding more API routes

### Hardcoded Currencies Despite PLN-Only Target

- **Risk:** Code supports EUR/USD (types/vehicle_types.ts) but product is PLN-only for Polish market. UI complexity and confusion for no value.
- **Evidence:** currencies array includes PLN, EUR, USD; forms have currency dropdown
- **Mitigation:**
  - Remove currency selection from UI for now (always PLN)
  - Keep currency_id in database for future internationalization
  - Simplifies forms, aligns with "quick data entry" value prop
- **Phase:** Data Entry phase - simplify forms

---

## Phase-Specific Warnings

| Phase Topic   | Likely Pitfall                       | Mitigation                                            |
| ------------- | ------------------------------------ | ----------------------------------------------------- |
| Foundation    | Style inconsistency escalates        | Establish Chakra-first pattern, document in AGENTS.md |
| Foundation    | Breaking changes without tests       | Add Vitest before major refactoring                   |
| Data Entry    | Forms too complex                    | Default from user profile, minimize required fields   |
| Data Entry    | Decimal input fails for Polish users | Locale-aware number input                             |
| Statistics    | Wrong consumption for partial tanks  | Only calculate between full_tank entries              |
| Statistics    | Empty charts crash                   | Define minimum data requirements per chart            |
| Image Upload  | Security vulnerabilities             | Validate format by magic bytes, size limits           |
| Image Upload  | Storage bloat                        | Compression, orphan cleanup                           |
| Expense Types | Categories unused                    | Research Polish vehicle expense patterns              |

---

## Priority Pitfalls (Top 5)

| #   | Pitfall                                              | Impact                                  | Likelihood                               | Prevention                                                   |
| --- | ---------------------------------------------------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| 1   | **Partial Tank Consumption Calculation** (Pitfall 5) | High - Users see wrong data, lose trust | High - Feature requires this logic       | Only calculate between full_tank=true entries; explain in UI |
| 2   | **Too Many Required Fields** (Pitfall 1)             | High - Kills core value proposition     | High - Already visible in NewFuelingForm | Implement user defaults, make location/station optional      |
| 3   | **No Tests + Statistics** (Codebase Risk)            | High - Financial data must be accurate  | High - Statistics phase coming           | Add Vitest before statistics; test calculations              |
| 4   | **Mixed Chakra/Tailwind** (Codebase Risk)            | Medium - Maintenance overhead grows     | High - Already happening                 | Establish pattern: Chakra for components                     |
| 5   | **Image Upload Security** (Pitfalls 9, 10)           | High - Storage costs, security risk     | Medium - Depends on implementation       | Size limits, format validation, use established service      |

---

## Sources

- **Codebase analysis:** Direct examination of existing code patterns and schema
- **Domain knowledge:** Vehicle expense tracking patterns from industry
- **Confidence:** MEDIUM - Pitfalls identified from code analysis and domain patterns; specific Polish market behaviors would benefit from user research validation
