# AGENTS.md - Coding Agent Guidelines

Guidelines for AI coding agents working in the Fuelion codebase.

## Project Overview

- **Framework:** Next.js 16.1.4 (Pages Router), TypeScript
- **UI:** Chakra UI 3.x + Tailwind CSS 4.x
- **Data:** TanStack React Query 5.x, Formik 2.x, PostgreSQL + Prisma 7.x
- **Auth:** NextAuth 4.x (Google OAuth, JWT strategy)
- **Package Manager:** npm

## Build/Lint/Test Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint with --fix
npm run prettier         # Format all files with Prettier

npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations (development)
npx prisma db push       # Push schema changes without migration
```

**Testing:** No testing framework is currently configured.

## Code Style Guidelines

### Formatting (Prettier - `.prettierrc`)

- Tabs for indentation (width: 2), semicolons required
- Single quotes (including JSX), trailing commas in ES5 style, print width: 80

### Import Order

1. External libraries (React, Next.js, Chakra UI, etc.)
2. Internal components (relative paths)
3. Types and interfaces
4. Styles (last)

```typescript
import { Box, Button } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import type { VehicleData } from '../types/vehicle_types';
```

### Naming Conventions

| Element             | Convention | Example                                 |
| ------------------- | ---------- | --------------------------------------- |
| Components          | PascalCase | `VehicleCard.tsx`, `NewFuelingForm.tsx` |
| Component folders   | lowercase  | `components/vehicles/`                  |
| Pages/routes        | kebab-case | `pages/vehicles/[id]/statistics.tsx`    |
| Hooks               | camelCase  | `getCountries.ts`, `useVehicleData.ts`  |
| Type files          | snake_case | `vehicle_types.ts`                      |
| Type names          | PascalCase | `VehicleData`, `FuelingFormValues`      |
| Enums               | PascalCase | `FuelType`, `VehicleType`               |
| Variables/functions | camelCase  | `handleSubmit`, `vehicleData`           |

### Component Patterns

Use functional components with arrow functions and default exports:

```typescript
type ComponentProps = { children: ReactNode; title: string };

const MyComponent: React.FC<ComponentProps> = ({ children, title }) => {
  return <Box><Heading>{title}</Heading>{children}</Box>;
};

export default MyComponent;
```

### Type Definitions

- Use `type` keyword for component props and data structures
- Import Prisma types for database models; define custom types in `types/` folder

```typescript
export type VehicleData = { id: number; brand: string; model: string };

export enum FuelType {
	Gasoline = 'gasoline',
	Diesel = 'diesel',
	Electric = 'electric',
}
```

### Error Handling

Use TanStack Query states with dedicated error components:

```typescript
const { data, isPending, isError } = useQuery({ queryKey: ['vehicles'], queryFn: fetchVehicles });

if (isPending) return <Loading />;
if (isError) return <FetchDataErrorAlert errorMessage='Failed to load vehicles.' />;
```

For mutations, use toast notifications via `toaster.create()` with `type: 'success'` or `type: 'error'`.

### API Route Patterns

Use switch statements for HTTP method handling:

```typescript
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case 'GET':
			return handleGet(req, res);
		case 'POST':
			return handlePost(req, res);
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
```

### Form Handling

Use Formik with TanStack Query mutations:

```typescript
const formik = useFormik({
	initialValues: { brand: '', model: '' },
	onSubmit: (values) => mutation.mutate(values),
});
```

## Git Commit Guidelines

Commits validated by commitlint with conventional commits format.

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `translation`, `security`, `changeset`

**Format:** `type(scope): description` - Subject must be lowercase, imperative mood

```bash
feat(vehicles): add vehicle statistics page
fix(auth): resolve session expiration issue
```

## Directory Structure

```
components/       # React components (PascalCase files)
hooks/            # Custom hooks and data fetchers
lib/              # Shared utilities (Prisma client)
pages/            # Next.js pages and API routes (api/ subdirectory)
prisma/           # Database schema and migrations
styles/           # Global styles
types/            # TypeScript type definitions
```

## Pre-commit Hooks (Husky)

1. **lint-staged:** Prettier formatting + ESLint fix on staged files
2. **commitlint:** Validates commit message format

## Important Notes

- TypeScript strict mode is **disabled** (`strict: false` in tsconfig.json)
- React strict mode is **enabled** in next.config.js
- The app uses both Chakra UI and Tailwind CSS for styling
- Prisma client is initialized as a singleton in `lib/prisma.ts`
- Auth requires `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET` env vars
