---
status: complete
phase: 04-statistics-&-charts
source:
  [
    04-01-SUMMARY.md,
    04-02-SUMMARY.md,
    04-03-SUMMARY.md,
    04-04-SUMMARY.md,
    04-05-SUMMARY.md,
  ]
started: 2026-02-06T07:04:02Z
updated: 2026-02-06T07:13:35Z
---

## Current Test

[testing complete]

## Tests

### 1. Statistics page renders summary + charts

expected: On a vehicle with fueling data, /vehicles/[id]/statistics loads and shows summary cards (total spent, average consumption, total distance) plus two chart sections (consumption line chart and monthly cost bar chart).
result: pass

### 2. Year selector filters data

expected: If the vehicle has stats across multiple years, a year selector appears, defaults to the latest year, and changing the year updates the summary and charts to that year.
result: pass

### 3. Consumption chart empty state

expected: If there are not enough full-tank fuelings to compute consumption, the consumption chart area shows a clear not-enough-data message instead of a chart.
result: pass

### 4. Monthly cost chart shows costs

expected: The monthly cost chart renders bars for months with fuelings and shows PLN values in labels or tooltips.
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
