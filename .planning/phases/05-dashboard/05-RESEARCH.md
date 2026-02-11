# Phase 5: Dashboard - Research

**Researched:** 2026-02-06
**Domain:** Next.js Pages Router dashboard with aggregated vehicle/fueling data
**Confidence:** MEDIUM

## Summary

This research focuses on implementing the authenticated dashboard landing page in a Next.js Pages Router app that uses TanStack Query for data fetching, Chakra UI for layout, and NextAuth for session gating. The key implementation concern is aggregating data across vehicles (summary stats + recent activity) while keeping the page responsive and consistent with existing loading/error patterns.

The standard approach in this codebase is client-side data fetching via React Query against Next.js API routes, with server session checks in API handlers and Chakra/Tailwind UI composition. For the dashboard, the recommended approach is to create a dedicated API route that returns both the vehicle summaries and recent activity in a single response, and to use a single React Query request (or a controlled set of parallel queries) with clear section-level skeletons.

**Primary recommendation:** Build a dedicated `/api/dashboard` (GET) endpoint that returns vehicles (alphabetical) with precomputed summary stats + last fueling date and a single recent activity list, then fetch it with TanStack Query and render section cards with SkeletonLoader/ErrorAlert.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library               | Version  | Purpose                            | Why Standard                                        |
| --------------------- | -------- | ---------------------------------- | --------------------------------------------------- |
| next                  | ^16.1.4  | Pages Router, routing, API routes  | Existing framework; file-based routing + API routes |
| react                 | ^19.2.3  | UI rendering                       | Core UI runtime                                     |
| @tanstack/react-query | ^5.90.19 | Client-side data fetching/caching  | Standard server-state management in app             |
| next-auth             | ^4.24.13 | Session/auth gating                | Current auth provider for pages/layout              |
| @chakra-ui/react      | ^3.31.0  | UI components (Card/Stat/Skeleton) | Standard component system in app                    |
| prisma                | ^6.19.2  | DB access in API routes            | Existing ORM for server-side data queries           |

### Supporting

| Library     | Version | Purpose         | When to Use                              |
| ----------- | ------- | --------------- | ---------------------------------------- |
| date-fns    | ^3.6.0  | Date formatting | Format fueling dates and relative times  |
| tailwindcss | ^4.1.17 | Utility styling | Existing layout utilities (grid/spacing) |
| react-icons | ^5.5.0  | Iconography     | Quick add button icons                   |

### Alternatives Considered

| Instead of            | Could Use                | Tradeoff                                                                 |
| --------------------- | ------------------------ | ------------------------------------------------------------------------ |
| @tanstack/react-query | swr                      | Loses existing query patterns and cache invalidation used across the app |
| Chakra UI components  | Tailwind-only components | Breaks established Chakra-based card/stat patterns                       |

**Installation:**

```bash
npm install @tanstack/react-query @chakra-ui/react @emotion/react @emotion/styled next-auth date-fns
```

## Architecture Patterns

### Recommended Project Structure

```
components/
├── dashboard/           # Dashboard-specific cards and lists
├── errors/              # ErrorAlert patterns
├── ui/                  # SkeletonLoader, shared UI primitives
pages/
├── index.tsx            # Dashboard landing page
└── api/dashboard.ts     # Aggregated dashboard data
hooks/
└── useDashboardData.ts  # React Query hook for dashboard data
```

### Pattern 1: Auth-gated dashboard page (Pages Router)

**What:** Use `useSession` with `required: true` and a skeleton while auth loads.
**When to use:** Dashboard landing page after sign-in.
**Example:**

```typescript
// Source: https://github.com/nextauthjs/next-auth/blob/main/docs/pages/getting-started/session-management/get-session.mdx
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  return <div>Welcome {session?.user?.name}</div>;
}
```

### Pattern 2: Aggregated dashboard data via a single API route

**What:** Add `/api/dashboard` (GET) to return vehicles + stats + recent activity.
**When to use:** Avoid N+1 queries and improve perceived performance.
**Example:**

```typescript
// Source: https://github.com/vercel/next.js/blob/v16.1.5/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ message: 'Hello from Next.js!' });
}
```

### Pattern 3: Parallel queries when payload must be split

**What:** Use `useQueries` to fetch per-vehicle stats or last fueling when needed.
**When to use:** If backend aggregation is not feasible in Phase 5.
**Example:**

```typescript
// Source: https://github.com/tanstack/query/blob/main/docs/framework/react/reference/useQueries.md
const ids = [1, 2, 3];
const results = useQueries({
	queries: ids.map((id) => ({
		queryKey: ['post', id],
		queryFn: () => fetchPost(id),
		staleTime: Infinity,
	})),
});
```

### Anti-Patterns to Avoid

