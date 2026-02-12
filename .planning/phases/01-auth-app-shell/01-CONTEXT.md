# Phase 1: Auth & App Shell - Context

**Gathered:** 2026-01-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify existing NextAuth Google OAuth implementation works correctly and establish the foundational app shell. Users can sign in, navigate between main sections (Vehicles, Statistics), and experience consistent loading/error states. This is a verification + foundation phase — existing auth should handle most requirements, focus is on completing gaps and establishing UI patterns for later phases.

</domain>

<decisions>
## Implementation Decisions

### Navigation structure

- Top navigation bar on desktop
- Bottom navigation bar on mobile (adaptive pattern)
- Navigation items: Vehicles, Statistics only
  - Dashboard is landing page (Phase 5), not a nav item
  - Fuelings accessed through individual vehicles, not top-level nav
- User account: Minimal avatar in nav (click opens menu with sign out)
- Active section indicator: Different color for active nav item

### Sign-in experience

- Minimal sign-in page: Fuelion branding + "Sign in with Google" button
- No feature preview or marketing content — functional only
- After sign-in: Land on Dashboard (once Phase 5 complete; interim landing TBD by Claude)
- Branding: Show Fuelion app name with Polish language support
- Language support: Both Polish and English with toggle from Phase 1

### Authenticated layout

- Full viewport layout: Fixed navigation, content fills remaining space
- Content area: Contained with max-width (centered, responsive padding)
- Desktop-first approach for Phase 1 (mobile optimization deferred)
- Bottom nav on mobile confirmed, but desktop is primary focus initially

### Loading & error states

- Loading indicators: Contextual approach
  - Skeleton screens for initial page loads
  - Spinners for user actions (button clicks, mutations)
- Error display: Mix of approaches
  - Toast notifications for action results (add, delete, update)
  - Inline error messages for form validation
  - Alert boxes for critical/blocking errors
- Error messaging: User-friendly + details option
  - Plain language in Polish/English
  - "Show details" link reveals technical info for debugging

### Claude's Discretion

- Page title/heading pattern (in nav vs. top of content)
- Exact interim landing page before Dashboard exists (Phase 1-4)
- Whether to use existing FetchDataErrorAlert or create new error components
- Loading skeleton design specifics
- Exact spacing, typography, and visual styling

</decisions>

<specifics>
## Specific Ideas

- Navigation on mobile should use bottom bar pattern (common mobile UX)
- Language toggle should be accessible from Phase 1 (Polish + English)
- Desktop-first development, but mobile pattern decisions made upfront

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

Note: Mobile optimization is desktop-first in Phase 1, but responsive patterns will evolve in later phases when forms and interactions become more complex.

</deferred>

---

_Phase: 01-auth-app-shell_
_Context gathered: 2026-01-30_
