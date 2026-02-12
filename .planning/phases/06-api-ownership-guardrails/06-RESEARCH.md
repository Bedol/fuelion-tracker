# Phase 6: API Ownership Guardrails - Research

**Researched:** 2026-02-06
**Domain:** Next.js Pages Router API authorization and Prisma ownership enforcement
**Confidence:** HIGH

## Summary

This phase is a security-hardening phase for existing API routes, not a feature phase. The current implementation has major ownership gaps: several endpoints are either completely unauthenticated (`/api/vehicles`, `/api/vehicles/[id]`) or authenticated but not ownership-scoped (`/api/fueling`, `/api/fueling/[id]`, `/api/vehicles/[id]/statistics`). In current state, authenticated and unauthenticated callers can read/mutate cross-user records by guessing IDs.

The standard approach for this stack is: (1) enforce auth with `getServerSession(req, res, authOptions)` in every protected route, and (2) enforce ownership in Prisma `where` clauses using `user_id` directly or relation filters (`vehicle: { user_id: session.user.id }`). For write operations that currently involve multiple DB steps (fueling create/update + vehicle mileage updates), use Prisma transactions where needed to keep behavior strict and avoid partial side effects.

This phase should be implemented with shared API helpers for auth + error envelope + ownership guard checks, then applied endpoint-by-endpoint. Locked behavior decisions (403 for non-owner ID reads with generic not-found wording, 401 for unauthenticated, consistent error envelope/codes) are implementable without adding dependencies.

**Primary recommendation:** Add shared auth/error/ownership guard helpers, then refactor all target endpoints to require session + ownership-scoped Prisma queries, returning one standardized error envelope (`401`/`403`) with machine-readable codes.

## Current-State Audit

### Endpoint-by-endpoint findings

| Endpoint                            | Current Auth             | Current Ownership Guard                   | Gap / Bypass                                                                                                    | Confidence |
| ----------------------------------- | ------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------- |
| `/api/vehicles` GET                 | None                     | None (`findMany()` all vehicles)          | Any caller can list all vehicles from all users                                                                 | HIGH       |
| `/api/vehicles` POST                | None                     | None (`create({ data: body })`)           | Caller can set arbitrary `user_id` in request body and create records for another user                          | HIGH       |
| `/api/vehicles/[id]` GET            | None                     | None (`findUnique({ id })`)               | Any caller can read any vehicle by id                                                                           | HIGH       |
| `/api/vehicles/[id]` PUT            | None                     | None (`update({ id })`)                   | Any caller can update any vehicle by id                                                                         | HIGH       |
| `/api/vehicles/[id]` DELETE         | None                     | None (`delete({ id })`)                   | Any caller can delete any vehicle by id                                                                         | HIGH       |
| `/api/fueling` GET                  | Yes (`getServerSession`) | None (`where: { vehicle_id }`)            | Any authenticated user can list fuelings for another user's vehicle id                                          | HIGH       |
| `/api/fueling` POST                 | Yes (`getServerSession`) | None                                      | Any authenticated user can create fueling on another user's vehicle id; also mutates vehicle mileage cross-user | HIGH       |
| `/api/fueling/[id]` GET             | Yes                      | None (`findUnique({ id })`)               | Any authenticated user can read any fueling by id                                                               | HIGH       |
| `/api/fueling/[id]` PUT             | Yes                      | None (`update({ id })`)                   | Any authenticated user can update any fueling by id                                                             | HIGH       |
| `/api/fueling/[id]` DELETE          | Yes                      | None (`delete({ id })`)                   | Any authenticated user can delete any fueling by id                                                             | HIGH       |
| `/api/vehicles/[id]/statistics` GET | Yes                      | None (`fueling.findMany({ vehicle_id })`) | Any authenticated user can read statistics for another user's vehicle id                                        | HIGH       |

### Additional observed risks relevant to planning

