# Phase 7: Flow Wiring & Cache Consistency - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Restore end-to-end navigation continuity and dashboard freshness after fueling CRUD. This includes adding a direct vehicle detail link to statistics, ensuring dashboard data refreshes after fueling create/edit/delete, and fixing the sign-in -> vehicle -> fueling -> stats -> dashboard flow.

</domain>

<decisions>
## Implementation Decisions

### Stats entry point

- Place the stats entry in the vehicle detail header action area.
- Use a primary button labeled "View statistics".
- Show the entry even when stats data is insufficient (stats page handles empty state).

### Post-fueling navigation

- After creating or editing a fueling, return to the vehicle detail fuelings list.
- After deleting a fueling, stay on the list with the item removed.
- Use toast-only feedback (no inline banners).

### Dashboard refresh timing

- Refresh dashboard data on fueling create/edit/delete.
- Refresh immediately in the background after changes.
- If user is on the dashboard, show a subtle inline spinner during refresh.
- If refresh fails, show a toast error only and keep existing data.

### Recent activity rules

- Show 5 recent fuelings on the dashboard.
- Order by fueling date/time, newest first.
- No recency cutoff; just the last N items.
- Each item displays vehicle, date, liters, and price.

### Claude's Discretion

No explicit discretion areas were requested.

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

_Phase: 07-flow-wiring-cache-consistency_
_Context gathered: 2026-02-06_
