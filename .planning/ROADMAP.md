# Roadmap: Fuelion v1

**Created:** 2026-01-30
**Depth:** Standard
**Phases:** 5
**Requirements:** 26 mapped

## Overview

Fuelion v1 delivers a complete vehicle expense tracking app for Polish users. The roadmap progresses from secure access through vehicle management, fueling tracking, statistics visualization, and finally a summary dashboard. Each phase delivers a complete, verifiable capability. The core value proposition - adding a fueling record in under 30 seconds - is addressed in Phase 3 after the foundational vehicle management is in place.

## Phases

### Phase 1: Auth & App Shell

**Goal:** Users can securely access the application and navigate between sections.

**Dependencies:** None (foundation phase)

**Plans:** 5 plans

**Requirements:**

- AUTH-01: User can sign in with Google OAuth
- AUTH-02: User session persists across browser refresh
- AUTH-03: User can sign out from any page
- AUTH-04: Unauthenticated users are redirected to sign-in page
- UIUX-01: App has clear navigation between sections
- UIUX-06: Loading and error states are clearly displayed

**Success Criteria:**

1. User can sign in with Google OAuth and see their name/email displayed
2. User can close browser, reopen, and still be signed in
3. User can sign out from any page and is redirected to sign-in
4. Unauthenticated user visiting any page is redirected to sign-in
5. Navigation shows clear links to Vehicles, Fuelings, Statistics sections

**Plans:**

- [x] 01-01-PLAN.md — Implement i18n with Polish/English support using React Context
- [x] 01-02-PLAN.md — Verify and enhance NextAuth Google OAuth with custom sign-in page
- [x] 01-03-PLAN.md — Create enhanced loading (SkeletonLoader) and error (ErrorAlert) components
- [x] 01-04-PLAN.md — Build responsive navigation (desktop top bar, mobile bottom bar)
- [x] 01-05-PLAN.md — Human verification of auth flow and navigation

**Notes:**

- Existing NextAuth setup should handle most auth requirements
- Focus on verifying/completing existing implementation
- Establish loading/error component patterns for use in later phases

---

### Phase 2: Vehicle Management

**Goal:** Users can create, view, edit, and delete their vehicles.

**Dependencies:** Phase 1 (auth required to own vehicles)

**Plans:** 5 plans

**Requirements:**

- VEHI-01: User can create a vehicle with basic data (brand, model, year, registration)
- VEHI-02: User can add technical data to vehicle (engine capacity, power, fuel type)
- VEHI-03: User can view list of their vehicles
- VEHI-04: User can edit vehicle data
- VEHI-05: User can delete a vehicle (with confirmation)
- VEHI-06: User can select a vehicle to view its details and expenses

**Success Criteria:**

1. User can create a new vehicle with brand, model, year, registration, and technical specs
2. User can see all their vehicles in a list with key info visible
3. User can edit any field of an existing vehicle
4. User can delete a vehicle after confirming the action
5. User can select a vehicle to see its detail page with associated data

**Plans:**

- [x] 02-01-PLAN.md — Simplify Vehicle schema to remove lookup table dependencies
- [x] 02-02-PLAN.md — Add empty state and enhance vehicle cards with fuel type icons
- [x] 02-03-PLAN.md — Rebuild vehicle forms (create & edit) with collapsible technical data
- [x] 02-04-PLAN.md — Create vehicle detail page and delete confirmation modal
- [x] 02-05-PLAN.md — Human verification of complete CRUD flow

**Notes:**

- Existing Prisma Vehicle model should cover most fields
- May need schema updates for technical data fields
- Vehicle detail page becomes the container for fueling and stats

---

### Phase 3: Fueling Records

**Goal:** Users can quickly add and manage fueling records for their vehicles.

**Dependencies:** Phase 2 (vehicles must exist to record fuelings)

**Requirements:**

- FUEL-01: User can add fueling record (liters, total price, odometer, date)
- FUEL-02: User can mark fueling as full tank or partial
- FUEL-03: User can view list of fuelings for a vehicle
- FUEL-04: User can edit existing fueling record
- FUEL-05: User can delete fueling record (with confirmation)
- FUEL-06: Price per liter is auto-calculated from total and liters
- UIUX-03: Forms are simple with minimal required fields
- UIUX-04: Forms have smart defaults (current date, last odometer value)
- UIUX-05: User receives feedback on actions (success/error toasts)

