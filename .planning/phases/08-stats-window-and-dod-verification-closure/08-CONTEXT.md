# Phase 8: Stats Window & DoD Verification Closure - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Align STAT-02 monthly fuel costs to a rolling 12-month window with explicit display rules, and close audit blockers by producing Phase 2 (vehicle management) and Phase 5 (dashboard) human verification artifacts. No new capabilities beyond these closures.

</domain>

<decisions>
## Implementation Decisions

### Rolling window definition

- Window ends on the current month (partial month allowed) and is marked as in-progress.
- Use 12 calendar months (month buckets), anchored to today.
- Always show a full 12-month window even with less data.
- Partial current month totals are estimated to a full month (scaled).
- Exclude future-dated fuelings from the window.
- Month boundaries use the user’s local time.

### Missing-months display

- Months with no fuelings show as gaps (no bars) and the chart preserves time gaps.
- X-axis labels only months with data; order is oldest to newest.
- If the full 12-month window has no data, show an empty-state message instead of a chart.
- Tooltip for an empty month shows a numeric “0 PLN”.
- No helper note explaining hidden/empty months.

### Verification artifact format

- Primary artifact is a checklist with notes in Markdown.
- Artifact lives in the phase planning folder (`.planning/phases/08-*`).
- Write-up is thorough, step-by-step; text-only is acceptable (no images required).

### Verification scope

- Phase 2 verification covers full CRUD + detail: create, list, view detail, edit, delete.
- Include both a basic vehicle and a vehicle with technical data.
- Phase 5 verification covers all dashboard sections: summary, recent activity, quick add.
- Use minimal data setup that still demonstrates each required flow.

### Claude's Discretion

- Monthly costs chart y-axis scaling (zero baseline vs auto-scale).

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

_Phase: 08-stats-window-and-dod-verification-closure_
_Context gathered: 2026-02-06_
