# Codebase Structure

**Analysis Date:** 2026-01-30

## Directory Layout

```
fuelion-opencode/
├── components/           # React UI components
│   ├── errors/           # Error display components
│   ├── Form/             # Reusable form inputs
│   ├── fueling/          # Fueling-related components
│   │   └── data/         # Static data (dictionaries, types)
│   ├── statistics/       # Charts and analytics components
│   └── vehicles/         # Vehicle-related components
├── hooks/                # Custom hooks and data utilities
│   └── data/             # Static JSON data files
├── lib/                  # Shared utilities
├── pages/                # Next.js pages (routing)
│   ├── api/              # API route handlers
│   │   ├── auth/         # NextAuth.js handlers
│   │   ├── fueling/      # Fueling CRUD endpoints
│   │   └── vehicles/     # Vehicle CRUD endpoints
│   ├── auth/             # Auth pages (signin)
│   ├── expenses/         # Expense tracking pages
│   ├── profiles/         # User profile pages
│   └── vehicles/         # Vehicle pages
│       └── [id]/         # Dynamic vehicle routes
│           └── fueling/  # Per-vehicle fueling pages
├── prisma/               # Database schema and migrations
│   └── migrations/       # Prisma migration files
├── public/               # Static assets
├── styles/               # Global CSS
└── types/                # TypeScript type definitions
```

## Directory Purposes

**`components/`:**

- Purpose: Reusable React UI components
- Contains: Functional components, layout elements, form controls
- Key files: `Layout.tsx`, `Header.tsx`, `Sidebar.tsx`, `Loading.tsx`

**`components/errors/`:**

- Purpose: Error state UI components
- Contains: Alert components for fetch failures
- Key files: `FetchDataErrorAlert.tsx`

**`components/Form/`:**

- Purpose: Reusable form input components
- Contains: Custom Chakra UI wrappers
- Key files: `NumberInput.tsx`, `SliderThumbWithTooltip.tsx`

**`components/fueling/`:**

- Purpose: Fueling feature components
- Contains: Forms, data dictionaries
- Key files: `NewFuelingForm.tsx`, `data/dictionary.ts`, `data/types.ts`

**`components/vehicles/`:**

- Purpose: Vehicle feature components
- Contains: Vehicle cards, forms
- Key files: `VehicleCard.tsx`, `VehicleForm.tsx`

**`hooks/`:**

- Purpose: Custom React hooks and data utilities
- Contains: Data fetchers, static data loaders
- Key files: `getCountries.ts`, `getStates.ts`, `data/countries.json`

**`lib/`:**

- Purpose: Shared library code
- Contains: Prisma client singleton
- Key files: `prisma.ts`

**`pages/`:**

- Purpose: Next.js page routes (file-based routing)
- Contains: Page components with SSR logic
- Key files: `_app.tsx`, `index.tsx`

**`pages/api/`:**

- Purpose: Backend REST API routes
- Contains: HTTP handlers for CRUD operations
- Key files: `vehicles/index.ts`, `vehicles/[id].ts`, `fueling/index.ts`

**`prisma/`:**

- Purpose: Database schema and migration history
- Contains: Prisma schema, SQL migrations
- Key files: `schema.prisma`

**`types/`:**

- Purpose: TypeScript type definitions
- Contains: Custom types, enums, NextAuth extensions
- Key files: `vehicle_types.ts`, `next-auth.d.ts`

## Key File Locations

**Entry Points:**

- `pages/_app.tsx`: Application wrapper with providers
- `pages/index.tsx`: Home page/dashboard

**Configuration:**

- `next.config.js`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `prisma/schema.prisma`: Database schema
- `.env` (not committed): Environment variables

**Core Logic:**

- `lib/prisma.ts`: Database client singleton
- `pages/api/auth/[...nextauth].ts`: Authentication handler
- `pages/api/vehicles/index.ts`: Vehicle list/create API
- `pages/api/vehicles/[id].ts`: Vehicle detail/update/delete API
- `pages/api/fueling/index.ts`: Fueling list/create API

**Testing:**

- No test files currently exist

## Naming Conventions

**Files:**

- Components: `PascalCase.tsx` (e.g., `VehicleCard.tsx`, `NewFuelingForm.tsx`)
- Pages: `kebab-case` or `index.tsx` (e.g., `signin.tsx`, `new.tsx`)
- API routes: `index.ts` for collections, `[param].ts` for dynamic
- Types: `snake_case.ts` (e.g., `vehicle_types.ts`)
- Hooks: `camelCase.ts` (e.g., `getCountries.ts`)

**Directories:**

- Feature folders: `lowercase` (e.g., `fueling/`, `vehicles/`)
- Dynamic routes: `[param]/` (e.g., `[id]/`)

**Variables/Functions:**

- Components: `PascalCase` (e.g., `const VehicleCard = ...`)
- Functions: `camelCase` (e.g., `handleSubmit`, `backToVehicles`)
- Types: `PascalCase` (e.g., `VehicleData`, `SelectOptionType`)
- Enums: `PascalCase` values (e.g., `FuelType.Gasoline`)

## Where to Add New Code

**New Feature:**

- Primary code: `pages/[feature-name]/` for pages
- Components: `components/[feature-name]/` for UI
- API: `pages/api/[feature-name]/` for endpoints
- Tests: Not currently configured

**New Component:**

- Shared/layout: `components/ComponentName.tsx`
- Feature-specific: `components/[feature]/ComponentName.tsx`
- Form inputs: `components/Form/ComponentName.tsx`
- Error handling: `components/errors/ComponentName.tsx`

**New API Endpoint:**

- Collection endpoint: `pages/api/[resource]/index.ts`
- Single resource: `pages/api/[resource]/[id].ts`
- Nested resource: `pages/api/[parent]/[parentId]/[child]/index.ts`

**New Type:**

- Domain types: `types/[domain]_types.ts`
- NextAuth extensions: `types/next-auth.d.ts`
- Component-local types: Inline in component file

**Utilities:**

- Database: `lib/` directory
- Data hooks: `hooks/` directory
- Static data: `hooks/data/` for JSON files

## Special Directories

**`node_modules/`:**

- Purpose: NPM dependencies
- Generated: Yes
- Committed: No

**`.next/`:**

- Purpose: Next.js build output
- Generated: Yes
- Committed: No

**`prisma/migrations/`:**

- Purpose: Database migration history
- Generated: Yes (by Prisma)
- Committed: Yes

**`.planning/`:**

- Purpose: Planning and analysis documents
- Generated: No
- Committed: Yes

**`.husky/`:**

- Purpose: Git hooks configuration
- Generated: No
- Committed: Yes

---

_Structure analysis: 2026-01-30_
