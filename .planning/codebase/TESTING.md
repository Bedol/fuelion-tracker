# Testing Patterns

**Analysis Date:** 2026-01-30

## Test Framework

**Runner:**

- **Not configured** - No test framework is set up

**Status:**

- No Jest, Vitest, or other test runner installed
- No test configuration files present
- No test files (`.test.*`, `.spec.*`) found in the codebase
- `package.json` has no test script defined

**Run Commands:**

```bash
# No test commands available
# npm test - not defined
```

## Test File Organization

**Location:**

- N/A - No tests exist

**Expected Pattern (if implementing):**

- Co-located: `components/VehicleCard.test.tsx`
- Or separate: `__tests__/components/VehicleCard.test.tsx`

**Naming:**

- N/A - No conventions established

## Pre-commit Hooks

**Configured via Husky:**

**Pre-commit hook (`.husky/pre-commit`):**

```bash
npx lint-staged
```

**lint-staged config (in `package.json`):**

```json
{
	"lint-staged": {
		"**/*.{js,jsx,ts,tsx}": ["npx prettier --write", "npx eslint --fix"]
	}
}
```

**Commit-msg hook (`.husky/commit-msg`):**

```bash
npx --no -- commitlint --edit ""
```

**What runs on commit:**

1. Prettier formats staged JS/TS files
2. ESLint fixes staged JS/TS files
3. Commitlint validates commit message format

## Type Checking

**TypeScript Configuration:**

- Strict mode: **disabled** (`strict: false`)
- No type checking in CI/pre-commit

**Implication:**

- Many components have implicit `any` types
- Props often lack type annotations
- Example from `components/VehicleCard.tsx`:

```typescript
const VehicleCard = ({ vehicle }) => {  // vehicle is implicitly any
```

## Code Quality Tools

**ESLint:**

- Config: `eslint.config.mjs`
- Plugins: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react`
- Run: `npm run lint` (with `--fix`)

**Prettier:**

- Config: `.prettierrc`
- Run: `npm run prettier`

## Recommended Test Setup

**If implementing tests, use:**

**Framework:** Vitest (recommended for Vite/Next.js projects)

**Installation:**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Config (`vitest.config.ts`):**

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: ['./test/setup.ts'],
	},
});
```

## Testing Priorities

**High Priority (untested critical paths):**

1. **API Routes** - `pages/api/vehicles/index.ts`, `pages/api/fueling/index.ts`
   - No validation on request body
   - No error handling for Prisma failures
   - Risk: Data corruption, crashes on invalid input

2. **Form Submissions** - `components/fueling/NewFuelingForm.tsx`
   - TODO comment: "Add validation"
   - Currently logs values but doesn't submit
   - Risk: Invalid data reaching database

3. **Authentication Flow** - `pages/api/auth/[...nextauth].ts`
   - Session callback adds user ID to session
   - Risk: Auth bypass, session hijacking

**Medium Priority:**

4. **Data Fetching** - Query functions in pages
   - No error response parsing
   - `result.json()` called without checking response status
   - Risk: Silent failures on API errors

5. **Component Rendering** - Conditional rendering based on session state
   - `pages/index.tsx`, `pages/vehicles/new.tsx`

**Low Priority:**

6. **UI Components** - Pure presentational components
   - `components/Loading.tsx`, `components/Card.tsx`
   - Low risk, simple logic

## Mocking Recommendations

**For API testing:**

```typescript
// Mock Prisma
vi.mock('../../../lib/prisma', () => ({
	prisma: {
		vehicle: {
			findMany: vi.fn(),
			create: vi.fn(),
		},
	},
}));
```

**For component testing:**

```typescript
// Mock next-auth
vi.mock('next-auth/react', () => ({
	useSession: vi.fn(() => ({
		data: { user: { id: 1, name: 'Test User' } },
		status: 'authenticated',
	})),
	signIn: vi.fn(),
	signOut: vi.fn(),
}));

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
	useQuery: vi.fn(() => ({
		data: mockData,
		isPending: false,
		isError: false,
	})),
	useMutation: vi.fn(() => ({
		mutate: vi.fn(),
		isPending: false,
	})),
}));
```

## Coverage

**Requirements:** None enforced

**Target Recommendation:**

- API routes: 80%+
- Business logic: 70%+
- Components: 50%+

## Test Types Needed

**Unit Tests:**

- Utility functions (none exist currently)
- Type validation functions (to be created)
- Data transformations

**Integration Tests:**

- API route handlers with mocked Prisma
- Form submissions with mocked mutations

**E2E Tests:**

- Framework: Playwright or Cypress (not installed)
- Critical flows: Sign in, Add vehicle, Add fueling

## Gaps and Risks

**Critical Gaps:**

1. **No input validation** - API routes accept raw body data
   - Files: `pages/api/vehicles/index.ts`, `pages/api/fueling/index.ts`
   - Risk: SQL injection via Prisma, data corruption

2. **No error boundaries** - Unhandled errors crash the app
   - Files: All page components
   - Risk: White screen of death

3. **No response status checking** in fetch calls
   - Files: `pages/vehicles/index.tsx`, `components/vehicles/VehicleCard.tsx`
   - Pattern: `const result = await fetch(...); return result.json();`
   - Risk: Silent failures, undefined data

4. **Type safety disabled** - `strict: false` allows implicit any
   - Files: `tsconfig.json`
   - Risk: Runtime type errors

---

_Testing analysis: 2026-01-30_
