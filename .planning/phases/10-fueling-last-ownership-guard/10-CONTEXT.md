# Phase 10: Fueling Last Ownership Guard - Context

**Gathered:** 2026-02-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Enforce per-user ownership on `/api/fueling/last` for smart defaults, ensuring the endpoint only returns data scoped to the authenticated user's vehicle.

</domain>

<decisions>
## Implementation Decisions

### Ownership scoping rules

- Scope is user + vehicle; endpoint returns last fueling for the specified vehicle owned by the session user.
- `vehicleId` is required in the request.
- "Last" is determined by the fueling date field (most recent date wins).
- All fuelings are eligible (full and partial).

### Unauthorized/forbidden behavior

- Missing/invalid session returns 401 with a JSON error.
- Non-owned vehicle access returns 404 (do not leak existence).
- Missing/invalid `vehicleId` returns 400.
- Use the standard auth/ownership guard error payload format.

### Claude's Discretion

None — all discussed decisions are specified.

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

_Phase: 10-fueling-last-ownership-guard_
_Context gathered: 2026-02-08_
