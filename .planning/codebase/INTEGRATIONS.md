# External Integrations

**Analysis Date:** 2026-01-30

## APIs & External Services

**Geographic Data:**

- countries-states-cities-database - Country/state/city data
  - SDK/Client: `country-state-city` npm package
  - Data source: Local JSON file `hooks/data/countries.json`
  - Usage: `hooks/getCountries.ts`, `hooks/getStates.ts`
  - Auth: None required (static data)

**No Other External APIs Detected:**

- No payment processors (Stripe, etc.)
- No analytics services
- No email/SMS services
- No cloud storage SDKs
- No third-party API integrations beyond auth

## Data Storage

**Primary Database:**

- PostgreSQL 15.x
  - Provider: Self-hosted or any PostgreSQL provider
  - Connection: `DATABASE_URL` environment variable
  - Client: Prisma ORM (`@prisma/client` 7.3.0)
  - Schema: `prisma/schema.prisma`
  - Singleton: `lib/prisma.ts` (prevents connection exhaustion in dev)

**Database Schema Overview:**

```
User       - User accounts and preferences
Account    - OAuth provider accounts (NextAuth)
Session    - User sessions (NextAuth)
Vehicle    - User vehicles
Fueling    - Fuel records per vehicle
Expense    - Expense records per vehicle
VerificationToken - Email verification (NextAuth)
```

**Local Development Database:**

- Docker Compose setup: `docker-compose.yml`
  - PostgreSQL 15.1-alpine on port 5432
  - pgAdmin 4 on port 5050 (admin@admin.com / password)

**File Storage:**

- Local filesystem only
- User images loaded from Google OAuth profile (external URL)
- Placeholder images from `via.placeholder.com` (configured in `next.config.js`)

**Caching:**

- None configured
- TanStack Query provides client-side caching only

## Authentication & Identity

**Auth Provider:**

- NextAuth.js 4.24.13
  - Config: `pages/api/auth/[...nextauth].ts`
  - Strategy: JWT sessions (`session.strategy: "jwt"`)
  - Adapter: Prisma Adapter (`@next-auth/prisma-adapter`)

**OAuth Providers:**

- Google OAuth (only provider configured)
  - `GOOGLE_CLIENT_ID` - OAuth client ID (required)
  - `GOOGLE_CLIENT_SECRET` - OAuth secret (required)

**Session Management:**

- JWT-based (not database sessions)
- User ID injected into session via callback
- Session wrapped by `SessionProvider` in `pages/_app.tsx`

**Custom Session Extension:**

- Type augmentation: `types/next-auth.d.ts`
- Adds `user.id: number` to session

**Auth Flow:**

1. User clicks sign in
2. Redirects to Google OAuth
3. On success, creates/updates User + Account in database
4. JWT issued with user ID
5. Session available via `useSession()` hook

## Monitoring & Observability

**Error Tracking:**

- None configured (no Sentry, Datadog, etc.)

**Logs:**

- Prisma query logging enabled in development (`log: ['query']`)
- Console-based logging only
- No structured logging framework

**APM:**

- None configured

## CI/CD & Deployment

**Hosting:**

- Not explicitly configured
- Next.js app compatible with Vercel, Railway, etc.
- No `Dockerfile` present

**CI Pipeline (GitHub Actions):**

Build workflow (`.github/workflows/node.js.yml`):

- Triggers: Push/PR to `main`
- Node.js 20.15
- Steps: `npm ci` -> `npm run build` -> ESLint + Prettier via lint-action

Release workflow (`.github/workflows/release.yml`):

- Triggers: Push to `main` or `develop`
- Node.js 20.14.0
- Steps: Install -> Lint -> Build -> Semantic Release
- Semantic Release: Changelog, npm (no publish), GitHub release, git commit
- Requires `SEMANTIC_RELEASE_TOKEN` secret

**Dependency Management:**

- Dependabot (`.github/dependabot.yml`)
  - Daily npm updates
  - PRs target `develop` branch
  - Labels: `npm`, `dependencies`
  - Reviewer: `Bedol`

## Environment Configuration

**Required Environment Variables:**

| Variable               | Purpose                      | Used In                             |
| ---------------------- | ---------------------------- | ----------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string | `prisma/schema.prisma`              |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       | `pages/api/auth/[...nextauth].ts`   |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   | `pages/api/auth/[...nextauth].ts`   |
| `NEXTAUTH_SECRET`      | JWT encryption key           | NextAuth (implicit)                 |
| `NEXTAUTH_URL`         | Canonical app URL            | NextAuth (implicit, for production) |

**Optional Environment Variables:**

- `NODE_ENV` - Detected for conditional logic (devtools, prisma singleton)
- `NEXT_TELEMETRY_DISABLED` - Set to 1 in CI

**Secrets Location:**

- Environment variables (no `.env` files committed)
- GitHub Secrets for CI (`SEMANTIC_RELEASE_TOKEN`)

**Example `.env.local`:**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fuelion?schema=public"
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Webhooks & Callbacks

**Incoming:**

- `/api/auth/callback/google` - Google OAuth callback (NextAuth managed)
- No other webhook endpoints

**Outgoing:**

- None configured

## API Routes

**Internal API (`pages/api/`):**

| Route                     | Methods          | Purpose                    |
| ------------------------- | ---------------- | -------------------------- |
| `/api/auth/[...nextauth]` | GET, POST        | NextAuth handlers          |
| `/api/vehicles`           | GET, POST        | List/create vehicles       |
| `/api/vehicles/[id]`      | GET, PUT, DELETE | CRUD single vehicle        |
| `/api/fueling`            | GET, POST        | List/create fuelings       |
| `/api/hello`              | GET              | Health check (placeholder) |

**API Pattern:**

- Switch statement on `req.method`
- Direct Prisma calls (no service layer)
- No authentication middleware on vehicle/fueling routes
- No rate limiting

---

_Integration audit: 2026-01-30_
