# Phase 9: Vehicle Auth Protection - Research

**Researched:** 2026-02-06
**Domain:** Next.js Pages Router authentication gating with NextAuth
**Confidence:** HIGH

## Summary

This phase is about enforcing client-side authentication redirects on all vehicle-related pages in a Next.js Pages Router app using NextAuth. The codebase already uses `useSession` in some pages and configures a custom sign-in route via `pages.signIn`, so the standard approach is to apply the same `useSession({ required: true, onUnauthenticated })` pattern consistently across the remaining vehicle pages.

NextAuth's client hook supports a `required` flag that triggers an auth check and, by default, redirects to the configured sign-in page when unauthenticated. The app already provides a sign-in page (`/auth/signin`) and a layout that switches based on session presence, so the recommended approach is page-level `useSession` guards with a loading state before rendering page data.

**Primary recommendation:** Use `useSession({ required: true, onUnauthenticated: () => router.push('/auth/signin') })` on every vehicle page and render a loading state while status is `loading`.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library         | Version | Purpose                | Why Standard                                                  |
| --------------- | ------- | ---------------------- | ------------------------------------------------------------- |
| next            | 16.1.4  | Pages Router framework | Project framework and routing layer                           |
| next-auth       | 4.24.13 | Authentication         | Auth provider with `useSession` client guard                  |
| next-auth/react | 4.24.13 | Client auth hooks      | Provides `useSession` with `required` and `onUnauthenticated` |
| next/router     | 16.1.4  | Client routing         | Used for redirect to `/auth/signin`                           |

### Supporting

| Library          | Version | Purpose        | When to Use                                         |
| ---------------- | ------- | -------------- | --------------------------------------------------- |
| @chakra-ui/react | 3.31.0  | Loading states | Render `Loading` or skeletons while auth check runs |

### Alternatives Considered

| Instead of                     | Could Use                          | Tradeoff                                                                                  |
| ------------------------------ | ---------------------------------- | ----------------------------------------------------------------------------------------- |
| Client-side `useSession` guard | `getServerSideProps` session check | SSR redirect is heavier and contradicts the phase decision for client-side auth redirects |

**Installation:**

```bash
npm install next-auth
```

## Architecture Patterns

### Recommended Project Structure

```
pages/
├── vehicles/        # Protected vehicle routes (list/detail/create/edit)
├── auth/            # Sign-in page
components/
├── layout/          # Authenticated vs public layout switch
```

### Pattern 1: Page-level client auth guard

**What:** Use `useSession` with `required: true` to enforce authentication and redirect unauthenticated users to the sign-in page.
**When to use:** Any vehicle page that should require authentication.
**Example:**

```tsx
// Source: https://github.com/nextauthjs/docs/blob/main/docs/getting-started/client.md
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function ProtectedPage() {
	const router = useRouter();
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			router.push('/auth/signin');
		},
	});

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	return <div>Protected Content</div>;
}
```

### Pattern 2: Rely on configured sign-in page

**What:** Set `pages.signIn` in NextAuth config so required-session redirects land on `/auth/signin`.
**When to use:** Always, to keep redirect targets consistent.
**Example:**

```ts
// Source: https://github.com/nextauthjs/docs/blob/main/docs/getting-started/client.md
export const authOptions = {
	pages: {
		signIn: '/auth/signin',
	},
};
```

### Anti-Patterns to Avoid

- **Rendering protected content while `status === 'loading'`:** causes visible flashes and can fire data requests before redirect.
- **Manual localStorage auth checks:** bypasses NextAuth session state and introduces stale/invalid auth states.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem            | Don't Build                                               | Use Instead                      | Why                                                        |
| ------------------ | --------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------- |
| Client auth gating | Custom session flag or manual `/api/auth/session` polling | `useSession({ required: true })` | Built-in redirect, consistent auth state, fewer edge cases |

**Key insight:** NextAuth already handles session validity and redirect behavior; duplicating it creates drift and race conditions.

## Common Pitfalls

### Pitfall 1: Missing loading guard

**What goes wrong:** The page renders or fetches data before auth resolves, then redirects, causing flicker and unnecessary API calls.
**Why it happens:** `useSession` starts in `loading` state.
**How to avoid:** Render a `Loading` component or skeleton while `status === 'loading'`.
**Warning signs:** API requests firing for unauthenticated users, UI flash before redirect.

### Pitfall 2: Redirect loops on sign-in page

**What goes wrong:** Using `useSession({ required: true })` on the sign-in page creates a loop.
**Why it happens:** The sign-in page is reachable without auth and should not require a session.
**How to avoid:** Do not add required-session guards to `/auth/signin`.
**Warning signs:** The browser rapidly redirects between protected page and sign-in.

## Code Examples

Verified patterns from official sources:

### Require session with custom unauthenticated handler

```tsx
// Source: https://github.com/nextauthjs/docs/blob/main/docs/getting-started/client.md
import { useSession } from 'next-auth/react';

export default function Admin() {
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			// The user is not authenticated, handle it here.
		},
	});

	if (status === 'loading') {
		return 'Loading or not authenticated...';
	}

	return 'User is logged in';
}
```

## State of the Art

| Old Approach                                      | Current Approach                                    | When Changed               | Impact                                                         |
| ------------------------------------------------- | --------------------------------------------------- | -------------------------- | -------------------------------------------------------------- |
| `getServerSideProps` session checks for each page | Client-side `useSession({ required: true })` guards | N/A (co-existing patterns) | Reduces SSR load and aligns with client-side redirect decision |

**Deprecated/outdated:**

- None identified in this scope.

## Open Questions

1. **Should auth guards also delay data queries until authenticated?**
   - What we know: `useSession` starts in `loading` state and can redirect on unauthenticated.
   - What's unclear: Whether vehicle pages currently fire data queries before auth settles.
   - Recommendation: In planning, gate data queries on `status === 'authenticated'` where needed.

## Sources

### Primary (HIGH confidence)

- /nextauthjs/docs - `useSession` with `required` and `onUnauthenticated` examples
- https://github.com/nextauthjs/docs/blob/main/docs/getting-started/client.md - client session protection behavior

### Secondary (MEDIUM confidence)

- None

### Tertiary (LOW confidence)

- None

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - versions confirmed from `package.json` and NextAuth docs
- Architecture: HIGH - NextAuth official client guard patterns
- Pitfalls: MEDIUM - inferred from hook behavior and app patterns

**Research date:** 2026-02-06
**Valid until:** 2026-03-08
