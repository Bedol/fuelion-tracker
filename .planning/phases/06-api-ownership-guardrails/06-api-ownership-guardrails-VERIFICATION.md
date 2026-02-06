---
phase: 06-api-ownership-guardrails
verified: 2026-02-06T15:37:36Z
status: human_needed
score: 11/11 must-haves verified
human_verification:
  - test: 'Unauthenticated API access is rejected'
    expected: 'GET /api/vehicles, /api/vehicles/[id], /api/vehicles/[id]/statistics, /api/fueling, /api/fueling/[id] return 401 with { error: { code: UNAUTHENTICATED } }'
    why_human: 'Requires runtime session context and API calls'
  - test: 'Non-owner read access is cloaked'
    expected: "GET /api/vehicles/[id] and /api/vehicles/[id]/statistics for another user's vehicle return 403 with NOT_FOUND envelope and generic message"
    why_human: 'Requires cross-user data and live request'
  - test: 'Non-owner write access is blocked without side effects'
    expected: 'PUT/DELETE /api/vehicles/[id] and POST/PUT/DELETE /api/fueling endpoints return 403 with FORBIDDEN and no data mutation'
    why_human: 'Needs database inspection to confirm no writes'
  - test: 'Fueling mutation hooks surface server error messages'
    expected: 'UI toasts show server-provided error.message on 401/403 responses'
    why_human: 'Requires UI interaction and live API responses'
---

# Phase 6: API Ownership Guardrails Verification Report

**Phase Goal:** Enforce strict per-user ownership in vehicles, fueling, and statistics APIs.
**Verified:** 2026-02-06T15:37:36Z
**Status:** human_needed
**Re-verification:** No - initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                                       | Status     | Evidence                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Protected API routes can enforce session identity through one shared guard function                         | ✓ VERIFIED | `pages/api/_shared/auth.ts` exposes `requireSessionUserId` and is called in vehicle/fueling routes.                                      |
| 2   | Auth and ownership failures can be returned through one standard JSON envelope with machine-readable codes  | ✓ VERIFIED | `pages/api/_shared/errors.ts` defines `ApiErrorEnvelope` and helpers including `sendApiError`.                                           |
| 3   | Vehicle and fueling ownership checks are reusable and do not leak write side effects                        | ✓ VERIFIED | `pages/api/_shared/ownership.ts` uses `findFirst` only; no mutations.                                                                    |
| 4   | Unauthenticated calls to vehicles and vehicle statistics endpoints return a consistent 401 error envelope   | ✓ VERIFIED | `requireSessionUserId` used in `pages/api/vehicles/index.ts`, `pages/api/vehicles/[id].ts`, `pages/api/vehicles/[id]/statistics.ts`.     |
| 5   | Vehicle list and create operations are scoped to the signed-in user and cannot spoof ownership              | ✓ VERIFIED | `pages/api/vehicles/index.ts` filters by `getOwnedVehicleWhere` and connects user via session id.                                        |
| 6   | Non-owner vehicle GET-by-id and statistics GET-by-id return 403 with generic not-found wording              | ✓ VERIFIED | `sendForbiddenAsNotFound` used in `pages/api/vehicles/[id].ts` and `pages/api/vehicles/[id]/statistics.ts`.                              |
| 7   | Non-owner vehicle PUT/DELETE are rejected with 403 and do not change data                                   | ✓ VERIFIED | `pages/api/vehicles/[id].ts` checks `ensureOwnedVehicle` before update/delete and returns `sendForbidden`.                               |
| 8   | Unauthenticated fueling API calls return the same 401 error envelope as other guarded endpoints             | ✓ VERIFIED | `requireSessionUserId` used in `pages/api/fueling/index.ts` and `pages/api/fueling/[id].ts`.                                             |
| 9   | Fueling list and detail access are owner-scoped through vehicle ownership and do not leak cross-user data   | ✓ VERIFIED | `getOwnedFuelingWhere` and `ensureOwnedFueling` guard queries in `pages/api/fueling/index.ts` and `pages/api/fueling/[id].ts`.           |
| 10  | Cross-owner fueling create/update/delete attempts return 403 and perform no writes                          | ✓ VERIFIED | `ensureOwnedVehicle`/`ensureOwnedFueling` checks precede mutations in fueling routes with `sendForbidden`.                               |
| 11  | Fueling mutation hooks surface server envelope messages instead of generic failures when guardrails trigger | ✓ VERIFIED | Hooks parse `error.message` from JSON envelope in `hooks/useCreateFueling.ts`, `hooks/useUpdateFueling.ts`, `hooks/useDeleteFueling.ts`. |

**Score:** 11/11 truths verified

### Required Artifacts

