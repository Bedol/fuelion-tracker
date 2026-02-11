# Phase 3: Fueling Records - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can quickly add and manage fueling records for their vehicles. The core value proposition — adding a fueling record in under 30 seconds — is delivered here through smart defaults, fast form entry, and clear list management. Phase includes: add fueling with smart defaults, edit and delete records, view fueling list with monthly grouping.

</domain>

<decisions>
## Implementation Decisions

### Form UX & Flow

- Field order: Price first → liters → odometer (think: what I paid, how much, at what mileage)
- Show calculated price-per-liter as live-updating read-only field below price and liters
- On-blur validation (validate when user leaves a field)
- Full/partial tank toggle: subtle toggle near liters field, default to full tank
- Date picker with today's date pre-filled (users can accept or change)
- Required fields marked with asterisk, optional fields unmarked
- Prominent primary Save button at bottom with success toast on save
- After saving: navigate to fueling list to see the new record

### Speed Optimization

- Remember last fuel type used for this vehicle (smart default)
- No separate quick-add mode — smart defaults make single flow fast enough
- Standard tab order for keyboard navigation (no special handling)
- No predictive price estimates — user enters actual values
- No "duplicate last fueling" feature — smart defaults sufficient
- No voice input for v1
- Warn about unsaved changes with option to save draft
- No fueling timer/gamification — just focus on making it fast

### Fueling List Display

- Sort: newest first (most recent fueling at top)
- Group by month with month headers
- Each record shows: date, total cost, price-per-liter, full/partial indicator
- Partial tank fuelings: different color or subtle style difference for visual distinction
- Filter support: filter by month or date range
- Long list handling: infinite scroll (load more as user scrolls)
- Month headers show only month name (totals elsewhere, not in list)
- Empty state: simple "No fuelings yet" text with add button

### Edit/Delete Behavior

- Editing: navigate to separate edit page (like create flow)
- Delete confirmation: modal dialog with "Delete" and "Cancel" buttons
- No bulk operations — edit/delete one at a time
- After edit/delete: stay on list with updated data and success toast

### Claude's Discretion

- Exact styling for partial tank visual distinction
- Infinite scroll implementation details
- Filter UI design (dropdowns vs buttons)
- Draft save mechanism details

</decisions>

<specifics>
## Specific Ideas

- Form flow optimized for gas station scenario: what did I pay, how much fuel, at what mileage
- Price-per-liter live calculation gives immediate feedback on data entry accuracy
- Monthly grouping makes it easy to compare periods and track spending over time
- Simple empty state avoids overwhelming new users, just get them to first entry

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 03-fueling-records_
_Context gathered: 2026-01-31_
