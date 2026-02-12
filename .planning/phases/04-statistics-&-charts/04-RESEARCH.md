# Phase 04: Statistics & Charts - Research

**Researched:** 2026-02-02
**Domain:** Vehicle fuel statistics calculation and charting in Next.js (Pages Router) with React
**Confidence:** MEDIUM

## Summary

This research covers how to calculate fuel consumption and cost statistics from fueling records and how to present them with charts in the existing Next.js + Chakra UI + Tailwind stack. The standard approach is to compute aggregations server-side from ordered fueling data (respecting full-tank intervals), then render Recharts line and bar charts with responsive containers on the statistics page.

Key recommendations are to use Recharts for the line and bar charts, date-fns for month grouping/labels, and a dedicated aggregation function that only uses full-tank-to-full-tank intervals for L/100km. Use explicit empty-state handling when data is insufficient or intervals are invalid, and avoid chart rendering without a fixed-height container.

**Primary recommendation:** Implement a server-side statistics aggregation that uses only full-tank intervals and render the results with Recharts `LineChart` and `BarChart` wrapped in `ResponsiveContainer`.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library               | Version | Purpose                            | Why Standard                                                            |
| --------------------- | ------- | ---------------------------------- | ----------------------------------------------------------------------- |
| Recharts              | 3.3.0   | React charting (line + bar)        | Declarative components with SVG output and responsive container support |
| @tanstack/react-query | 5.90.19 | Data fetching and caching          | Already used across the app for API data and error states               |
| date-fns              | 3.6.0   | Date formatting and month grouping | Lightweight, functional date utilities with formatting tokens           |

### Supporting

| Library      | Version | Purpose                  | When to Use                                 |
| ------------ | ------- | ------------------------ | ------------------------------------------- |
| Chakra UI    | 3.31.0  | Layout and UI components | Cards/containers/empty states for charts    |
| Tailwind CSS | 4.1.17  | Utility styling          | Layout tweaks and spacing on the stats page |

### Alternatives Considered

| Instead of | Could Use                  | Tradeoff                                                        |
| ---------- | -------------------------- | --------------------------------------------------------------- |
| Recharts   | Chart.js / react-chartjs-2 | More chart types but heavier configuration and less JSX-centric |
| date-fns   | dayjs                      | Smaller API surface but not already in the dependency set       |

**Installation:**

```bash
npm install recharts
```

## Architecture Patterns

### Recommended Project Structure

```
pages/
├── vehicles/[id]/statistics.tsx   # page shell and layout
pages/api/
├── vehicles/[id]/statistics.ts    # server aggregation endpoint
components/
├── statistics/                    # chart + summary components
lib/
├── statistics/                    # pure aggregation helpers
```

### Pattern 1: Full-Tank Interval Aggregation

**What:** Calculate L/100km using only segments between full-tank fill-ups, summing fuel quantities in the interval and dividing by odometer distance between the two full-tank points.
**When to use:** Whenever computing consumption, to avoid skew from partial fills.
**Example:**

```typescript
// Source: Derived from phase requirements (STAT-04)
type Fueling = {
	date: Date;
	mileage: number;
	quantity: number;
	full_tank: boolean;
};

const computeIntervals = (fuelings: Fueling[]) => {
	const ordered = [...fuelings].sort((a, b) => a.mileage - b.mileage);
	const intervals: { endDate: Date; consumptionLPer100: number }[] = [];

	let lastFullIndex: number | null = null;
	let fuelSum = 0;

	ordered.forEach((entry, idx) => {
		fuelSum += entry.quantity;
		if (entry.full_tank) {
			if (lastFullIndex !== null) {
				const start = ordered[lastFullIndex];
				const distance = entry.mileage - start.mileage;
				if (distance > 0) {
					intervals.push({
						endDate: entry.date,
						consumptionLPer100: (fuelSum / distance) * 100,
					});
				}
			}
			lastFullIndex = idx;
			fuelSum = 0;
		}
	});

	return intervals;
};
```

### Pattern 2: Monthly Cost Aggregation

**What:** Group fueling costs by month using date-fns formatting and sum `cost` for each month.
**When to use:** Bar chart of monthly fuel costs.
**Example:**

```typescript
// Source: date-fns official docs
import { format } from 'date-fns';

const monthKey = format(new Date(2014, 1, 11), 'yyyy-MM');
```

### Anti-Patterns to Avoid

- **Including partial tanks in consumption:** inflates or deflates L/100km; only use full-tank-to-full-tank intervals.
- **Unsorted fuelings:** leads to negative or zero distances; always sort by `mileage` (or date with validation).
- **Chart without explicit height:** `ResponsiveContainer` needs a sized parent, otherwise charts render at 0 height.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem             | Don't Build              | Use Instead         | Why                                                    |
| ------------------- | ------------------------ | ------------------- | ------------------------------------------------------ |
| Chart rendering     | Custom SVG/Canvas charts | Recharts            | Handles axes, tooltips, legends, and responsive sizing |
| Month labels        | Manual string parsing    | date-fns `format`   | Locale-safe, tokenized formatting                      |
| Currency formatting | String concatenation     | `Intl.NumberFormat` | Handles rounding and currency symbols                  |

