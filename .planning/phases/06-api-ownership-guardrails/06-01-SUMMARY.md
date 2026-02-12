---
phase: 06-api-ownership-guardrails
plan: 01
subsystem: api
tags: [next-auth, prisma, nextjs, api, auth]

# Dependency graph
requires:
  - phase: 01-auth-app-shell
    provides: NextAuth session authOptions with user id in session
  - phase: 02-vehicle-management
    provides: Vehicle ownership via user_id in Prisma schema
  - phase: 03-fueling-records
    provides: Fueling to vehicle ownership relations
provides:
  - Shared API error envelope helpers for auth/ownership failures
  - Session guard resolving authenticated user id in API routes
  - Ownership guard helpers and owner-scoped filters for vehicle/fueling queries
affects:
  - 06-02-PLAN.md
  - 06-03-PLAN.md

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Shared API error envelope helpers with machine-readable codes
    - Centralized session guard for API routes
    - Owner-scoped Prisma query helpers for vehicles and fuelings

key-files:
  created:
    - pages/api/_shared/auth.ts
    - pages/api/_shared/errors.ts
    - pages/api/_shared/ownership.ts
  modified: []

key-decisions:
  - 'None - followed plan as specified'

patterns-established:
  - 'Error envelope helpers return consistent 401/403 payloads'
  - 'Ownership guards return minimal safe identifiers or null'

# Metrics
duration: 0 min
completed: 2026-02-06
---

# Phase 6 Plan 01: API Ownership Guardrails Summary

**Shared API guardrail helpers for auth checks, typed error envelopes, and ownership filters.**

## Performance

- **Duration:** 0 min
- **Started:** 2026-02-06T15:22:35Z
- **Completed:** 2026-02-06T15:22:36Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Added standardized error envelope helpers with 401/403 mappings and machine-readable codes
- Added a shared auth guard that resolves session user id consistently
- Added ownership guard helpers and owner-scoped filters for vehicles and fuelings

## Task Commits

Each task was committed atomically:

1. **Task 1: Add shared auth guard and typed error envelope helpers** - `3d61a6e` (feat)
2. **Task 2: Add ownership guard helpers for vehicle and fueling resources** - `6b92db8` (feat)
3. **Task 3: Validate helper ergonomics for downstream route refactors** - `3b15140` (refactor)

## Files Created/Modified

- `pages/api/_shared/auth.ts` - Session guard for authenticated user id resolution
- `pages/api/_shared/errors.ts` - Error envelope types and response helpers
- `pages/api/_shared/ownership.ts` - Ownership checks and owner-scoped where helpers

## Decisions Made

None - followed plan as specified.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for 06-02-PLAN.md (ownership enforcement in vehicle and statistics endpoints).

---

_Phase: 06-api-ownership-guardrails_
_Completed: 2026-02-06_
