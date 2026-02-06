---
phase: 04-statistics-&-charts
verified: 2026-02-03T12:49:15Z
status: gaps_found
score: 14/16 must-haves verified
gaps:
  - truth: 'Monthly costs cover the last 12 months and omit zero months'
    status: failed
    reason: 'Aggregation scopes monthly costs to a selected calendar year, not a rolling 12-month window.'
    artifacts:
      - path: 'lib/statistics/aggregation.ts'
        issue: 'Monthly costs use startOfYear/endOfYear with selectedYear filtering.'
    missing:
      - 'Rolling 12-month window for monthly costs (anchored to current date or latest fueling)'
      - 'Month inclusion logic that spans year boundaries within the 12-month window'
---

# Phase 4: Statistics & Charts Verification Report

**Phase Goal:** Users can view fuel consumption and cost statistics for their vehicles.
**Verified:** 2026-02-03T12:49:15Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                  | Status      | Evidence                                                                                      |
| --- | -------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| 1   | Statistics API returns summary totals and chart series for a vehicle                   | ✓ VERIFIED  | `pages/api/vehicles/[id]/statistics.ts` returns `buildVehicleStatistics` output.              |
| 2   | Consumption series uses only full-tank intervals and skips invalid distances           | ✓ VERIFIED  | `lib/statistics/aggregation.ts` uses `full_tank` and `distance > 0`.                          |
| 3   | Monthly costs cover the last 12 months and omit zero months                            | ✗ FAILED    | `lib/statistics/aggregation.ts` scopes costs to `selectedYear` via `startOfYear/endOfYear`.   |
| 4   | API returns not-enough-data flags when no valid intervals exist                        | ✓ VERIFIED  | Response includes `hasConsumptionData` and `hasCostData`.                                     |
| 5   | User can load statistics data for a selected vehicle                                   | ✓ VERIFIED  | `hooks/useVehicleStatistics.ts` fetches `/api/vehicles/${id}/statistics`, page consumes hook. |
| 6   | User can render statistics charts in the UI without chart-library errors               | ? UNCERTAIN | Requires runtime rendering check for Recharts.                                                |
| 7   | Summary cards render total spent, average consumption, and total distance              | ✓ VERIFIED  | `components/statistics/StatisticsSummary.tsx` renders all three.                              |
| 8   | Consumption chart renders straight-line points when data exists                        | ✓ VERIFIED  | `Line` uses `type='linear'` with dots in `components/statistics/ConsumptionChart.tsx`.        |
| 9   | Monthly cost chart renders bar series with tooltips only                               | ✓ VERIFIED  | `BarChart` with `Tooltip`, no labels in `components/statistics/MonthlyCostChart.tsx`.         |
| 10  | Empty state appears when data is insufficient                                          | ✓ VERIFIED  | `StatisticsEmptyState` used in `components/statistics/ChartsSection.tsx`.                     |
| 11  | Statistics page loads vehicle data and statistics data with clear loading/error states | ✓ VERIFIED  | `Loading` and `FetchDataErrorAlert` in `pages/vehicles/[id]/statistics.tsx`.                  |
| 12  | Summary numbers and charts render for the selected vehicle                             | ✓ VERIFIED  | `StatisticsSummary` and `ChartsSection` rendered when data exists.                            |
| 13  | Not enough data message appears when consumption intervals are missing                 | ✓ VERIFIED  | Empty state message and summary fallbacks.                                                    |
| 14  | User can view consumption and cost charts for a vehicle                                | ✓ VERIFIED  | Charts are composed in `pages/vehicles/[id]/statistics.tsx`.                                  |
| 15  | User sees summary totals for total spent, average consumption, and distance            | ✓ VERIFIED  | Summary section renders all totals.                                                           |
| 16  | User sees a not-enough-data message when full-tank intervals are insufficient          | ✓ VERIFIED  | Empty state and summary helper text.                                                          |

**Score:** 14/16 truths verified

### Required Artifacts

