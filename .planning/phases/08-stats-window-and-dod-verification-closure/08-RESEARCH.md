# Phase 8 Research: Stats Window & DoD Verification Closure

## Goal

Align monthly fuel cost chart behavior with the rolling 12-month requirement and produce phase verification artifacts for Phase 2 (vehicles) and Phase 5 (dashboard).

## Findings

- Current monthly costs are year-scoped in `lib/statistics/aggregation.ts` via `buildMonthlyCosts` and `selectedYear` filtering.
- The phase context defines a rolling 12-month window anchored to today, excluding future-dated fuelings, with an estimated (scaled) current month.
- The chart renders from `MonthlyCostPoint[]` and can preserve gaps by emitting 12 entries and hiding labels for empty months.
- Empty-state handling should be driven by a `hasCostData` flag rather than array length once 12-month placeholders are returned.

## Recommended Implementation

- Update `MonthlyCostPoint` to include metadata used by the chart:
  - `hasData: boolean` (true when a month has actual fueling data)
  - `isEstimated?: boolean` (true only for the current month when scaled)
- Replace year-scoped `buildMonthlyCosts` with a rolling 12-month window:
  - `windowStart = startOfMonth(addMonths(now, -11))`
  - `windowEnd = endOfMonth(now)`
  - ignore fuelings outside the window and any `fuelingDate > now`
  - for the current month, scale totals by `daysInMonth / daysElapsed`
  - return 12 points ordered oldest to newest, with `value` set to 0 for empty months
- Compute `hasCostData` as `monthlyCosts.some((point) => point.hasData)`.

## UI Considerations

- `MonthlyCostChart` should hide X-axis labels for months with no data using a tick formatter.
- Tooltip should still show `0 PLN` for empty months and label estimated current month values.
- Add copy indicating the chart is a rolling 12-month view and the current month is in progress.

## Verification Artifacts

- Create Markdown checklists in `.planning/phases/08-stats-window-and-dod-verification-closure` for:
  - Phase 2 vehicle CRUD + detail (basic + technical vehicle)
  - Phase 5 dashboard sections (summary, recent activity, quick add)
- Use step-by-step verification with results and notes.

## Files To Touch

- `lib/statistics/aggregation.ts`
- `types/statistics_types.ts`
- `components/statistics/MonthlyCostChart.tsx`
- `components/statistics/ChartsSection.tsx`
- `pages/vehicles/[id]/statistics.tsx` (label copy if needed)
- `.planning/phases/08-stats-window-and-dod-verification-closure/*-VERIFICATION.md`