**Success Criteria:**

1. User can add a fueling record with all required data in under 30 seconds
2. Date defaults to today, odometer shows last value as hint, price per liter auto-calculates
3. User can mark whether they filled the tank completely or partially
4. User can see all fuelings for a vehicle sorted by date (newest first)
5. User receives toast confirmation when fueling is added/edited/deleted

**Plans:**

- [ ] 03-01-PLAN.md — Install dependencies and create fueling type definitions
- [ ] 03-02-PLAN.md — Create TanStack Query hooks and draft persistence hooks
- [ ] 03-03-PLAN.md — Create fueling form, list, and delete modal components
- [ ] 03-04-PLAN.md — Create API routes and page components for complete CRUD

**Notes:**

- This phase delivers the core value proposition
- Smart defaults are critical for speed
- Full tank marker is essential for accurate consumption calculation in Phase 4

---

### Phase 4: Statistics & Charts

**Goal:** Users can view fuel consumption and cost statistics for their vehicles.

**Dependencies:** Phase 3 (fueling data required for calculations)

**Requirements:**

- STAT-01: User can view fuel consumption (L/100km) over time chart
- STAT-02: User can view monthly fuel costs chart
- STAT-03: User can view summary: total spent, average consumption, total distance
- STAT-04: Consumption is calculated only from full-tank fuelings

**Success Criteria:**

1. User can see a line chart showing L/100km consumption over time
2. User can see a bar chart showing monthly fuel costs
3. User can see summary numbers: total PLN spent, average L/100km, total km driven
4. Consumption calculation uses only full-tank-to-full-tank intervals
5. User sees "not enough data" message instead of wrong numbers when insufficient fuelings

**Plans:** 5 plans

**Plans:**

- [x] 04-01-PLAN.md — Build statistics aggregation API and helpers
- [x] 04-02-PLAN.md — Install Recharts and add statistics data hook
- [x] 04-03-PLAN.md — Build statistics UI components and charts
- [x] 04-04-PLAN.md — Wire statistics page to summary and charts
- [x] 04-05-PLAN.md — Human verification of statistics charts

**Notes:**

- Research recommends Recharts for charts
- Full-tank algorithm is critical for accuracy
- Empty states must be meaningful, not just "no data"

---

### Phase 5: Dashboard

**Goal:** Users see a summary overview of all their vehicles and recent activity.

**Dependencies:** Phases 2, 3, 4 (needs vehicles, fuelings, and stats data)

**Requirements:**

- UIUX-02: Dashboard shows summary of user's vehicles and recent activity

**Success Criteria:**

1. Dashboard shows all user's vehicles with key stats (total spent, last fueling date)
2. Dashboard shows recent activity (last 5-10 fuelings across all vehicles)
3. Dashboard provides quick access to add fueling for any vehicle
4. Dashboard loads quickly with meaningful loading states

**Notes:**

- Dashboard is the landing page after sign-in
- Aggregates data from all vehicles
- Quick add button supports core value (fast entry)

---

## Progress

| Phase | Name                | Requirements | Status   |
| ----- | ------------------- | ------------ | -------- |
| 1     | Auth & App Shell    | 6            | Complete |
| 2     | Vehicle Management  | 6            | Complete |
| 3     | Fueling Records     | 9            | Complete |
| 4     | Statistics & Charts | 4            | Complete |
| 5     | Dashboard           | 1            | Pending  |

**Total:** 26 requirements across 5 phases (25 complete, 1 remaining)

## Dependency Graph

```
Phase 1: Auth & App Shell
    └── Phase 2: Vehicle Management
            └── Phase 3: Fueling Records
                    └── Phase 4: Statistics & Charts
                            └── Phase 5: Dashboard
```

All phases are sequential. Each depends on the previous.

---

_Roadmap created: 2026-01-30_
_Last updated: 2026-02-03 (Phase 4 complete)_
