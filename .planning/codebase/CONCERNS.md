# Codebase Concerns

**Analysis Date:** 2026-01-30

## Tech Debt

**Missing Form Validation:**

- Issue: Forms lack proper validation schemas; form submission happens without input validation
- Files: `components/fueling/NewFuelingForm.tsx` (line 106), `pages/vehicles/new.tsx`
- Impact: Invalid data can be submitted to the database, causing data integrity issues
- Fix approach: Add Yup or Zod validation schemas to all Formik forms

**Commented Out Mutation Call:**

- Issue: The fueling form submit handler has the actual mutation call commented out
- Files: `components/fueling/NewFuelingForm.tsx` (line 108)
- Impact: New fueling records cannot be created through the UI
- Fix approach: Uncomment `refuelMutation.mutate(values)` and ensure validation is in place

**Hardcoded Static Data in Dashboard:**

- Issue: Dashboard statistics display hardcoded placeholder values instead of real data
- Files: `pages/index.tsx` (lines 126-153)
- Impact: Users see fake statistics (e.g., "3 vehicles", "€245.80 fuel") regardless of actual data
- Fix approach: Create API endpoints for dashboard statistics and fetch real data

**Deprecated TanStack Query API:**

- Issue: Using `isLoading` instead of `isPending` (deprecated in v5)
- Files: `components/vehicles/VehicleForm.tsx` (line 59)
- Impact: Will break on future TanStack Query updates
- Fix approach: Replace `mutation.isLoading` with `mutation.isPending`

**Inconsistent Naming Convention (vehicle_id vs vehicleId):**

- Issue: Database schema uses snake_case (`vehicle_id`) but some API calls expect camelCase (`vehicleId`)
- Files: `components/fueling/NewFuelingForm.tsx` (line 103), `pages/api/fueling/index.ts` (lines 21, 28)
- Impact: Mismatch causes fueling POST to fail finding the vehicle
- Fix approach: Standardize on snake_case to match Prisma schema or add field mapping

**Stub/Placeholder Pages:**

- Issue: Several pages are non-functional stubs with minimal UI
- Files: `pages/expenses/new.tsx`, `pages/profiles/index.tsx`
- Impact: Features advertised in navigation do not work
- Fix approach: Implement full functionality or remove from navigation

**Duplicate VehicleCard Components:**

- Issue: Two different VehicleCard implementations exist, causing confusion
- Files: `components/VehicleCard.tsx` (Tailwind-based), `components/vehicles/VehicleCard.tsx` (Chakra-based)
- Impact: Inconsistent UI; unclear which to use; props differ (`vehicle` vs `vehicleId`)
- Fix approach: Consolidate to single component with consistent API

**Large JSON File Bundled in Hooks:**

- Issue: 272KB countries.json file imported synchronously at runtime
- Files: `hooks/data/countries.json`, `hooks/getCountries.ts`
- Impact: Increases bundle size and initial load time
- Fix approach: Use dynamic import or lazy load the data when needed

**Mixed Styling Approaches:**

- Issue: Components mix Tailwind CSS utility classes with Chakra UI components inconsistently
- Files: `pages/vehicles/new.tsx` (Tailwind), `components/fueling/NewFuelingForm.tsx` (Chakra)
- Impact: Inconsistent visual design, harder maintenance
- Fix approach: Standardize on Chakra UI for all form components

## Known Bugs

**Null Reference in Fueling API:**

- Symptoms: Server crash when creating fueling if vehicle doesn't exist
- Files: `pages/api/fueling/index.ts` (line 25)
- Trigger: POST `/api/fueling` with invalid `vehicleId`
- Workaround: None; results in 500 error

**Edit Page Uses Wrong Field Names:**

- Symptoms: Vehicle edit form doesn't populate correctly
- Files: `pages/vehicles/[id]/edit.tsx` (line 55)
- Trigger: Destructuring `brand, model` but database has `brand_name, model_name`
- Workaround: None; fields appear empty

**Artificial Delay in Edit Mutation:**

- Symptoms: Vehicle updates take 3+ seconds unnecessarily
- Files: `pages/vehicles/[id]/edit.tsx` (line 21)
- Trigger: Any vehicle edit
- Workaround: Wait for delay to complete

## Security Considerations

**No API Route Authentication:**

- Risk: All API routes are publicly accessible without session verification
- Files: `pages/api/vehicles/index.ts`, `pages/api/vehicles/[id].ts`, `pages/api/fueling/index.ts`
- Current mitigation: None
- Recommendations: Add `getServerSession()` check to all API routes; reject unauthenticated requests

**No User Data Isolation:**

- Risk: Users can access/modify any vehicle or fueling record, not just their own
- Files: `pages/api/vehicles/index.ts` (line 26), `pages/api/fueling/index.ts` (line 40)
- Current mitigation: None
- Recommendations: Add `where: { user_id: session.user.id }` to all Prisma queries

**No Input Sanitization in API Routes:**

