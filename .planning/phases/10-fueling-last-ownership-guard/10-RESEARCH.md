# Phase 10: Fueling Last Ownership Guard - Research

**Researched:** 2026-02-08
**Domain:** Next.js Pages Router API authorization + Prisma ownership scoping
**Confidence:** MEDIUM

## Summary

This phase is a narrow security hardening task: enforce per-user ownership on the `/api/fueling/last` endpoint so smart defaults never leak data across users. The existing codebase already has shared auth and ownership helpers used by other API routes, and the requirement is to align this endpoint with that established pattern.

The standard approach in this repo is: require a session user id, validate query params, confirm vehicle ownership, then query Prisma with the ownership constraint and `orderBy` date descending. Error responses should use the shared API error envelope for 401/404/400 conditions.

**Primary recommendation:** Use `requireSessionUserId` + `ensureOwnedVehicle` and a Prisma `findFirst` filtered by `vehicle_id` and ordered by `date: 'desc'`, returning standard error payloads for 401/400/404.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library        | Version | Purpose                               | Why Standard                                    |
| -------------- | ------- | ------------------------------------- | ----------------------------------------------- |
| next           | 16.1.4  | Next.js Pages Router API routes       | Official framework for API handlers in this app |
| next-auth      | 4.24.13 | Session handling in API routes        | Standard auth provider in this codebase         |
| @prisma/client | 6.19.2  | Data access with relational filtering | Standard ORM used for all queries               |

### Supporting

| Library | Version | Purpose | When to Use                                     |
| ------- | ------- | ------- | ----------------------------------------------- |
| N/A     | N/A     | N/A     | No additional libraries required for this phase |

### Alternatives Considered

| Instead of             | Could Use | Tradeoff                                                         |
| ---------------------- | --------- | ---------------------------------------------------------------- |
| N/A (locked decisions) | N/A       | Phase decisions lock the stack to existing auth + Prisma helpers |

**Installation:**

```bash
npm install
```

## Architecture Patterns

### Recommended Project Structure

```
pages/
├── api/
│   ├── _shared/        # auth + ownership helpers + error envelopes
│   └── fueling/        # fueling endpoints (index, [id], last)
```

### Pattern 1: Ownership-Scoped GET for Smart Defaults

**What:** Require session, validate `vehicleId`, verify ownership, then query last fueling by date.
**When to use:** Any API route that returns data scoped to a specific vehicle.
**Example:**

```typescript
// Source: https://github.com/vercel/next.js/blob/v16.1.5/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'GET') {
		// Guard + query here
	} else {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
```

### Pattern 2: Prisma `findFirst` with Ownership Filter + Order

**What:** Filter by ownership and `vehicle_id`, order by date descending.
**When to use:** Returning the latest record for a vehicle.
**Example:**

```typescript
// Source: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/030-crud.mdx
const lastFueling = await prisma.fueling.findFirst({
	where: {
		vehicle_id: vehicleId,
		vehicle: { user_id: userId },
	},
	orderBy: { date: 'desc' },
});
```

### Anti-Patterns to Avoid

- **Querying by `vehicle_id` only:** Returns data for vehicles not owned by the session user.
- **Skipping `vehicleId` validation:** Allows array/NaN values that lead to incorrect queries.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem            | Don't Build              | Use Instead                                                                       | Why                                             |
| ------------------ | ------------------------ | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| Session validation | Custom session parsing   | `requireSessionUserId` in `pages/api/_shared/auth.ts`                             | Centralizes auth checks + standard 401 envelope |
| Ownership checks   | Manual joins everywhere  | `ensureOwnedVehicle` / `getOwnedFuelingWhere` in `pages/api/_shared/ownership.ts` | Consistent ownership enforcement across routes  |
| Error payloads     | Ad-hoc JSON error bodies | `sendApiError` helpers in `pages/api/_shared/errors.ts`                           | Ensures standard error shape and codes          |

**Key insight:** The repo already codifies auth/ownership behavior; reusing it prevents inconsistent error formats and authorization gaps.

## Common Pitfalls

### Pitfall 1: Ownership leakage via partial filtering

**What goes wrong:** Filtering by `vehicle_id` alone returns records for another user's vehicle.
**Why it happens:** The endpoint skips the ownership guard or uses only the vehicle filter.
**How to avoid:** Verify ownership via `ensureOwnedVehicle` or `getOwnedFuelingWhere(userId)` before returning data.
**Warning signs:** Smart defaults show another user's data or tests using a non-owned vehicle pass unexpectedly.

### Pitfall 2: Inconsistent error envelopes

**What goes wrong:** The endpoint returns plain `{ error: '...' }` strings instead of the standard envelope.
**Why it happens:** Using legacy patterns from older endpoints instead of shared helpers.
**How to avoid:** Use `sendUnauthenticated` / `sendApiError` to return the standard error shape.
**Warning signs:** Frontend error handling diverges or analytics show mixed error formats.

### Pitfall 3: Treating missing fuelings as authorization failure

**What goes wrong:** The endpoint can no longer differentiate a valid vehicle with no fuelings.
**Why it happens:** Ownership guard is applied only in the query with no explicit vehicle ownership check.
**How to avoid:** Check vehicle ownership first when required behavior differs; otherwise use the same 404 payload for both to avoid leaks.
**Warning signs:** Users with new vehicles always see “not found” even though ownership is valid.

## Code Examples

Verified patterns from official sources:

### Next.js API Route Method Guard

```typescript
// Source: https://github.com/vercel/next.js/blob/v16.1.5/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		// Process a POST request
	} else {
		// Handle any other HTTP method
	}
}
```

### Prisma findFirst with orderBy

```typescript
// Source: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/030-crud.mdx
const latestUser = await prisma.user.findFirst({
	where: {
		posts: { some: { published: true } },
	},
	orderBy: { createdAt: 'desc' },
});
```

## State of the Art

| Old Approach                      | Current Approach        | When Changed      | Impact                                               |
| --------------------------------- | ----------------------- | ----------------- | ---------------------------------------------------- |
| `getServerSession` in NextAuth v4 | `auth()` in NextAuth v5 | v5 migration docs | Simpler session retrieval, but project remains on v4 |

**Deprecated/outdated:**

- `getServerSession` is the older pattern in NextAuth v4; v5 docs recommend `auth()` but upgrading is out of scope for this phase.

## Open Questions

None.

## Sources

### Primary (HIGH confidence)

- https://github.com/vercel/next.js/blob/v16.1.5/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx - API route handler + method guard patterns
- https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/030-crud.mdx - `findFirst` with `where` + `orderBy`
- https://github.com/nextauthjs/next-auth/blob/main/docs/pages/getting-started/migrating-to-v5.mdx - `getServerSession` (v4) vs `auth()` (v5) context

### Secondary (MEDIUM confidence)

- https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/037-relation-queries.mdx - relation filters + ordering

### Tertiary (LOW confidence)

- None

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - versions verified from `package.json`
- Architecture: MEDIUM - relies on project patterns plus official API route/Prisma docs
- Pitfalls: MEDIUM - derived from existing repo usage and decision constraints

**Research date:** 2026-02-08
**Valid until:** 2026-03-10
