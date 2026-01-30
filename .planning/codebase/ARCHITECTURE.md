# Architecture

**Analysis Date:** 2026-01-30

## Pattern Overview

**Overall:** Next.js Pages Router Monolith with API Routes

**Key Characteristics:**

- Single Next.js application serving both frontend and API
- Pages Router pattern with file-based routing
- Prisma ORM for database access via API routes
- TanStack Query for client-side data fetching and caching
- NextAuth.js for authentication with JWT strategy

## Layers

**Presentation Layer:**

- Purpose: React components rendering UI
- Location: `components/`, `pages/`
- Contains: React functional components, Chakra UI/Tailwind styling
- Depends on: Hooks, types, TanStack Query
- Used by: End users via browser

**Page Layer:**

- Purpose: Next.js page components and routing
- Location: `pages/`
- Contains: Route handlers, SSR logic (getServerSideProps)
- Depends on: Components, API routes
- Used by: Next.js routing system

**API Layer:**

- Purpose: REST API endpoints for data operations
- Location: `pages/api/`
- Contains: HTTP handlers with switch-based method routing
- Depends on: Prisma client, database
- Used by: Frontend via fetch calls

**Data Access Layer:**

- Purpose: Database connectivity and ORM
- Location: `lib/prisma.ts`, `prisma/schema.prisma`
- Contains: Prisma client singleton, schema definitions
- Depends on: PostgreSQL database
- Used by: API routes

**Type Layer:**

- Purpose: TypeScript type definitions and enums
- Location: `types/`
- Contains: Custom types, Prisma-derived types, enums
- Depends on: None
- Used by: All layers

## Data Flow

**Read Operations (Client-Side):**

1. User navigates to page (e.g., `/vehicles`)
2. Page component initializes TanStack Query with queryKey
3. Query function makes fetch request to `/api/vehicles`
4. API route queries Prisma, returns JSON
5. TanStack Query caches response, triggers re-render
6. Component renders data with loading/error states

**Write Operations (Mutations):**

1. User submits form (Formik handles validation)
2. Form onSubmit triggers TanStack Query mutation
3. Mutation function POSTs to API route
4. API route creates/updates via Prisma
5. On success: toast notification, query invalidation, redirect
6. On error: toast notification with error message

**State Management:**

- Server state: TanStack Query (caching, refetching)
- Form state: Formik (values, validation, submission)
- UI state: React useState in components
- Auth state: NextAuth.js SessionProvider

## Key Abstractions

**Vehicle:**

- Purpose: Core domain entity for tracked vehicles
- Examples: `prisma/schema.prisma` (Vehicle model), `pages/api/vehicles/`
- Pattern: CRUD operations via REST API

**Fueling:**

- Purpose: Fuel purchase records linked to vehicles
- Examples: `prisma/schema.prisma` (Fueling model), `pages/api/fueling/`
- Pattern: Create records with related vehicle mileage updates

**Session/User:**

- Purpose: Authentication and user identity
- Examples: `pages/api/auth/[...nextauth].ts`, `types/next-auth.d.ts`
- Pattern: NextAuth.js with Google OAuth, JWT strategy

## Entry Points

**Application Entry:**

- Location: `pages/_app.tsx`
- Triggers: Every page load
- Responsibilities: Provider wrappers (Chakra, QueryClient, Session), Layout

**API Entry Points:**

- Location: `pages/api/vehicles/index.ts`, `pages/api/vehicles/[id].ts`
- Triggers: HTTP requests from client
- Responsibilities: CRUD operations for vehicles

- Location: `pages/api/fueling/index.ts`
- Triggers: HTTP requests from client
- Responsibilities: Fueling record creation, vehicle mileage sync

- Location: `pages/api/auth/[...nextauth].ts`
- Triggers: Auth-related requests
- Responsibilities: Google OAuth, session management

**Page Entry Points:**

- Location: `pages/index.tsx` (Dashboard)
- Location: `pages/vehicles/index.tsx` (Vehicle list)
- Location: `pages/vehicles/[id]/statistics.tsx` (Vehicle details)
- Location: `pages/vehicles/[id]/fueling/new.tsx` (Add fueling)

## Error Handling

**Strategy:** Component-level error states with TanStack Query

**Patterns:**

- Query errors: Render `<FetchDataErrorAlert>` component
- Mutation errors: Display toast notification via `useToast()`
- Loading states: Render `<Loading>` spinner component
- Auth errors: Redirect or show "sign in first" message

**Example Pattern:**

```typescript
const { isPending, isError, data } = useQuery({...});

if (isPending) return <Loading />;
if (isError) return <FetchDataErrorAlert errorMessage='...' />;
```

## Cross-Cutting Concerns

**Logging:**

- Prisma query logging enabled: `log: ['query']`
- Console logging for debug: `console.log()` in handlers
- No structured logging framework

**Validation:**

- Form validation: Formik (currently minimal implementation)
- API validation: Direct database operations (no input validation layer)
- Type safety: TypeScript (strict mode disabled)

**Authentication:**

- Provider: NextAuth.js with Google OAuth
- Strategy: JWT (stateless sessions)
- Protection: Per-component `useSession()` checks
- No middleware-based route protection

**Styling:**

- Primary: Chakra UI 3.x components
- Secondary: Tailwind CSS utility classes
- Both frameworks used in same codebase (mixed approach)

---

_Architecture analysis: 2026-01-30_