- `pages/api/vehicles/index.ts` and `pages/api/vehicles/[id].ts` do not use NextAuth at all.
- `pages/api/vehicles/index.ts` trusts the request body wholesale on create; this is the highest-risk ownership bypass.
- Fueling create/update perform multiple DB writes outside a transaction; ownership checks must happen before first write, and multi-write consistency should be reviewed for strict no-op semantics on guard failures.
- Existing API error shapes are inconsistent (`{ error: '...' }`, sometimes expected as `message` by client hooks), so standardization work must include a compatibility plan.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library                     | Version    | Purpose                                           | Why Standard                                               |
| --------------------------- | ---------- | ------------------------------------------------- | ---------------------------------------------------------- |
| `next`                      | `^16.1.4`  | Pages Router API endpoints                        | Existing API surface lives in `pages/api/*`                |
| `next-auth`                 | `^4.24.13` | Session auth in API routes via `getServerSession` | Existing auth strategy and session shape already in app    |
| `@prisma/client` / `prisma` | `^6.19.2`  | Ownership-scoped data access and writes           | Existing ORM and schema define `Vehicle.user_id` ownership |
| `typescript`                | `^5.9.3`   | Typed API contracts and helper reuse              | Existing codebase language and conventions                 |

### Supporting

| Library                      | Version | Purpose                                        | When to Use                                                                    |
| ---------------------------- | ------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `next-auth` session callback | current | Exposes `session.user.id` from JWT `token.sub` | Required for ownership filtering by user ID                                    |
| Prisma relation filters      | current | Filter child records by parent ownership       | Required for fueling/statistics ownership chain (`Fueling -> Vehicle.user_id`) |
| Prisma `$transaction`        | current | Atomic multi-write operations                  | Use for create/update flows that touch fueling and vehicle together            |

### Alternatives Considered

| Instead of                              | Could Use                                     | Tradeoff                                                                                                         |
| --------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Inline per-route auth/guard/error logic | Shared helper module                          | Inline is faster initially but repeats security-critical logic and drifts behavior                               |
| Pre-check then `update/delete` by ID    | `updateMany/deleteMany` with ownership filter | `updateMany/deleteMany` avoids P2025 exceptions and is safer for guarded mutations, but returns count not entity |

**Installation:**

```bash
# No new dependencies required for this phase.
```

## Architecture Patterns

### Recommended Project Structure

```
pages/
└── api/
    ├── _shared/
    │   ├── auth.ts         # requireSessionUserId(req,res)
    │   ├── errors.ts       # error envelope + helpers
    │   └── ownership.ts    # guard helpers for vehicle/fueling ownership
    ├── vehicles/
    │   ├── index.ts
    │   └── [id].ts
    └── fueling/
        ├── index.ts
        └── [id].ts
```

### Pattern 1: Centralized auth guard for API routes

**What:** Use one helper that obtains session and returns `userId` or writes `401` envelope.
**When to use:** First line in all protected route handlers.
**Example:**

```typescript
// Source: https://next-auth.js.org/configuration/nextjs
const session = await getServerSession(req, res, authOptions);
if (!session) {
	return res.status(401).json({ message: 'You must be logged in.' });
}
```

### Pattern 2: Ownership enforced in Prisma `where` clauses

**What:** Scope reads/writes by authenticated owner at query level (not post-query checks only).
**When to use:** All list/detail/mutation operations on Vehicle and Fueling.
**Example:**

```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/crud
const fuelings = await prisma.fueling.findMany({
	where: {
		vehicle_id: Number(vehicleId),
		vehicle: { user_id: session.user.id },
	},
});
```

### Pattern 3: Guarded multi-write operations wrapped in transaction

**What:** For flows that write fueling + update vehicle mileage, keep dependent writes atomic.
**When to use:** Fueling create/update where second write depends on first result.
**Example:**

```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
await prisma.$transaction([
	prisma.fueling.create({ data: fuelingData }),
	prisma.vehicle.update({
		where: { id: vehicleId },
		data: { mileage: newMileage },
	}),
]);
```

### Pattern 4: Shared error envelope for auth/ownership failures

**What:** Return one JSON envelope shape for `401` and `403` across all targeted endpoints.
**When to use:** Any unauthenticated or ownership-violation branch.
**Example:**

