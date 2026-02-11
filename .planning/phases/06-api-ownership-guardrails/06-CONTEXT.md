# Phase 6: API Ownership Guardrails - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Enforce strict per-user ownership boundaries across vehicles, fueling, and vehicle statistics APIs so users cannot read or mutate data they do not own. This phase hardens existing endpoints only; it does not add new product capabilities.

</domain>

<decisions>
## Implementation Decisions

### Non-owner read policy

- For `GET` by ID on non-owned resources, return `403` consistently.
- Use generic "not found" wording in response messages for non-owner reads.
- `/api/vehicles/[id]/statistics` follows the same non-owner read behavior as other protected GET-by-ID endpoints.

### Non-owner write policy

- For non-owner `PUT`/`DELETE` attempts, return `403` consistently.
- Creating fueling records against a vehicle not owned by the caller must be rejected with the same ownership-violation status policy.
- Ownership-guard write failures are strict no-op operations: no partial writes and no side effects.
- Use one consistent user-facing message family for ownership-guard write failures across create/edit/delete flows.

### Unauthenticated behavior

- Missing or expired session returns `401` across all affected APIs.
- Missing vs expired session must share the same external response contract.
- Return a standard JSON error payload for unauthenticated requests.
- Vehicles, fueling, and statistics endpoints must behave identically for unauthenticated requests.

### Error response contract

- Use one shared error envelope for guardrail/auth failures (`401`, `403`, and ownership-related failures).
- Include machine-readable error codes (for example: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`).
- API response messages are in English.
- Allow safe optional `details` fields where useful for client handling/debugging.

### Claude's Discretion

- List endpoint handling for non-owned records (for example, silent filtering vs hard-fail) is left to implementation discretion, as long as ownership boundaries remain enforced.

</decisions>

<specifics>
## Specific Ideas

- Keep behavior contract-consistent across endpoint families rather than endpoint-specific variants.
- Favor client-parsable errors (status + envelope + machine-readable code) over ad hoc error bodies.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

_Phase: 06-api-ownership-guardrails_
_Context gathered: 2026-02-06_
