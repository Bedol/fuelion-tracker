---
phase: 11-dashboard-navigation-link
plan: 01
subsystem: ui
tags: [nextjs, chakra-ui, navigation, i18n]

# Dependency graph
requires:
  - phase: 05-dashboard
    provides: Dashboard route (`/`) and authenticated landing experience
  - phase: 07-flow-wiring-cache-consistency
    provides: Statistics entry points and end-to-end page flow wiring
provides:
  - Dashboard as a first-class desktop and mobile navigation destination
  - One-tap dashboard return actions on global and vehicle statistics pages
  - EN/PL localization coverage for dashboard nav label and stats return CTA
affects: [11-02-verification, navigation-flow, i18n-consistency]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Shared `FaHome` icon + localized label for dashboard/home actions
    - Statistics return CTA rendered outside statistics data-conditional blocks

key-files:
  created: []
  modified:
    - components/layout/Navigation.tsx
    - pages/statistics/index.tsx
    - pages/vehicles/[id]/statistics.tsx
    - lib/i18n/dictionaries/en.json
    - lib/i18n/dictionaries/pl.json

key-decisions:
  - Use `nav.dashboard` and `statistics.goToDashboard` keys for wording consistency across nav and statistics surfaces.
  - Keep dashboard return affordances visually secondary except normal active nav state.

patterns-established:
  - 'Navigation parity: desktop top nav and mobile bottom nav expose the same core destinations.'
  - 'Statistics continuity: dashboard return action stays visible independent of chart data availability.'

# Metrics
duration: 2 min
completed: 2026-02-11
---

# Phase 11 Plan 01: Dashboard Navigation Link Summary

**Dashboard/home routing is restored across desktop, mobile, and statistics views with localized EN/PL copy and one-tap return actions.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-11T20:38:22Z
- **Completed:** 2026-02-11T20:40:59Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Added Dashboard as the first desktop nav item and as a persistent mobile bottom tab.
- Made the desktop Fuelion wordmark clickable to `/` as an additional home return path.
- Added localized `Go to Dashboard` actions on `/statistics` and `/vehicles/[id]/statistics` using shared iconography.
- Added dictionary coverage for `nav.dashboard` and `statistics.goToDashboard` in English and Polish.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add dashboard/home destination to shared navigation surfaces** - `64956e7` (feat)
2. **Task 2: Add localized dashboard labels and stats return copy** - `b92b3b3` (feat)
3. **Task 3: Add always-visible dashboard return actions on statistics pages** - `2bed310` (feat)

## Files Created/Modified

- `components/layout/Navigation.tsx` - Added dashboard nav entries for desktop/mobile and clickable logo route to `/`.
- `lib/i18n/dictionaries/en.json` - Added `nav.dashboard` and `statistics.goToDashboard` English keys.
- `lib/i18n/dictionaries/pl.json` - Added `nav.dashboard` and `statistics.goToDashboard` Polish keys.
- `pages/statistics/index.tsx` - Added top secondary dashboard return action with localized label.
- `pages/vehicles/[id]/statistics.tsx` - Added top action-row dashboard return action with localized label.

## Decisions Made

- Standardized dashboard wording through i18n keys instead of inline labels to keep nav and CTA copy synchronized across locales.
- Reused the existing `react-icons/fa` family (`FaHome`) to match current visual language and avoid introducing mixed icon sets.

## Deviations from Plan

None - plan executed exactly as written.

## Authentication Gates

None.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Navigation continuity gap is closed and ready for Phase 11 Plan 02 verification flow.
- No blockers identified.

---

_Phase: 11-dashboard-navigation-link_
_Completed: 2026-02-11_