```typescript
type ApiErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND';

type ApiErrorEnvelope = {
	error: {
		code: ApiErrorCode;
		message: string;
		details?: Record<string, string | number | boolean>;
	};
};
```

### Anti-Patterns to Avoid

- **Auth in some handlers only:** every method branch (`GET`/`PUT`/`DELETE`/`POST`) must enforce session before data access.
- **Ownership check after write:** check ownership before first mutation query.
- **Ad hoc error payloads:** avoid mixed `{ error: '...' }` vs `{ message: '...' }` for auth/guard failures.
- **Trusting client-provided `user_id`:** derive owner solely from session, never from body/query.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem                 | Don't Build                                | Use Instead                                         | Why                                                                 |
| ----------------------- | ------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------- |
| Server auth parsing     | Manual cookie/JWT parsing in handlers      | `getServerSession(req,res,authOptions)`             | Official NextAuth path, less auth drift and fewer security mistakes |
| Ownership filtering     | In-memory post-filtering after broad query | Prisma `where` with direct/relational owner filters | Enforces at DB query level; avoids accidental leakage               |
| Multi-write consistency | Manual rollback logic across queries       | Prisma `$transaction`                               | Native atomicity, cleaner strict no-op semantics                    |
| Error contract spread   | Per-endpoint bespoke JSON errors           | Shared envelope builder/helper                      | Keeps machine-readable behavior consistent across endpoints         |

**Key insight:** Authorization bugs in this phase come from inconsistent patterns, not missing libraries; centralize guardrails rather than adding new packages.

## Common Pitfalls

### Pitfall 1: Vehicle list/create left unauthenticated

**What goes wrong:** Full cross-user data leakage and spoofed ownership creation remain possible.
**Why it happens:** Vehicles routes currently have no session checks.
**How to avoid:** Add auth guard at top of `pages/api/vehicles/index.ts` and `pages/api/vehicles/[id].ts` for all methods.
**Warning signs:** API works without login cookie; POST accepts arbitrary `user_id`.

### Pitfall 2: Fueling ownership checked by `vehicle_id` only

**What goes wrong:** Authenticated user can read/create/edit/delete fuelings for another user's vehicle.
**Why it happens:** Current queries do not constrain `vehicle.user_id`.
**How to avoid:** Apply relation filter (`vehicle: { user_id: session.user.id }`) or owned-vehicle pre-check before writes.
**Warning signs:** User A can access User B data by changing URL id/query params.

### Pitfall 3: Non-owner GET-by-id returns wrong status/message

**What goes wrong:** Behavior diverges from locked contract.
**Why it happens:** Default tendency is 404 or 403 with explicit forbidden wording.
**How to avoid:** Enforce contract: `403` status with generic not-found wording for non-owner GET-by-id/statistics.
**Warning signs:** Endpoint returns `404` or explicit ownership wording.

### Pitfall 4: Guard failures still trigger writes in multi-step flow

**What goes wrong:** Partial side effects despite ownership failure policy.
**Why it happens:** Guard check after first write or no transaction wrapping for dependent writes.
**How to avoid:** Guard before first mutation; use transaction for dependent writes.
**Warning signs:** Fueling row created even when later step fails.

### Pitfall 5: Inconsistent 401 payload shape across endpoints

**What goes wrong:** Client behavior is brittle and endpoint-specific.
**Why it happens:** Existing handlers return different JSON structures/messages.
**How to avoid:** Central response helper for all auth failures in target endpoints.
**Warning signs:** Some endpoints return `{ error }`, others `{ message }`, no code field.

## Code Examples

Verified patterns from official sources:

### NextAuth server-side API route auth check

```typescript
// Source: https://next-auth.js.org/configuration/nextjs
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		res.status(401).json({ message: 'You must be logged in.' });
		return;
	}
}
```

### Prisma relation filtering for ownership scoping

```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/crud
const result = await prisma.fueling.findMany({
	where: {
		vehicle: {
			user_id: session.user.id,
		},
	},
});
```

### Prisma transaction for all-or-nothing multi-step writes

