# Phase 5: Dashboard - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a dashboard landing page after sign-in that summarizes all vehicles and recent fueling activity, with quick access to add a fueling and meaningful loading states.

</domain>

<decisions>
## Implementation Decisions

### Dashboard layout

- Desktop uses a hybrid layout: two-column above the fold, activity section full-width below
- Mobile shows recent activity first, vehicles section below
- Sections are presented as distinct cards with headers
- Overall spacing is airy rather than compact

### Vehicle summary cards

- Cards are arranged in a grid (stacked on mobile)
- Each card shows total spent (all-time), last fueling date, average consumption, and total distance
- Vehicle identity includes registration number alongside brand/model
- Fuel type is displayed as a text label (no emoji)
- Cards are not clickable; use an explicit view button
- Vehicles with no fuelings show zero values instead of “no data” placeholders
- Vehicles are ordered alphabetically

### Recent activity feed

- Show 8 items
- Each row shows vehicle, date, total price, liters, and odometer
- Rows are single-line, compact
- Clicking an item opens the vehicle detail page

### Quick add entry

- Quick add is per-vehicle (button on each vehicle card)
- Action navigates to the fueling form page
- Vehicle is preselected from the card
- After save, user is taken to the vehicle detail page

### Claude's Discretion

- None explicitly — use standard patterns for remaining details (e.g., activity ordering, loading/empty state copy)

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

_Phase: 05-dashboard_
_Context gathered: 2026-02-06_
