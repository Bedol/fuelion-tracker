# Phase 4: Statistics & Charts - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver vehicle-level fuel consumption and cost statistics: a consumption (L/100km) line chart over time, a monthly fuel cost bar chart, and summary numbers (total PLN spent, average consumption, total distance). Consumption calculations must use only full-tank-to-full-tank intervals. Empty or insufficient data must show a meaningful "not enough data" state rather than incorrect values.

</domain>

<decisions>
## Implementation Decisions

### Consumption chart shape

- Data points are monthly averages derived from full-tank intervals within each month.
- Use straight line segments with visible point markers (no smoothing).
- X-axis labels are month/year ticks (e.g., Jan 2026).
- Y-axis auto-scales to the data (no fixed zero baseline).

### Monthly cost grouping

- Default range is the last 12 months (rolling window).
- Omit months with zero spend (no zero-height bars).
- Order bars chronologically left-to-right (oldest to newest).
- Show values on hover/tooltip only (no on-bar labels).

### Claude's Discretion

- None explicitly granted in discussed areas.

</decisions>

<specifics>
## Specific Ideas

No specific requirements - open to standard approaches.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

_Phase: 04-statistics-&-charts_
_Context gathered: 2026-02-02_
