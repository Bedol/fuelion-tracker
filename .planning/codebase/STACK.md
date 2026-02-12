# Technology Stack

**Analysis Date:** 2026-01-30

## Languages

**Primary:**

- TypeScript 5.9.3 - All application code (pages, components, API routes)
- JavaScript - Config files only (next.config.js, eslint.config.mjs, etc.)

**Secondary:**

- SQL - Database migrations via Prisma (`prisma/migrations/`)
- JSON - Static data and configuration

## Runtime

**Environment:**

- Node.js 20.15 (CI) / 20.14.0 (release workflow)
- No `.nvmrc` file present - version specified in CI workflows only

**Package Manager:**

- npm (no version constraint specified)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**

- Next.js 16.1.4 - Pages Router architecture (not App Router)
  - Entry: `pages/_app.tsx`
  - Config: `next.config.js`
  - React Strict Mode: enabled

**UI:**

- Chakra UI 3.31.0 - Primary component library
  - Setup: `ChakraProvider` with `createSystem(defaultConfig)` in `pages/_app.tsx`
  - Icons: `@chakra-ui/icons` 2.2.4 (legacy v2 icons package)
- Tailwind CSS 4.1.17 - Utility CSS (co-exists with Chakra)
  - Config: `tailwind.config.js`
  - PostCSS: `@tailwindcss/postcss` 4.1.18

**State/Data:**

- TanStack React Query 5.90.19 - Server state management
  - Devtools: `@tanstack/react-query-devtools` 5.91.2 (dev only, hidden in production)
  - Setup: `QueryClientProvider` wrapping app in `pages/_app.tsx`

**Forms:**

- Formik 2.4.9 - Form state management
  - Pattern: `<Formik>` component with `<Field>` children

**Animation:**

- Framer Motion 12.28.1 - Animation library (required by Chakra UI)

**Testing:**

- None configured - no test framework installed

**Build/Dev:**

- PostCSS 8.5.6 with autoprefixer 10.4.23
- TypeScript compilation via Next.js (no separate tsc build)

## Key Dependencies

**Critical:**

- `@prisma/client` 7.3.0 - Database ORM
- `next-auth` 4.24.13 - Authentication
- `@next-auth/prisma-adapter` 1.0.7 - NextAuth Prisma integration
- `react` 19.2.3 / `react-dom` 19.2.3 - UI runtime

**Infrastructure:**

- `dotenv` 17.2.3 - Environment variable loading
- `@emotion/react` 11.14.0 / `@emotion/styled` 11.14.1 - CSS-in-JS (Chakra dependency)

**Utilities:**

- `country-state-city` 3.2.1 - Geographic data (countries, states)
- `react-icons` 5.5.0 - Icon library

**Dev Tools:**

- `prisma` 7.2.0 - Prisma CLI
- `eslint` 9.39.2 with `eslint-config-next` 16.1.4
- `prettier` 3.8.1
- `typescript` 5.9.3
- `@commitlint/cli` 20.3.0 - Commit message linting
- `lint-staged` 16.2.7 - Pre-commit hooks
- `semantic-release` 25.0.2 - Automated versioning

## Configuration

**TypeScript (`tsconfig.json`):**

- Target: ES5
- Module: ESNext with Node resolution
- Strict mode: **disabled** (`strict: false`)
- JSX: preserve (Next.js handles transformation)
- Incremental compilation enabled

**Prettier (`.prettierrc`):**

```json
{
	"tabWidth": 2,
	"useTabs": true,
	"printWidth": 80,
	"semi": true,
	"trailingComma": "es5",
	"jsxSingleQuote": true,
	"singleQuote": true
}
```

**ESLint (`eslint.config.mjs`):**

- Flat config format (ESLint 9.x)
- Plugins: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react`
- Ignores: `node_modules/**`, `.next/*`

**Environment:**

- Variables loaded via `dotenv`
- Required at runtime:
  - `DATABASE_URL` - PostgreSQL connection string
  - `GOOGLE_CLIENT_ID` - OAuth client ID
  - `GOOGLE_CLIENT_SECRET` - OAuth secret
  - `NEXTAUTH_SECRET` - Session encryption (implied by NextAuth)

**Build:**

- `next.config.js` - Minimal config, only remote image patterns
- `postcss.config.js` - Tailwind + autoprefixer
- No custom webpack configuration

## Platform Requirements

**Development:**

- Node.js 20.x
- PostgreSQL 15.x (via Docker recommended)
- Docker (optional, for `docker-compose.yml` database setup)

**Production:**

- Node.js 20.x runtime
- PostgreSQL database
- No specific deployment target configured (Vercel-compatible by default)

**CI/CD:**

- GitHub Actions
- Workflows:
  - `.github/workflows/node.js.yml` - Build + lint on push/PR to main
  - `.github/workflows/release.yml` - Semantic release on main/develop
- Dependabot: Daily npm updates targeting `develop` branch

---

_Stack analysis: 2026-01-30_