- Risk: Request body passed directly to Prisma without validation
- Files: `pages/api/vehicles/index.ts` (line 19), `pages/api/vehicles/[id].ts` (line 22)
- Current mitigation: Prisma provides basic type coercion
- Recommendations: Add Zod schema validation for all API inputs

**TypeScript Strict Mode Disabled:**

- Risk: Type errors may slip through, causing runtime failures
- Files: `tsconfig.json` (line 7: `"strict": false`)
- Current mitigation: None
- Recommendations: Enable strict mode incrementally, fix type errors

**Session Token Contains User ID:**

- Risk: User ID is exposed in JWT token; could enable enumeration attacks
- Files: `pages/api/auth/[...nextauth].ts` (line 20)
- Current mitigation: None significant
- Recommendations: Consider using non-sequential UUIDs for user IDs

## Performance Bottlenecks

**N+1 Query Pattern in Vehicle List:**

- Problem: VehicleCard fetches its own data, causing separate API call per vehicle
- Files: `components/vehicles/VehicleCard.tsx` (lines 19-25)
- Cause: Component makes individual fetch instead of receiving data as prop
- Improvement path: Pass vehicle data as prop; batch fetch in parent component

**Unbounded Queries:**

- Problem: `findMany()` without pagination returns all records
- Files: `pages/api/vehicles/index.ts` (line 26), `pages/api/fueling/index.ts` (line 40)
- Cause: No `take`/`skip` parameters
- Improvement path: Add pagination; implement cursor-based pagination for large datasets

**Synchronous Country/State Data Loading:**

- Problem: Large JSON files loaded synchronously on component mount
- Files: `hooks/getCountries.ts`, `hooks/getStates.ts`
- Cause: Static import of 272KB JSON file
- Improvement path: Use `country-state-city` package's native methods or lazy load

## Fragile Areas

**NewFuelingForm Component:**

- Files: `components/fueling/NewFuelingForm.tsx` (342 lines)
- Why fragile: Largest component; mixes state management, API calls, form logic, and UI
- Safe modification: Extract sub-forms for location, fuel details; create custom hooks for mutations
- Test coverage: None

**API Route Handlers:**

- Files: `pages/api/vehicles/[id].ts`, `pages/api/fueling/index.ts`
- Why fragile: No error handling; unhandled promise rejections crash server
- Safe modification: Wrap all async operations in try-catch; return proper error responses
- Test coverage: None

**Mileage Calculation Logic:**

- Files: `components/fueling/NewFuelingForm.tsx` (lines 272-301)
- Why fragile: Bidirectional dependency between `distance_traveled` and `mileage` fields can cause calculation loops
- Safe modification: Use single source of truth; derive one from the other
- Test coverage: None

## Scaling Limits

**Database Queries:**

- Current capacity: Works for small datasets
- Limit: Will slow significantly with >1000 vehicles or fuelings per user
- Scaling path: Add database indexes; implement pagination; consider caching layer

**Session Storage:**

- Current capacity: JWT in cookies
- Limit: Cookie size limit (~4KB)
- Scaling path: Consider database sessions for complex user data

## Dependencies at Risk

**@chakra-ui/icons (v2.x with Chakra v3):**

- Risk: Version mismatch; Chakra UI v3 may have breaking changes
- Impact: Icon components may fail
- Migration plan: Update to Chakra v3 icon patterns

**useToast from Chakra UI:**

- Risk: API changed significantly in Chakra v3; current usage is v2 pattern
- Impact: Toast notifications may not work correctly
- Migration plan: Use `toaster.create()` pattern from Chakra v3

**next-auth v4 with Next.js 16:**

- Risk: NextAuth v4 adapter may have compatibility issues with latest Next.js
- Impact: Authentication may break
- Migration plan: Upgrade to Auth.js v5 when stable

## Missing Critical Features

**No Testing Framework:**

- Problem: No test files, test config, or test dependencies exist
- Blocks: Cannot verify behavior; refactoring is risky
- Files affected: All components and API routes

**No Error Boundaries:**

- Problem: React errors crash entire application
- Blocks: Poor user experience; difficult debugging in production

**No Logging Infrastructure:**

- Problem: Only `console.log` for debugging; no structured logging
- Blocks: Cannot diagnose production issues

**No API Error Responses:**

- Problem: API routes don't return consistent error format
- Blocks: Frontend cannot handle errors gracefully

## Test Coverage Gaps

**All Areas Untested:**

- What's not tested: Everything; no test framework configured
- Files: All `components/`, `pages/`, `pages/api/`
- Risk: Regressions introduced unknowingly; refactoring is dangerous
- Priority: High - add testing framework and critical path tests first

**Critical Paths Needing Tests:**

1. Authentication flow (`pages/api/auth/[...nextauth].ts`)
2. Vehicle CRUD operations (`pages/api/vehicles/`)
3. Fueling record creation (`pages/api/fueling/`)
4. Form submission workflows

---

_Concerns audit: 2026-01-30_
