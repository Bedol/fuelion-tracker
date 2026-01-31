---
phase: 03-fueling-records
plan: 02
subsystem: hooks
tags:
  [
    tanstack-query,
    react-query,
    useInfiniteQuery,
    useMutation,
    localStorage,
    debounce,
    typescript,
  ]

requires:
  - phase: 03-01
    provides: FuelingData types, FuelingFormValues types

provides:
  - useFuelings hook with infinite scroll pagination
  - useCreateFueling mutation hook with toast notifications
  - useUpdateFueling mutation hook with query invalidation
  - useDeleteFueling mutation hook with success/error handling
  - useFuelingDraft hook with localStorage persistence
  - useLastFuelingData hook for smart defaults

affects:
  - 03-03 (Fueling form components)
  - 03-04 (API routes and pages)
  - 03-05 (Fueling list and detail pages)

tech-stack:
  added: []
  patterns:
    - TanStack Query useInfiniteQuery for pagination
    - TanStack Query useMutation with toast notifications
    - useQueryClient for query invalidation
    - Debounced localStorage persistence
    - beforeunload warning pattern

key-files:
  created:
    - hooks/useFuelings.ts
    - hooks/useCreateFueling.ts
    - hooks/useUpdateFueling.ts
    - hooks/useDeleteFueling.ts
    - hooks/useFuelingDraft.ts
    - hooks/useLastFuelingData.ts
  modified: []

key-decisions:
  - FUELINGS_PER_PAGE = 20 for optimal mobile/desktop balance
  - 5 minute staleTime for lastFueling to avoid excessive refetching
  - 1 second debounce for draft saves to balance UX and performance
  - Simple debounce implementation without lodash dependency
  - All mutations invalidate relevant queries on success

patterns-established:
  - "Query keys: ['fuelings', vehicleId] and ['lastFueling', vehicleId]"
  - 'Mutation hooks accept vehicleId for query invalidation'
  - "Toast notifications via toaster.create() with type: 'success' | 'error'"
  - 'Error handling: response.json().catch(() => ({})) pattern'
  - "SSR-safe localStorage: typeof window === 'undefined' checks"

duration: 2min
completed: 2026-01-31
---

# Phase 03 Plan 02: TanStack Query Hooks and Draft Persistence Summary

**Six custom hooks implementing infinite scroll queries, CRUD mutations with toast notifications, debounced draft persistence, and smart defaults - following project patterns from vehicle management**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-31T10:59:11Z
- **Completed:** 2026-01-31T11:01:52Z
- **Tasks:** 3
- **Files created:** 6

## Accomplishments

- **useFuelings**: Infinite scroll query hook with useInfiniteQuery, 20 items per page
- **useCreateFueling**: POST mutation with success/error toast notifications and query invalidation
- **useUpdateFueling**: PUT mutation with automatic ['fuelings', vehicleId] query refresh
- **useDeleteFueling**: DELETE mutation with dual query invalidation (fuelings + lastFueling)
- **useFuelingDraft**: Debounced localStorage persistence (1s delay) with beforeunload warning
- **useLastFuelingData**: Single query with 5min staleTime for smart form defaults

## Task Commits

Each task was committed atomically:

1. **Task 1: Data fetching hooks** - `5d0bcc3` (feat)
   - useFuelings.ts (27 lines) - useInfiniteQuery with pagination
   - useLastFuelingData.ts (20 lines) - useQuery with staleTime

2. **Task 2: Mutation hooks** - `84b4521` (feat)
   - useCreateFueling.ts (54 lines) - POST with toast notifications
   - useUpdateFueling.ts (53 lines) - PUT with query invalidation
   - useDeleteFueling.ts (49 lines) - DELETE with error handling

3. **Task 3: Draft persistence hook** - `72bd81e` (feat)
   - useFuelingDraft.ts (88 lines) - Debounced localStorage with SSR safety

**Plan metadata:** TBD (docs: complete plan)

## Files Created

| File                          | Lines | Purpose                                         |
| ----------------------------- | ----- | ----------------------------------------------- |
| `hooks/useFuelings.ts`        | 27    | Infinite scroll query for fueling list          |
| `hooks/useCreateFueling.ts`   | 54    | Create mutation with toast notifications        |
| `hooks/useUpdateFueling.ts`   | 53    | Update mutation with query invalidation         |
| `hooks/useDeleteFueling.ts`   | 49    | Delete mutation with success/error handling     |
| `hooks/useFuelingDraft.ts`    | 88    | Draft persistence to localStorage with debounce |
| `hooks/useLastFuelingData.ts` | 20    | Fetch last fueling for smart defaults           |

**Total:** 291 lines across 6 hooks

## Decisions Made

- FUELINGS_PER_PAGE = 20: Balances mobile and desktop view without excessive requests
- 5 minute staleTime for lastFueling: Prevents refetching during form filling, user typically completes within 5 minutes
- 1 second debounce for draft saves: Prevents excessive localStorage writes while maintaining near-real-time feel
- Custom debounce implementation: Avoids lodash dependency for single function
- All mutations invalidate both fuelings and lastFueling queries: Ensures data consistency across views

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed typo in useDeleteFueling error handler**

- **Found during:** Task 2 code review (pre-commit)
- **Issue:** `toster.create` instead of `toaster.create` in onError handler
- **Fix:** Corrected to `toaster.create`
- **Files modified:** hooks/useDeleteFueling.ts
- **Verification:** TypeScript compilation passes
- **Committed in:** Part of `84b4521` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor typo fix, no scope creep

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 hooks ready for import by form components
- TanStack Query patterns established for fueling records
- Draft persistence available for NewFuelingForm
- Smart defaults available via useLastFuelingData
- Query invalidation strategy in place for all CRUD operations
- Ready for 03-03: Create fueling form components

---

_Phase: 03-fueling-records_
_Plan: 02_
_Completed: 2026-01-31_