```typescript
// Source: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
await prisma.$transaction([
	prisma.fueling.create({ data: fuelingData }),
	prisma.vehicle.update({
		where: { id: fuelingData.vehicle_id },
		data: { mileage: nextMileage },
	}),
]);
```

### Recommended codebase-specific guard flow (target pattern)

```typescript
const userId = await requireSessionUserId(req, res);
if (!userId) return;

const vehicleId = parseId(req.query.id);
if (!vehicleId) return sendBadRequest(res, 'INVALID_ID');

const ownedVehicle = await prisma.vehicle.findFirst({
	where: { id: vehicleId, user_id: userId },
	select: { id: true },
});

if (!ownedVehicle) {
	return sendForbiddenNotFound(res); // 403 + generic not-found wording
}
```

## State of the Art

| Old Approach                          | Current Approach      | When Changed                  | Impact                                             |
| ------------------------------------- | --------------------- | ----------------------------- | -------------------------------------------------- |
| `unstable_getServerSession`           | `getServerSession`    | NextAuth v4                   | Stable server-side auth helper in Pages API routes |
| Manual ad hoc multi-query consistency | Prisma `$transaction` | Prisma Client mature guidance | Prevents partial side effects in multi-write flows |

**Deprecated/outdated:**

- `unstable_getServerSession`: replaced by `getServerSession` in NextAuth v4 docs.
- Trusting client-provided ownership fields (`user_id`): outdated security model for authenticated APIs.

## Proposed Error Contract (Locked-Behavior Mapping)

### Envelope

```json
{
	"error": {
		"code": "UNAUTHENTICATED",
		"message": "Authentication required.",
		"details": {
			"hint": "Sign in and retry."
		}
	}
}
```

### Status and code mapping

| Scenario                                                                          | HTTP | `error.code`      | Message guidance                                             |
| --------------------------------------------------------------------------------- | ---: | ----------------- | ------------------------------------------------------------ |
| Missing/expired session                                                           |  401 | `UNAUTHENTICATED` | Standard English message, same across all affected endpoints |
| Non-owner GET-by-id (`vehicles/[id]`, `fueling/[id]`, `vehicles/[id]/statistics`) |  403 | `NOT_FOUND`       | Generic not-found wording (no ownership disclosure)          |
| Non-owner PUT/DELETE; cross-owner fueling POST                                    |  403 | `FORBIDDEN`       | Consistent ownership-failure message family                  |

Implementation note: using `NOT_FOUND` code with `403` status is acceptable and aligns with locked contract (cloak resource existence while preserving forbidden semantics).

## Planning Guidance (Executable Waves)

### Wave 1 (Foundation): Shared guardrail primitives

**Goal:** Establish reusable auth + error + ownership helpers.

1. Add shared API helper module(s) for:
   - `requireSessionUserId(req,res)`
   - standardized `sendError(res, status, code, message, details?)`
   - ownership helper(s) for vehicle/fueling checks
2. Define and export TypeScript types for error envelope and error codes.
3. Add one minimal integration touchpoint in a single endpoint to validate helper ergonomics.

**Dependency:** None.

### Wave 2 (Core enforcement): Vehicles + Fueling endpoints

**Goal:** Close all read/write ownership gaps in the highest-risk CRUD routes.

1. Refactor `/api/vehicles`:
   - require auth for `GET` and `POST`
   - `GET`: scope to `user_id = session.user.id` (recommended list behavior: silent filtering)
   - `POST`: overwrite/derive `user_id` from session only
2. Refactor `/api/vehicles/[id]`:
   - require auth for all methods
   - enforce owner on `GET/PUT/DELETE`
   - apply locked `403 + generic not-found wording` for non-owner reads
3. Refactor `/api/fueling` and `/api/fueling/[id]`:
   - enforce ownership through `vehicle.user_id` chain
   - reject cross-owner create/edit/delete with `403`
   - ensure no-op on ownership failures
4. Wrap dependent fueling/vehicle write sequence(s) in transaction where needed.

**Dependency:** Wave 1 helpers.

### Wave 3 (Parity + verification): Statistics and regression checks

**Goal:** Align statistics endpoint behavior and verify contract consistency.

