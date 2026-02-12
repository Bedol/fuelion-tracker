# Phase 2: Vehicle Management - Context

**Gathered:** 2026-01-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can create, view, edit, and delete their vehicles with both basic identifying information (brand, model, year, registration) and optional technical specifications (engine capacity, power, fuel type). This phase delivers the foundational vehicle data structure that Phases 3 and 4 will build upon for fueling records and statistics.

Scope boundaries:

- IN: CRUD operations for single-user vehicle ownership
- IN: Basic and technical data fields per VEHI-01, VEHI-02
- OUT: Vehicle sharing between users
- OUT: Vehicle history/timeline features
- OUT: Photo uploads (v1 uses fuel type icons)

</domain>

<decisions>
## Implementation Decisions

### Vehicle Form Layout & Fields

- **Form structure:** Single page with all fields visible, organized in sections
  - Basic info section always visible (Brand, Model, Year, Registration, Fuel Type)
  - "Add technical data" expands to reveal optional fields (Engine capacity, Power)
  - Not a multi-step wizard - keep it simple for fast entry
- **Required fields:** Brand, Model, Year, Fuel Type
  - Registration is optional (some users may not have plates yet)
  - Technical data entirely optional - can be added later via edit
- **Brand & Model input:** Autocomplete from database
  - Suggest existing brands/models to maintain consistency
  - Allow custom entries for rare/imported vehicles
  - Free text fallback if no match found
- **Technical data fields:** Engine capacity, Power, Fuel type
  - Matches VEHI-02 requirement exactly
  - These fields appear only when "Add technical data" is expanded
  - All optional - not all users track this level of detail

- **Form location:** Dedicated `/vehicles/new` page
  - Separate route, not modal or drawer
  - Allows sharing links, browser back/forward, deep linking
  - Consistent with edit page pattern

- **Year input:** Number input field
  - Simple `<input type="number">` with min/max validation
  - Range: 1900 to current year + 1
  - More flexible than dropdown, faster to type

- **Fuel type options:** Gasoline, Diesel, LPG, Electric, Hybrid
  - Covers common fuel types in Polish market
  - Select/dropdown input
  - Required field (needed for Phase 3 fueling records)

- **Registration format:** Format hint only, no strict validation
  - Show placeholder example: "ABC 1234"
  - Accept any input - handles international plates, old formats, temporary registrations
  - Don't block users with validation errors

### Vehicle List Presentation

- **Layout style:** Card grid
  - Responsive grid: 1 column mobile, 2-3 columns tablet/desktop
  - Cards have hover states, clickable to navigate to detail page
  - Visual hierarchy with icons and clear typography

- **Card information:** Brand, Model, Year, Registration + Fuel type icon
  - Fuel type shown as icon (gas pump, electric plug, etc.) for visual scanning
  - Keep cards clean - save detailed specs for detail page
  - In Phase 3+, could add "Last fueling: 3 days ago" below

- **Empty state:** Illustration + message + CTA
  - Friendly graphic (car icon or illustration)
  - Message: "Add your first vehicle to start tracking fuel expenses"
  - Large "Add Vehicle" button
  - Encouraging tone, explains why action matters

- **Sorting/filtering:** Phase 2 - None, defer to future phase
  - Show vehicles in creation order (newest first)
  - With few vehicles, sorting/filtering adds complexity without value
  - Note as deferred idea: "Vehicle sorting/filtering" for post-v1

### Edit & Delete Behavior

- **Edit flow:** Navigate to `/vehicles/[id]/edit`
  - Separate edit page, consistent with create page
  - Pre-populate form with existing vehicle data
  - Same form structure as create (basic fields + expandable technical data)

- **Delete confirmation:** Modal dialog with Cancel/Delete buttons
  - Standard confirmation modal: "Are you sure you want to delete [Brand Model Year]?"
  - Explain consequence: "This vehicle and all its data will be archived."
  - Destructive button styling (red Delete button)
  - Cancel is default action (ESC key or click outside)

- **Cascade behavior:** Soft delete - archive vehicle
  - Vehicle marked as `deleted: true` in database, not actually removed
  - Hidden from list, but data preserved for potential restore
  - Associated fueling records also archived (not displayed, but recoverable)
  - Note: Restore functionality is out of scope for v1, but data integrity maintained

- **Delete access:** Both card menu and detail page
  - Vehicle cards have 3-dot overflow menu: View / Edit / Delete
  - Detail page has "Delete Vehicle" button (less prominent placement)
  - Edit page also has "Delete Vehicle" at bottom (danger zone pattern)

### Vehicle Detail Page Structure

- **Detail page purpose:** Container for future sections
  - Phase 2: Displays vehicle info with Edit/Delete actions
  - Phase 3: Adds "Fuelings" section below vehicle info
  - Phase 4: Adds "Statistics" section below fuelings
  - Designed to grow vertically as phases add capabilities

- **Layout structure:** Vertical sections (scroll)
  - Single scrolling page, not tabs or sidebar
  - Mobile-first: natural scroll behavior
  - Section order: Vehicle info → Fuelings (Phase 3) → Statistics (Phase 4)
  - Anchor links could jump to sections if page gets long

- **Header/hero area:** Brand Model Year + Key specs summary
  - Large heading: "[Brand] [Model] ([Year])"
  - Subheading row: Registration plate | Fuel type with icon | Engine specs
  - Compact but informative - user knows they're on the right vehicle
  - Optional: Fuel type icon/badge for visual recognition

- **Actions in Phase 2:** Edit, Delete, and "Add Fueling" placeholder
  - "Add Fueling" button visible but disabled
  - Tooltip or helper text: "Available in Phase 3"
  - Prepares users for upcoming functionality
  - Edit and Delete buttons fully functional

### Claude's Discretion

- Exact spacing, typography, and card styling
- Loading skeleton design for vehicle list
- Error state handling and messages
- Autocomplete implementation details (debouncing, minimum characters, result limit)
- Fuel type icon design and selection
- Color scheme for fuel type badges
- Soft delete implementation (field name, query filters)
- Responsive breakpoints for card grid

</decisions>

<specifics>
## Specific Ideas

- Form should feel fast to fill out - focus state progression, tab navigation
- Cards should be scannable at a glance - brand/model most prominent
- Empty state illustration should feel encouraging, not empty/sad
- Polish market context: LPG is common, electric less so (as of 2026)
- "Add technical data" expand/collapse should be smooth, not jarring
- Soft delete preserves data integrity for potential future analytics/exports

</specifics>

<deferred>
## Deferred Ideas

- **Vehicle sorting/filtering** - Wait until users have many vehicles (post-v1 enhancement)
- **Vehicle photo uploads** - Use fuel type icons in v1, photos could be Phase 6+
- **Vehicle sharing between users** - Out of scope for single-user v1
- **Restore deleted vehicles** - Soft delete maintains data, but UI for restore is post-v1
- **Vehicle history/timeline** - Track changes over time (future feature)
- **Import vehicle data from VIN** - API lookup for specs (future enhancement)
- **"Last fueling: X days ago" on cards** - Add once Phase 3 complete and data exists

</deferred>

---

_Phase: 02-vehicle-management_
_Context gathered: 2026-01-31_