- **Per-vehicle fetch loops with `useQuery` inside map:** use `useQueries` or an aggregated endpoint instead.
- **Using yearly stats as all-time totals:** `buildVehicleStatistics` computes totals for the selected year, not all-time.
- **Unscoped API queries:** vehicles/fuelings must be filtered by the authenticated user.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem              | Don't Build                | Use Instead                        | Why                                               |
| -------------------- | -------------------------- | ---------------------------------- | ------------------------------------------------- |
| Server state caching | Manual fetch + local state | TanStack React Query               | Handles caching, loading, retries, invalidation   |
| Date formatting      | Custom string formatting   | date-fns `format`/`formatDistance` | Correct locale-safe formatting, avoids token bugs |
| Loading placeholders | Custom CSS loaders         | `SkeletonLoader` / Chakra Skeleton | Consistent loading UX across app                  |

**Key insight:** Reusing React Query and existing UI primitives keeps the dashboard consistent with other phases and prevents divergent state/loading logic.

## Common Pitfalls

### Pitfall 1: All-time totals from yearly stats

**What goes wrong:** Dashboard shows totals for the current year only.
**Why it happens:** `buildVehicleStatistics` calculates totals using `selectedYear` fuelings.
**How to avoid:** Add an all-time aggregation path (or separate query) for total spent, total distance, and average consumption.
**Warning signs:** Totals drop to near-zero when a new year starts.

### Pitfall 2: N+1 network calls slows dashboard

**What goes wrong:** Each vehicle triggers multiple requests (stats + last fueling), causing slow loads.
**Why it happens:** Per-vehicle `useQuery` without aggregation.
**How to avoid:** Prefer a single `/api/dashboard` response or use `useQueries` with combined loading state.
**Warning signs:** Waterfall network in devtools; long pending state.

### Pitfall 3: Recent activity not scoped to user

**What goes wrong:** Activity includes other users' fuelings.
**Why it happens:** Missing session checks or user_id filters in API routes.
**How to avoid:** Use `getServerSession` in API handlers and filter by user_id.
**Warning signs:** Activity list shows vehicles not owned by signed-in user.

### Pitfall 4: Incorrect date formatting tokens

**What goes wrong:** Dates render with wrong year/day values.
**Why it happens:** Using `YYYY` or `DD` tokens instead of `yyyy` and `dd`.
**How to avoid:** Use date-fns unicode tokens (`yyyy-MM-dd`).
**Warning signs:** Dates show off-by-one or incorrect years.

## Code Examples

Verified patterns from official sources:

### React Query useQuery (object syntax)

```typescript
// Source: https://github.com/tanstack/query/blob/main/docs/framework/react/guides/queries.md
import { useQuery } from '@tanstack/react-query';

function App() {
	const info = useQuery({ queryKey: ['todos'], queryFn: fetchTodoList });
}
```

### Next.js API route

```typescript
// Source: https://github.com/vercel/next.js/blob/v16.1.5/docs/02-pages/03-building-your-application/01-routing/07-api-routes.mdx
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ message: 'Hello from Next.js!' });
}
```

### date-fns formatting

```javascript
// Source: https://github.com/date-fns/date-fns/blob/main/README.md
import { format } from 'date-fns';

format(new Date(2014, 1, 11), 'yyyy-MM-dd');
```

## State of the Art

| Old Approach          | Current Approach                  | When Changed   | Impact                                           |
| --------------------- | --------------------------------- | -------------- | ------------------------------------------------ |
| `useQuery('key', fn)` | `useQuery({ queryKey, queryFn })` | React Query v5 | Consistent options API and better type inference |

**Deprecated/outdated:**

- `YYYY-MM-DD` date tokens: date-fns requires unicode tokens like `yyyy-MM-dd`.

## Open Questions

1. **Should dashboard use a single aggregated endpoint or multiple queries?**
   - What we know: Multiple endpoints exist for vehicles, last fueling, and per-vehicle stats.
   - What's unclear: Whether Phase 5 should introduce a new `/api/dashboard` route for performance.
   - Recommendation: Prefer a single aggregated endpoint unless time is constrained.

## Sources

### Primary (HIGH confidence)

- /tanstack/query - queries, parallel queries, useQueries
- /vercel/next.js/v16.1.5 - pages router, API routes, Link/useRouter
- /nextauthjs/next-auth - useSession for session access
- /date-fns/date-fns - format/formatDistance guidance
- https://chakra-ui.com/docs/components/card - Card composition
- https://chakra-ui.com/docs/components/stat - Stat structure
- https://chakra-ui.com/docs/components/skeleton - Skeleton usage

### Secondary (MEDIUM confidence)

- /websites/chakra-ui - general Chakra UI component usage (version alignment not explicit)

### Tertiary (LOW confidence)

- None

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - verified from package.json and Context7 docs
- Architecture: MEDIUM - based on app patterns + docs; aggregation endpoint is a recommended strategy
- Pitfalls: MEDIUM - derived from repo logic and common React Query patterns

**Research date:** 2026-02-06
**Valid until:** 2026-03-08