**Key insight:** Charting and formatting have many edge cases (axes ticks, responsive sizing, locales) that are already solved by standard libraries.

## Common Pitfalls

### Pitfall 1: Consumption calculated with partial tank data

**What goes wrong:** L/100km becomes inaccurate when partial fills are included.
**Why it happens:** Fueling lists mix full and partial fills without interval boundaries.
**How to avoid:** Only compute intervals between consecutive `full_tank = true` entries and sum fuel in between.
**Warning signs:** Consumption values swing widely between consecutive points or are zero with valid data.

### Pitfall 2: Incorrect ordering or distance validation

**What goes wrong:** Negative or zero distances produce invalid L/100km points.
**Why it happens:** Fuelings are sorted by date but odometer entries are inconsistent, or the list is unsorted.
**How to avoid:** Sort by `mileage` and skip intervals with `distance <= 0`.
**Warning signs:** NaN/Infinity or negative consumption in the chart data.

### Pitfall 3: Month boundary shifts

**What goes wrong:** Costs appear in the wrong month when dates are interpreted in the wrong timezone.
**Why it happens:** Date-only values parsed as local time or UTC inconsistently.
**How to avoid:** Treat `date` as local date consistently and use date-fns `format` on a `Date` created from the stored date.
**Warning signs:** End-of-month fuelings showing in next month.

### Pitfall 4: Recharts renders blank

**What goes wrong:** Chart area is empty despite data.
**Why it happens:** `ResponsiveContainer` has no explicit height from its parent.
**How to avoid:** Ensure the container has a fixed height (e.g., `h-64` or explicit px).
**Warning signs:** No SVG output in DOM or height 0 on the container.

## Code Examples

Verified patterns from official sources:

### Recharts LineChart with axes and tooltip

```tsx
// Source: https://github.com/recharts/recharts/blob/main/storybook/stories/Welcome.mdx
<LineChart
	width={500}
	height={300}
	data={data}
	accessibilityLayer
	margin={{
		top: 5,
		right: 5,
		bottom: 5,
		left: 0,
	}}
>
	<CartesianGrid stroke='#eee' strokeDasharray='5 5' />
	<XAxis dataKey='name' />
	<YAxis />
	<Line type='monotone' dataKey='uv' stroke='#8884d8' />
	<Line type='monotone' dataKey='pv' stroke='#82ca9d' />
	<Tooltip />
</LineChart>
```

### Recharts ResponsiveContainer wrapper

```tsx
// Source: https://context7.com/recharts/recharts/llms.txt
<ResponsiveContainer width='100%' height={300}>
	<LineChart data={data}>
		<CartesianGrid strokeDasharray='3 3' />
		<XAxis dataKey='name' />
		<YAxis />
		<Tooltip />
		<Line type='monotone' dataKey='uv' stroke='#8884d8' />
	</LineChart>
</ResponsiveContainer>
```

### date-fns formatting

```typescript
// Source: https://github.com/date-fns/date-fns/blob/main/README.md
import { format } from 'date-fns';

format(new Date(2014, 1, 11), 'yyyy-MM-dd');
```

## State of the Art

| Old Approach                  | Current Approach                      | When Changed                     | Impact                                       |
| ----------------------------- | ------------------------------------- | -------------------------------- | -------------------------------------------- |
| Fixed chart width/height only | `ResponsiveContainer` wrapping charts | Recharts guidance (current docs) | Charts resize with layout and avoid overflow |

**Deprecated/outdated:**

- `YYYY` tokens in date-fns formatting: use `yyyy` for calendar year (Unicode tokens guidance).

## Open Questions

1. **Currency source for “total PLN spent”**
   - What we know: `Vehicle.currency` defaults to PLN, `Fueling` has `currency_id` but no model relation.
   - What's unclear: Whether to hardcode PLN for the phase or derive from vehicle/user settings.
   - Recommendation: Default to PLN per requirement, then confirm future multi-currency plan.

2. **Date parsing behavior for `Fueling.date`**
   - What we know: `Fueling.date` is stored as `DateTime` with `@db.Date`.
   - What's unclear: Whether API returns ISO date-only strings or full timestamps.
   - Recommendation: Standardize API to return ISO date strings and parse consistently on the client.

## Sources

### Primary (HIGH confidence)

- /recharts/recharts - LineChart, ResponsiveContainer usage
- /date-fns/date-fns - Date formatting tokens and usage

### Secondary (MEDIUM confidence)

- Project schema: `/home/bweber/workspace/frontend/fuelion-opencode/prisma/schema.prisma` (fueling fields and full-tank flag)

### Tertiary (LOW confidence)

- Full-tank interval algorithm details (derived from requirements, not an external standard)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - Recharts and date-fns verified via Context7
- Architecture: MEDIUM - Full-tank algorithm derived from requirements and schema
- Pitfalls: MEDIUM - Based on common charting and date formatting issues

**Research date:** 2026-02-02
**Valid until:** 2026-03-04