| Artifact                                         | Expected                                           | Status     | Details                                           |
| ------------------------------------------------ | -------------------------------------------------- | ---------- | ------------------------------------------------- |
| `types/statistics_types.ts`                      | Typed response for vehicle statistics              | ✓ VERIFIED | Exports required types; 26 lines.                 |
| `lib/statistics/aggregation.ts`                  | Pure aggregation helpers for consumption and costs | ✓ VERIFIED | Exports `buildVehicleStatistics`; 282 lines.      |
| `pages/api/vehicles/[id]/statistics.ts`          | Vehicle statistics API endpoint                    | ✓ VERIFIED | Auth, Prisma query, returns stats; 68 lines.      |
| `package.json`                                   | Recharts dependency                                | ✓ VERIFIED | `recharts` listed in dependencies.                |
| `hooks/useVehicleStatistics.ts`                  | Statistics data hook                               | ✓ VERIFIED | Query hook fetches statistics endpoint; 23 lines. |
| `hooks/index.ts`                                 | Barrel export for statistics hook                  | ✓ VERIFIED | Exports `useVehicleStatistics`.                   |
| `components/statistics/StatisticsSummary.tsx`    | Summary cards UI                                   | ✓ VERIFIED | Renders totals with fallbacks; 80 lines.          |
| `components/statistics/StatisticsEmptyState.tsx` | Empty state messaging                              | ✓ VERIFIED | Emoji + heading + description; 31 lines.          |
| `components/statistics/ConsumptionChart.tsx`     | Consumption line chart                             | ✓ VERIFIED | Recharts line chart; 67 lines.                    |
| `components/statistics/MonthlyCostChart.tsx`     | Monthly cost bar chart                             | ✓ VERIFIED | Recharts bar chart; 62 lines.                     |
| `components/statistics/ChartsSection.tsx`        | Charts layout and empty-state handling             | ✓ VERIFIED | Composes charts and empty states; 73 lines.       |
| `components/statistics/index.ts`                 | Barrel exports                                     | ✓ VERIFIED | Exports statistics components.                    |
| `pages/vehicles/[id]/statistics.tsx`             | Vehicle statistics page                            | ✓ VERIFIED | Page layout and data wiring; 190 lines.           |

### Key Link Verification

| From                                         | To                                        | Via                      | Status  | Details                                                 |
| -------------------------------------------- | ----------------------------------------- | ------------------------ | ------- | ------------------------------------------------------- |
| `pages/api/vehicles/[id]/statistics.ts`      | `prisma.fueling.findMany`                 | Prisma client            | ✓ WIRED | Query selects date, mileage, quantity, cost, full_tank. |
| `pages/api/vehicles/[id]/statistics.ts`      | `lib/statistics/aggregation.ts`           | `buildVehicleStatistics` | ✓ WIRED | API returns aggregation output.                         |
| `lib/statistics/aggregation.ts`              | `fueling.full_tank`                       | interval calculation     | ✓ WIRED | Intervals only created on full-tank entries.            |
| `hooks/useVehicleStatistics.ts`              | `/api/vehicles/[id]/statistics`           | fetch in queryFn         | ✓ WIRED | `fetch` uses statistics endpoint.                       |
| `hooks/index.ts`                             | `hooks/useVehicleStatistics.ts`           | export statement         | ✓ WIRED | Barrel export present.                                  |
| `components/statistics/ConsumptionChart.tsx` | Recharts `ResponsiveContainer`            | chart wrapper            | ✓ WIRED | Responsive container wraps line chart.                  |
| `components/statistics/ChartsSection.tsx`    | `StatisticsEmptyState`                    | empty state render       | ✓ WIRED | Empty state shown when data missing.                    |
| `components/statistics/ChartsSection.tsx`    | `ConsumptionChart`, `MonthlyCostChart`    | component composition    | ✓ WIRED | Both charts rendered when data exists.                  |
| `pages/vehicles/[id]/statistics.tsx`         | `hooks/useVehicleStatistics.ts`           | hook usage               | ✓ WIRED | Page fetches statistics via hook.                       |
| `pages/vehicles/[id]/statistics.tsx`         | `components/statistics/ChartsSection.tsx` | component render         | ✓ WIRED | Charts section rendered with stats data.                |

### Requirements Coverage

| Requirement                                                       | Status      | Blocking Issue |
| ----------------------------------------------------------------- | ----------- | -------------- |
| STAT-01: User can view fuel consumption (L/100km) over time chart | ✓ SATISFIED | None found.    |
| STAT-02: User can view monthly fuel costs chart                   | ✓ SATISFIED | None found.    |
| STAT-03: User can view summary totals                             | ✓ SATISFIED | None found.    |
| STAT-04: Consumption calculated only from full-tank fuelings      | ✓ SATISFIED | None found.    |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| None | -    | -       | -        | -      |

### Human Verification Required

### 1. Statistics Charts Render

**Test:** Open `/vehicles/{id}/statistics` for a vehicle with multiple full-tank fuelings.
**Expected:** Consumption line chart and monthly cost bar chart render without console or runtime errors.
**Why human:** Recharts rendering requires runtime validation.

### 2. Empty State Messaging

**Test:** Open `/vehicles/{id}/statistics` for a vehicle with fewer than two full-tank fuelings.
**Expected:** "Not enough consumption data" empty state shows, summary fields display `--` helpers.
**Why human:** Depends on real data behavior and UI presentation.

### Gaps Summary

Monthly costs are calculated per selected calendar year, not a rolling 12-month window. This diverges from the must-have requirement and needs a windowing change in `lib/statistics/aggregation.ts`.

---

_Verified: 2026-02-03T12:49:15Z_
_Verifier: Claude (gsd-verifier)_
