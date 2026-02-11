# Phase 11: Dashboard Navigation Link - Context

**Gathered:** 2026-02-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Restore a clear, consistent navigation path from Statistics back to Dashboard/Home across desktop, mobile, and statistics page surfaces. This phase closes discoverability and flow continuity gaps; it does not add new dashboard capabilities.

</domain>

<decisions>
## Implementation Decisions

### Link placement

- Desktop top navigation: place Dashboard as the first nav item.
- Desktop also supports dashboard return via logo/home click.
- Mobile bottom navigation: include Dashboard as a dedicated persistent tab.
- Statistics page: include a top action button to navigate to Dashboard.
- Vehicle-specific statistics pages: also include direct dashboard navigation.

### Label and wording

- Primary destination label: `Dashboard`.
- Polish translation: `Pulpit`.
- Statistics page action copy: `Go to Dashboard`.
- Keep wording consistent across desktop nav, mobile nav, and statistics action.

### Interaction behavior

- Dashboard navigation from Statistics is immediate (single-tap, no confirmation).
- Keep dashboard navigation visible in all stats states, including empty/no-data.
- If unauthenticated, follow existing auth redirect behavior.
- No special return hint from Dashboard back to Statistics.

### Visual emphasis

- Desktop Dashboard nav item uses the same visual weight as other nav items.
- Mobile Dashboard tab uses standard bottom-tab style with normal active-state treatment.
- Statistics page dashboard action is a secondary button.
- Use icon + text for Dashboard/Home navigation elements.

### Claude's Discretion

- None explicitly delegated.

</decisions>

<specifics>
## Specific Ideas

- Dashboard should be discoverable as the primary overview destination from statistics contexts.
- Keep visual treatment consistent with existing navigation patterns rather than introducing a new standout style.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

_Phase: 11-dashboard-navigation-link_
_Context gathered: 2026-02-11_
