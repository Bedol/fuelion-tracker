# Project Research Summary

**Project:** Fuelion - Vehicle Expense Tracking App  
**Domain:** Vehicle expense/fuel tracking application (Polish market)  
**Researched:** 2026-01-30  
**Confidence:** HIGH

## Executive Summary

Fuelion is expanding from a basic fuel tracking app to a comprehensive vehicle expense management system targeting Polish households with 3-5 vehicles. The research confirms this is a well-understood domain with established competitors (Fuelio 5M+ downloads, Drivvo 1M+) providing clear feature benchmarks. The recommended approach is to enhance the existing stack minimally: add **Recharts** for visualization, **UploadThing** with Chakra UI's built-in FileUpload for vehicle photos, and leverage existing **Formik + Chakra UI 3.x** for faster data entry through smart defaults. The hybrid data model approach (keeping specialized Fueling table, enhancing generic Expense table with enum types and JSON metadata) preserves existing functionality while enabling extensibility.

The primary risks center on three areas: (1) **data entry friction** — the core value proposition is 30-second fueling entry, which requires aggressive use of smart defaults from user profiles (already in schema but underutilized); (2) **statistics accuracy** — fuel consumption calculations are only valid between full-tank entries, and this must be enforced algorithmically and explained in UI; (3) **codebase health** — mixed Chakra/Tailwind styling, disabled TypeScript strict mode, and zero tests create accumulating technical debt that must be addressed before the statistics phase. Addressing these risks early prevents compounding issues as features are added.

The competitive landscape shows clear user expectations: free cloud sync (subscription fatigue is real), receipt photo storage, service reminders, and responsive mobile-first design. The "no subscription" model combined with Polish market focus (PLN-only, Polish station presets) provides differentiation opportunity. The recommended 6-phase build order addresses dependencies correctly: Foundation (codebase cleanup) -> Data Entry UX -> Expense Types -> Image Upload -> Statistics API -> Statistics Dashboard.

## Key Findings

### Recommended Stack

The existing Next.js 16.1/Chakra UI 3.x/TanStack Query 5.x/Formik 2.x/Prisma 7.x stack is well-suited for expansion. Only two new packages are needed.

**Core technologies:**

- **Recharts v3.7.0**: Charting — React-native, declarative, excellent TypeScript support, 2.4M weekly downloads, perfect for expense tracking charts (line, bar, pie)
- **UploadThing v7.x + @uploadthing/react**: Image upload — First-party Next.js Pages Router support, managed storage, type-safe file routes, works with NextAuth
- **Chakra UI 3.x FileUpload**: Upload UI — Already installed, built-in drag & drop, consistent styling, zero new dependencies for UI
- **Existing Formik + Chakra components**: Form UX — NumberInput, Field, Combobox, SegmentedControl already available; focus on patterns (smart defaults) not new libraries

**Not recommended:**

- Chart.js/react-chartjs-2: Canvas-based, less React-idiomatic
- Cloudinary: Overkill for vehicle photos, complex pricing
- react-hook-form: Already using Formik, migration cost not worth it

### Expected Features

**Must have (table stakes):**

- Quick fueling entry (<30 seconds) with smart defaults, partial fill support
- Multiple vehicles with photos for visual identification
- Non-fuel expense categories: Insurance, Service, Parking, Tolls, Tax, Other
- Core statistics: L/100km consumption, cost per km/month/year
- Basic charts: Consumption trends, monthly cost breakdown
- Data export (CSV) for tax purposes
- Responsive mobile UI with large touch targets

**Should have (competitive):**

- Smart defaults: Remember last station, estimate odometer from average
- Polish station presets: Orlen, BP, Shell, Circle K
- Service reminders (date-based): Insurance renewal, inspection due
- Household total cost view: All vehicles combined
- Receipt photo attachment (storage only, no OCR)

**Defer (v2+):**

- Offline mode with sync (requires service workers, IndexedDB)
- Receipt OCR (high complexity)
- Voice entry (hands-free at gas pump)
- Mileage-based reminders (more complex odometer tracking)
- GPS trip tracking (battery drain, privacy, scope creep)
- Multi-currency, fleet management, OBD-II integration

### Architecture Approach

The hybrid data model preserves the existing specialized Fueling table (working, detailed fields) while enhancing the generic Expense table with an `ExpenseType` enum and JSON metadata for type-specific flexibility. A new VehiclePhoto model with Vercel Blob URLs handles vehicle images. Statistics use Prisma's `groupBy()` and `aggregate()` for monthly summaries, with TanStack Query caching (5-minute stale time) preventing unnecessary recalculation.