| Artifact                                | Expected                           | Status     | Details                                                                                    |
| --------------------------------------- | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------------ |
| `pages/api/_shared/auth.ts`             | Session guard helper               | ✓ VERIFIED | `requireSessionUserId` uses `getServerSession` and sends 401 envelope.                     |
| `pages/api/_shared/errors.ts`           | Unified error envelope helpers     | ✓ VERIFIED | Exports `sendApiError`, `sendUnauthenticated`, `sendForbidden`, `sendForbiddenAsNotFound`. |
| `pages/api/_shared/ownership.ts`        | Ownership guard helpers            | ✓ VERIFIED | Exports `ensureOwnedVehicle`, `ensureOwnedFueling`, and owner-scoped where helpers.        |
| `pages/api/vehicles/index.ts`           | Authenticated, scoped list/create  | ✓ VERIFIED | `requireSessionUserId` gating + owner-scoped query and create.                             |
| `pages/api/vehicles/[id].ts`            | Owner-guarded detail/update/delete | ✓ VERIFIED | `ensureOwnedVehicle` before read/write; 403 responses.                                     |
| `pages/api/vehicles/[id]/statistics.ts` | Owner-guarded statistics           | ✓ VERIFIED | `requireSessionUserId` + `ensureOwnedVehicle` + NOT_FOUND cloak.                           |
| `pages/api/fueling/index.ts`            | Owner-scoped list/create           | ✓ VERIFIED | `ensureOwnedVehicle` check before create; owner-scoped list filter.                        |
| `pages/api/fueling/[id].ts`             | Owner-guarded detail/update/delete | ✓ VERIFIED | `ensureOwnedFueling` before reads/writes; 403 responses.                                   |
| `hooks/useCreateFueling.ts`             | Create mutation parses envelope    | ✓ VERIFIED | `getErrorMessage` reads `error.message`.                                                   |
| `hooks/useUpdateFueling.ts`             | Update mutation parses envelope    | ✓ VERIFIED | `getErrorMessage` reads `error.message`.                                                   |
| `hooks/useDeleteFueling.ts`             | Delete mutation parses envelope    | ✓ VERIFIED | `getErrorMessage` reads `error.message`.                                                   |

### Key Link Verification

| From                                    | To                                | Via                                     | Status | Details                                                             |
| --------------------------------------- | --------------------------------- | --------------------------------------- | ------ | ------------------------------------------------------------------- |
| `pages/api/_shared/auth.ts`             | `pages/api/auth/[...nextauth].ts` | `getServerSession(req,res,authOptions)` | WIRED  | `requireSessionUserId` calls `getServerSession` with `authOptions`. |
| `pages/api/_shared/ownership.ts`        | `lib/prisma.ts`                   | owner-scoped queries                    | WIRED  | `findFirst` queries use `user_id` or `vehicle.user_id`.             |
| `pages/api/vehicles/index.ts`           | `pages/api/_shared/auth.ts`       | `requireSessionUserId`                  | WIRED  | Session guard used in GET/POST.                                     |
| `pages/api/vehicles/[id].ts`            | `pages/api/_shared/ownership.ts`  | `ensureOwnedVehicle`                    | WIRED  | Ownership checks precede GET/PUT/DELETE.                            |
| `pages/api/vehicles/[id]/statistics.ts` | `pages/api/_shared/errors.ts`     | `sendForbiddenAsNotFound`               | WIRED  | Non-owner path returns NOT_FOUND envelope.                          |
| `pages/api/vehicles/index.ts`           | `pages/api/_shared/errors.ts`     | `sendUnauthenticated`                   | WIRED  | Enforced through `requireSessionUserId`.                            |
| `pages/api/vehicles/[id].ts`            | `pages/api/_shared/errors.ts`     | `sendForbidden`                         | WIRED  | Non-owner writes return FORBIDDEN envelope.                         |
| `pages/api/fueling/index.ts`            | `pages/api/_shared/ownership.ts`  | `ensureOwnedVehicle`                    | WIRED  | Ownership check before create and list filter.                      |
| `pages/api/fueling/[id].ts`             | `pages/api/_shared/ownership.ts`  | `ensureOwnedFueling`                    | WIRED  | Ownership guard before read/write.                                  |
| `hooks/useCreateFueling.ts`             | `pages/api/fueling/index.ts`      | `error.message` parsing                 | WIRED  | Error parsing reads standardized envelope.                          |
| `pages/api/fueling/index.ts`            | `pages/api/_shared/errors.ts`     | `sendUnauthenticated`                   | WIRED  | Enforced via `requireSessionUserId`.                                |
| `pages/api/fueling/[id].ts`             | `pages/api/_shared/errors.ts`     | `sendForbiddenAsNotFound`               | WIRED  | Non-owner GET uses NOT_FOUND envelope.                              |
| `hooks/useUpdateFueling.ts`             | `pages/api/fueling/[id].ts`       | `error.message` parsing                 | WIRED  | Error parsing reads standardized envelope.                          |

### Requirements Coverage

| Requirement                  | Status | Blocking Issue                                                   |
| ---------------------------- | ------ | ---------------------------------------------------------------- |
| Phase 6 requirements mapping | N/A    | No explicit requirements mapped to Phase 6 in `REQUIREMENTS.md`. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| None | -    | -       | -        | -      |

### Human Verification Required

### 1. Unauthenticated API access is rejected

**Test:** Call vehicle, vehicle stats, and fueling endpoints without a session.
**Expected:** 401 with `{ error: { code: UNAUTHENTICATED } }`.
**Why human:** Requires live session handling.

### 2. Non-owner read access is cloaked

**Test:** Access another user's vehicle detail/statistics with a valid session.
**Expected:** 403 with NOT_FOUND envelope and generic message.
**Why human:** Requires cross-user data and real requests.

### 3. Non-owner write access is blocked without side effects

**Test:** Attempt PUT/DELETE on another user's vehicle and create/update/delete fueling for another user's vehicle.
**Expected:** 403 with FORBIDDEN and no data mutations.
**Why human:** Requires data inspection after requests.

### 4. Fueling mutation hooks surface server error messages

**Test:** Trigger 401/403 from fueling mutations in UI.
**Expected:** Toast shows server `error.message`.
**Why human:** Requires UI interaction and API responses.

### Gaps Summary

No structural gaps found. Runtime behavior still needs human verification for response codes, envelopes, and side-effect guarantees.

---

_Verified: 2026-02-06T15:37:36Z_
_Verifier: Claude (gsd-verifier)_