1. Refactor `/api/vehicles/[id]/statistics` to enforce owner guard with same semantics as other GET-by-id endpoints.
2. Normalize all affected endpoint auth/ownership errors to one envelope.
3. Run manual contract matrix checks (401/403/success/no-op).
4. Capture verification notes for phase summary.

**Dependency:** Wave 2 route patterns.

## Verification Approach (No Test Framework)

### Commands

```bash
npm run lint
npm run build
```

### Manual API contract checks (recommended)

Use two authenticated users (A and B), plus unauthenticated requests. Verify with browser devtools or REST client:

1. Unauthenticated to each target endpoint returns `401` + standard envelope.
2. User A can access own vehicle/fueling/statistics successfully.
3. User A GET by id on B-owned resource returns `403` + generic not-found wording.
4. User A PUT/DELETE on B-owned resource returns `403` and DB remains unchanged.
5. User A POST fueling against B-owned `vehicle_id` returns `403` and creates no fueling row.
6. Statistics endpoint matches same ownership behavior as other GET-by-id endpoints.
7. List behavior check (`/api/vehicles`, `/api/fueling?vehicleId=`): confirm chosen policy (recommended silent filtering) and ensure no cross-user leakage.

### Suggested manual matrix

| Endpoint                        | Unauth | Owner   | Non-owner read-by-id     | Non-owner write          |
| ------------------------------- | ------ | ------- | ------------------------ | ------------------------ |
| `/api/vehicles`                 | 401    | 200/201 | n/a                      | n/a                      |
| `/api/vehicles/[id]`            | 401    | 200     | 403 + generic not-found  | 403                      |
| `/api/fueling`                  | 401    | 200/201 | list behavior per policy | 403 (cross-owner create) |
| `/api/fueling/[id]`             | 401    | 200     | 403 + generic not-found  | 403                      |
| `/api/vehicles/[id]/statistics` | 401    | 200     | 403 + generic not-found  | n/a                      |

## Open Questions

1. **List endpoint non-owner behavior policy finalization**
   - What we know: phase context leaves list behavior to implementation discretion if ownership is enforced.
   - What's unclear: whether API should return filtered empty results vs explicit 403 when a foreign `vehicleId` is passed to list-style fueling endpoint.
   - Recommendation: choose silent filtering for lists to reduce information disclosure and keep UI resilient.

2. **Client error parsing compatibility**
   - What we know: some hooks currently read `errorData.message`; APIs often return `{ error: '...' }` today.
   - What's unclear: whether this phase includes client hook updates for new envelope consistency.
   - Recommendation: include a small compatibility update in the same phase or maintain temporary `message` mirror in server envelope.

## Sources

### Primary (HIGH confidence)

- Code audit:
  - `pages/api/vehicles/index.ts`
  - `pages/api/vehicles/[id].ts`
  - `pages/api/fueling/index.ts`
  - `pages/api/fueling/[id].ts`
  - `pages/api/vehicles/[id]/statistics.ts`
  - `pages/api/auth/[...nextauth].ts`
  - `prisma/schema.prisma`
- NextAuth v4 docs: https://next-auth.js.org/configuration/nextjs (getServerSession for API routes)
- Prisma docs: https://www.prisma.io/docs/orm/prisma-client/queries/crud (relation filters, CRUD patterns)
- Prisma docs: https://www.prisma.io/docs/orm/prisma-client/queries/transactions (atomic writes with `$transaction`)
- Context7 `/vercel/next.js/v16.1.5` (Pages API route response patterns)
- Context7 `/prisma/docs` (relation filtering, `updateMany`, transactions)

### Secondary (MEDIUM confidence)

- Context7 `/nextauthjs/next-auth` (v4->v5 migration docs include legacy `getServerSession` patterns; used only as supplemental context)

### Tertiary (LOW confidence)

- None

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - verified from `package.json`, codebase usage, and official docs
- Architecture: HIGH - directly derived from current repo patterns plus official NextAuth/Prisma guidance
- Pitfalls: HIGH - confirmed by direct endpoint audit and schema ownership model

**Research date:** 2026-02-06
**Valid until:** 2026-03-08