**Major components:**

1. **Enhanced Expense model** — Single table for all non-fuel expenses with enum type discriminator and JSON metadata for flexibility
2. **VehiclePhoto model** — Stores Vercel Blob URLs, size, pathname; supports max 5 photos per vehicle
3. **Statistics API** — `/api/vehicles/[id]/statistics` with period filtering, parallel Prisma queries, combined Fueling + Expense aggregation
4. **Smart defaults system** — Leverage existing User profile fields (default_country, default_region, favorite_station, default_currency_id)

### Critical Pitfalls

1. **Partial tank consumption calculation** — Only calculate L/100km between consecutive full_tank=true entries; show "Not enough data" instead of wrong numbers; explain in UI
2. **Too many required fields** — Implement smart defaults from User profile BEFORE adding new expense types; make location/station optional; pre-fill date/currency
3. **No tests + statistics** — Add Vitest before statistics phase; test consumption calculations, mileage validation, expense totals; financial data shown to users MUST be correct
4. **Mixed Chakra/Tailwind styling** — Establish Chakra-first pattern for all new components; convert Tailwind on touch; never mix in same component
5. **Image upload security** — 5MB client-side limit, validate format by magic bytes (not extension), use UploadThing which handles this; cascade delete images with expenses/vehicles

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Codebase Health

**Rationale:** Must address codebase risks before adding features; mixed styling and missing tests will compound with every new feature
**Delivers:** Clean foundation, testing infrastructure, established patterns
**Addresses:** Codebase health issues, developer velocity
**Avoids:** Style inconsistency escalation, breaking changes without tests

Key tasks:

- Establish Chakra-first styling pattern, document in AGENTS.md
- Add Vitest + React Testing Library
- Fix QueryClient instantiation (move inside component)
- Add Zod for API input validation
- Enable `strictNullChecks` in tsconfig.json

### Phase 2: Data Entry UX Enhancement

**Rationale:** Core value proposition ("30-second fueling entry") depends on this; must work before adding more expense types
**Delivers:** Fast, friction-free fueling entry with smart defaults
**Uses:** Existing Chakra UI form components (NumberInput, Field, SegmentedControl)
**Implements:** Smart defaults from User profile

Key tasks:

- Implement smart defaults (last station, today's date, estimated odometer, last price)
- Locale-aware number input for Polish decimal separator (comma)
- "Today"/"Yesterday" quick date buttons
- Auto-calculate cost_per_unit from cost/quantity
- Simplify forms: remove currency selector (PLN only), make location optional
- Add mileage validation with warnings for unusual jumps

### Phase 3: Expense Types & Categories

**Rationale:** Database model must be enhanced before image upload (which attaches to expenses/vehicles) and statistics (which aggregates expenses)
**Delivers:** Multiple expense categories matching Polish vehicle ownership patterns
**Uses:** Enhanced Expense model with ExpenseType enum and JSON metadata
**Implements:** Hybrid data model (keep Fueling, enhance Expense)

Key tasks:

- Add ExpenseType enum: SERVICE, INSURANCE, TAX, PARKING, TOLL, OTHER
- Add metadata JSON field for type-specific data
- Create `/api/expenses/` endpoints with type filtering
- Build expense entry form with type-specific fields
- Test expense creation and aggregation

### Phase 4: Image Upload

**Rationale:** Vehicle photos enable visual identification for multi-vehicle households; independent of expense types, can be built in parallel
**Delivers:** Vehicle photo upload with storage, display, and deletion
**Uses:** UploadThing + Chakra UI FileUpload
**Implements:** VehiclePhoto model, Vercel Blob integration

Key tasks:

- Add VehiclePhoto model to Prisma schema
- Create `/api/vehicles/[id]/photos` endpoints
- Implement upload with 5MB limit, JPEG/PNG/WebP validation
- Build photo upload UI in vehicle detail page
- Implement cascade delete (vehicle deletion removes photos)
- Test mobile camera capture

### Phase 5: Statistics API

**Rationale:** Needs expense data to exist; calculation logic must be tested before building charts
**Delivers:** Aggregated statistics endpoint with consumption and cost breakdowns
**Uses:** Prisma groupBy/aggregate, TanStack Query caching
**Implements:** Statistics API with parallel queries

Key tasks:

- Create `/api/vehicles/[id]/statistics` endpoint
- Implement full-tank-only consumption calculation with tests
- Combine Fueling + Expense aggregation by type and period
- Add TanStack Query hooks with 5-minute stale time
- Handle empty data gracefully (minimum data requirements)

### Phase 6: Statistics Dashboard & Charts

**Rationale:** Last phase; needs all data and APIs complete
**Delivers:** Visual statistics with consumption trends, cost breakdowns, monthly comparisons
**Uses:** Recharts v3.7.0
**Implements:** ResponsiveContainer charts with Chakra UI styling

Key tasks:

- Install Recharts
- Build consumption trend LineChart
- Build monthly cost breakdown BarChart
- Build expense category PieChart
- Implement meaningful empty states ("Add 3 more fuelings to see trend")
- Ensure Y-axis starts at 0 for consumption charts
- Responsive mobile layout

### Phase Ordering Rationale

- **Foundation first:** Codebase health issues (mixed styling, no tests) will multiply with each feature added. Addressing them first prevents compounding debt.
- **Data entry before new expense types:** The "quick entry" value proposition must work for existing fuelings before adding complexity of multiple expense categories.
- **Expense types before statistics:** Statistics aggregate expense data. The data model and entry mechanisms must exist first.
- **Image upload parallel with statistics:** These are independent streams after Phase 3. Could be swapped or done in parallel.
- **Charts last:** Visualization layer on top of complete data and API foundation.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 4 (Image Upload):** Mobile camera integration quirks, HEIC format handling, may need testing on actual devices
- **Phase 5 (Statistics):** Full-tank algorithm edge cases (what if only 1 full-tank entry?), period boundary handling

Phases with standard patterns (skip research-phase):

- **Phase 1 (Foundation):** Standard Vitest setup, Zod patterns well-documented
- **Phase 2 (Data Entry):** Using existing Chakra components, established Formik patterns
- **Phase 3 (Expense Types):** Standard Prisma enum and CRUD patterns
- **Phase 6 (Charts):** Recharts has excellent docs, expense tracking charts are standard

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                           |
| ------------ | ---------- | --------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | Official docs verified (Recharts v3.7.0 Jan 2026, UploadThing v7.x, Chakra UI 3.x)                              |
| Features     | MEDIUM     | Based on competitor app store listings and reviews; Polish-specific patterns would benefit from user validation |
| Architecture | HIGH       | Prisma docs verified, existing codebase patterns analyzed, Vercel Blob officially documented                    |
| Pitfalls     | MEDIUM     | Code analysis solid, domain patterns from industry knowledge; Polish market decimal/locale needs user testing   |

**Overall confidence:** HIGH

### Gaps to Address

- **Polish user research:** Expense categories based on general knowledge; validate with actual Polish vehicle owners that categories match their needs
- **Decimal separator behavior:** Implement locale-aware input and test with Polish users that comma/dot handling works correctly
- **Mobile upload UX:** Test camera capture and upload flow on actual mobile devices, not just responsive desktop
- **Consumption algorithm edge cases:** Define behavior when user has 0 or 1 full-tank entries; design "not enough data" states

## Sources

### Primary (HIGH confidence)

- Recharts official docs: https://recharts.github.io/ (v3.7.0 released Jan 21, 2026)
- Recharts GitHub: https://github.com/recharts/recharts (26.6k stars)
- UploadThing docs: https://docs.uploadthing.com/getting-started/pagedir
- Chakra UI 3.x docs: https://www.chakra-ui.com/docs/components/file-upload
- Prisma aggregation docs: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
- Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob
- Existing codebase analysis: prisma/schema.prisma, pages/api/\*.ts, AGENTS.md

### Secondary (MEDIUM confidence)

- Google Play Store: Fuelio listing (133K reviews, 5M+ downloads)
- Google Play Store: Drivvo listing (112K reviews, 1M+ downloads)
- Google Play Store: aCar listing (21K reviews, 1M+ downloads)
- Spritmonitor.de (855K users, 53M fuel-ups)
- Fuelly.com (711K users, 62M fuel-ups)
- User reviews from app stores (real feedback but individual perspectives)

### Tertiary (LOW confidence)

- Polish vehicle expense patterns: General domain knowledge, needs user validation

---

_Research completed: 2026-01-30_
_Ready for roadmap: yes_
