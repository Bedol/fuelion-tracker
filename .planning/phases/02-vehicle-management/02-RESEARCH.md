# Phase 2: Vehicle Management - Research

**Researched:** 2026-01-31
**Domain:** Next.js Pages Router CRUD with Prisma ORM, Formik, and TanStack React Query
**Confidence:** HIGH

## Summary

This phase implements vehicle CRUD operations using the existing stack: Next.js 16.1.4 Pages Router, Prisma 6.19.2, TanStack React Query 5.90.19, and Formik 2.4.9. The codebase already has established patterns for these operations (see `/pages/api/vehicles/` and `components/vehicles/VehicleForm.tsx`).

The standard approach follows a clear separation: API routes handle Prisma database operations using switch statements for HTTP methods, React Query manages server state and cache invalidation, and Formik handles form state and submission. The existing Vehicle model in Prisma schema has all required fields, but uses foreign key IDs (`fuel_type_id`, `transmission_id`) instead of direct enum values, requiring reference table lookups.

Key architectural decisions already in place: Prisma singleton client in `lib/prisma.ts`, switch-based route handlers, mutation-driven form submissions with `mutate()`, and query invalidation for cache updates. The phase will extend these patterns with autocomplete for brand/model, soft delete implementation (as decided in CONTEXT.md), and enhanced validation.

**Primary recommendation:** Follow existing patterns in `/pages/api/vehicles/` and `components/vehicles/VehicleForm.tsx` - extend rather than replace. Add soft delete via Prisma middleware (not schema field, to avoid breaking existing routes). Use Chakra UI Autocomplete for brand/model with debounced API queries.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library              | Version | Purpose                 | Why Standard                                              |
| -------------------- | ------- | ----------------------- | --------------------------------------------------------- |
| Prisma Client        | 6.19.2  | ORM for PostgreSQL      | Type-safe database access, migrations, generated types    |
| TanStack React Query | 5.90.19 | Server state management | Automatic caching, invalidation, loading/error states     |
| Formik               | 2.4.9   | Form state management   | Handles values, validation, submission lifecycle          |
| Next.js API Routes   | 16.1.4  | Backend endpoints       | Serverless functions, built-in routing, type-safe req/res |

### Supporting

| Library         | Version        | Purpose               | When to Use                                        |
| --------------- | -------------- | --------------------- | -------------------------------------------------- |
| Chakra UI       | 3.31.0         | UI components         | Already in use - Input, Button, FormControl        |
| NextAuth        | 4.24.13        | Authentication        | Session management for user-owned vehicles         |
| React Hook Form | N/A (not used) | Alternative to Formik | NOT RECOMMENDED - project uses Formik consistently |

### Alternatives Considered

| Instead of        | Could Use              | Tradeoff                                                                         |
| ----------------- | ---------------------- | -------------------------------------------------------------------------------- |
| Formik            | React Hook Form        | Better performance, less re-renders, but requires rewriting existing VehicleForm |
| Prisma Middleware | Schema field `deleted` | Simpler queries, but breaks existing API routes expecting hard delete            |
| Manual fetch      | SWR                    | Similar to React Query but less powerful mutation API                            |

**Installation:**

```bash
# All dependencies already installed in package.json
# For autocomplete, Chakra UI 3.x Autocomplete may need clarification
# Currently not clear if built-in or requires separate package
```

## Architecture Patterns

### Recommended Project Structure

```
pages/
├── api/
│   └── vehicles/
│       ├── index.ts          # POST (create), GET (list all)
│       ├── [id].ts           # GET (one), PUT (update), DELETE
│       └── autocomplete.ts   # GET (brand/model suggestions)
├── vehicles/
│   ├── index.tsx             # Vehicle list page
│   ├── new.tsx               # Create vehicle page
│   └── [id]/
│       ├── edit.tsx          # Edit vehicle page
│       └── index.tsx         # Vehicle detail page
components/
└── vehicles/
    ├── VehicleForm.tsx       # Reusable form component
    ├── VehicleCard.tsx       # Card for list view
    └── VehicleDeleteDialog.tsx  # Confirmation modal
```

### Pattern 1: API Route with Switch Statement (Existing Pattern)

**What:** Single handler function with switch on `req.method`
**When to use:** For RESTful CRUD endpoints in Pages Router
**Example:**

```typescript
// Source: Existing codebase at pages/api/vehicles/[id].ts
import { Vehicle } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

const handle = async (req: NextApiRequest, res: NextApiResponse<Vehicle>) => {
	const { id } = req.query;
	const { method, body } = req;

	switch (method) {
		case 'GET':
			{
				const result = await prisma.vehicle.findUnique({
					where: { id: parseInt(id as string) },
				});
				res.json(result);
			}
			break;
		case 'PUT':
			{
				const result = await prisma.vehicle.update({
					where: { id: parseInt(id as string) },
					data: body,
				});
				res.json(result);
			}
			break;
		case 'DELETE':
			{
				const result = await prisma.vehicle.delete({
					where: { id: parseInt(id as string) },
				});
				res.json(result);
			}
			break;
		default:
			res.setHeader('Allow', ['PUT', 'DELETE', 'GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};

export default handle;
```

### Pattern 2: React Query Mutation with Formik (Existing Pattern)

**What:** Formik form submits via React Query mutation, invalidates cache on success
**When to use:** For all form submissions that modify server state
**Example:**

```typescript
// Source: Existing codebase at pages/vehicles/new.tsx, edit.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';

const VehicleForm = ({ initialValues, mutation }) => {
	const formik = useFormik({
		initialValues: initialValues,
		onSubmit: async (values) => {
			await mutation.mutate(values);
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			{/* Form fields */}
			<Button
				isLoading={mutation.isLoading}
				loadingText='Submitting'
				type='submit'
			>
				Submit
			</Button>
		</form>
	);
};

// In parent component
const queryClient = useQueryClient();
const vehicleMutation = useMutation({
	mutationFn: async (values) => {
		const response = await fetch('/api/vehicles', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		});
		return response.json();
	},
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ['vehicles'] });
		router.push('/vehicles');
	},
});
```

### Pattern 3: Soft Delete with Prisma Middleware

**What:** Intercept `delete` operations and convert to `update` with `deleted: true`
**When to use:** When cascade behavior must preserve data (as decided in CONTEXT.md)
**Example:**

```typescript
// Source: Prisma official docs - Soft Delete Middleware
// https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

prisma.$use(async (params, next) => {
	if (params.model === 'Vehicle') {
		// Convert delete to update
		if (params.action === 'delete') {
			params.action = 'update';
			params.args['data'] = { deleted: true };
		}
		if (params.action === 'deleteMany') {
			params.action = 'updateMany';
			if (params.args.data != undefined) {
				params.args.data['deleted'] = true;
			} else {
				params.args['data'] = { deleted: true };
			}
		}
		// Filter out soft-deleted records
		if (params.action === 'findUnique' || params.action === 'findFirst') {
			params.action = 'findFirst';
			params.args.where['deleted'] = false;
		}
		if (params.action === 'findMany') {
			if (params.args.where) {
				if (params.args.where.deleted == undefined) {
					params.args.where['deleted'] = false;
				}
			} else {
				params.args['where'] = { deleted: false };
			}
		}
	}
	return next(params);
});
```

### Pattern 4: Autocomplete with Debounced API Queries

**What:** Input triggers API query after debounce delay, suggests existing values
**When to use:** For brand/model fields to maintain consistency (as decided in CONTEXT.md)
**Example:**

```typescript
// Source: Community pattern - React autocomplete with debouncing
// Not Chakra UI specific - may need adaptation for Chakra UI 3.x

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const BrandAutocomplete = ({ value, onChange }) => {
	const [inputValue, setInputValue] = useState(value);
	const [debouncedValue, setDebouncedValue] = useState(value);

	// Debounce input
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(inputValue), 300);
		return () => clearTimeout(timer);
	}, [inputValue]);

	// Query suggestions
	const { data: suggestions } = useQuery({
		queryKey: ['brands', debouncedValue],
		queryFn: () => fetch(`/api/vehicles/autocomplete?type=brand&q=${debouncedValue}`)
			.then(res => res.json()),
		enabled: debouncedValue.length >= 2,
	});

	return (
		<>
			<Input
				value={inputValue}
				onChange={(e) => {
					setInputValue(e.target.value);
					onChange(e.target.value);
				}}
			/>
			{suggestions?.length > 0 && (
				<List>
					{suggestions.map((brand) => (
						<ListItem
							key={brand}
							onClick={() => {
								setInputValue(brand);
								onChange(brand);
							}}
						>
							{brand}
						</ListItem>
					))}
				</List>
			)}
		</>
	);
};
```

### Anti-Patterns to Avoid

- **Fetching API routes from `getServerSideProps`:** Call Prisma directly in SSR, not your own API routes (circular dependency, unnecessary HTTP overhead)
- **Multiple Prisma Client instances:** Use singleton pattern in `lib/prisma.ts` (already implemented) to avoid resource exhaustion in development hot-reload
- **Client-side route access without auth check:** All `/api/vehicles/*` endpoints must verify session with NextAuth `getServerSession()`
- **Hard delete with cascade:** Breaks data integrity for future analytics - use soft delete pattern
- **Form validation in API route only:** Validate in Formik (client) AND API route (server) - never trust client input

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem               | Don't Build                            | Use Instead                                                             | Why                                                              |
| --------------------- | -------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Autocomplete dropdown | Custom dropdown with state management  | Chakra UI Autocomplete (if available in v3) or Material UI Autocomplete | Handles keyboard nav, ARIA, focus management, portal positioning |
| Form validation       | Manual error state tracking            | Formik validation + Yup schema                                          | Handles touched fields, error messages, async validation         |
| Optimistic updates    | Manual cache manipulation              | React Query `onMutate` with rollback                                    | Race conditions, error recovery, revalidation complexity         |
| Debouncing            | `setTimeout` with manual cleanup       | `useDebouncedValue` hook or `lodash.debounce`                           | Memory leaks, cleanup issues, ref handling                       |
| Soft delete filtering | Manual `deleted: false` in every query | Prisma middleware                                                       | Easy to forget, inconsistent filtering, maintenance burden       |

**Key insight:** CRUD operations have established patterns in this codebase. Reuse existing `VehicleForm.tsx`, API route structure in `/api/vehicles/`, and React Query patterns. Extend rather than rewrite.

## Common Pitfalls

### Pitfall 1: Multiple Prisma Client Instances in Development

**What goes wrong:** Next.js hot-reload creates new Prisma Client on every change, exhausting database connections
**Why it happens:** Next.js re-imports modules during development, `new PrismaClient()` runs repeatedly
**How to avoid:** Use singleton pattern with `globalThis` (already implemented in `lib/prisma.ts`)
**Warning signs:** "Too many connections" errors, slow queries in development, works in production but not dev

### Pitfall 2: Query Cache Not Invalidated After Mutation

**What goes wrong:** User creates/updates vehicle but list doesn't update, shows stale data
**Why it happens:** Forgot `queryClient.invalidateQueries()` in mutation's `onSuccess`
**How to avoid:** Always invalidate affected query keys in `onSuccess` callback
**Warning signs:** Data updates only after page refresh, inconsistent UI state

### Pitfall 3: Missing Error Handling in API Routes

**What goes wrong:** Prisma errors (unique constraint, foreign key violation) return 500 with stack trace to client
**Why it happens:** No try-catch in API route handlers, Prisma errors bubble up
**How to avoid:** Wrap Prisma calls in try-catch, return structured error responses
**Warning signs:** Client sees database error messages, security issue (exposes schema)

### Pitfall 4: parseInt Without Radix for ID Parameters

**What goes wrong:** ID like "08" parsed as octal (8) instead of decimal, query fails silently
**Why it happens:** `parseInt(id as string)` without second parameter uses default base inference
**How to avoid:** Always use `parseInt(id as string, 10)` for decimal parsing
**Warning signs:** Routes work for IDs 1-7 but fail for 08, 09 (octal literals)

### Pitfall 5: Formik Values Not Reset After Successful Submit

**What goes wrong:** After creating vehicle, form still has old values if user goes back
**Why it happens:** Formik doesn't auto-reset, `initialValues` prop isn't updated
**How to avoid:** Call `formik.resetForm()` in mutation's `onSuccess` or use `enableReinitialize` prop
**Warning signs:** Form repopulates with previous values, confusing UX

### Pitfall 6: Soft Delete Field Not in Schema

**What goes wrong:** Middleware tries to set `deleted: true` but field doesn't exist, throws Prisma error
**Why it happens:** Middleware implemented but forgot to add `deleted Boolean @default(false)` to Prisma schema
**How to avoid:** Add schema field, run `prisma migrate dev` or `prisma db push` before implementing middleware
**Warning signs:** Error "Unknown field 'deleted' for model 'Vehicle'"

### Pitfall 7: Foreign Key Constraint Violations on Delete

**What goes wrong:** Delete vehicle fails with "Foreign key constraint failed" for related fuelings
**Why it happens:** Prisma schema has `onDelete: Cascade` but soft delete converts to update, cascade doesn't trigger
**How to avoid:** Soft delete middleware must also soft-delete related records (fuelings, expenses)
**Warning signs:** Hard delete works but soft delete fails with FK error

## Code Examples

Verified patterns from official sources:

### Basic CRUD API Route (Next.js Pages Router)

```typescript
// Source: Next.js Official Docs - API Routes
// https://nextjs.org/docs/pages/building-your-application/routing/api-routes

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Auth check - CRITICAL for user-owned resources
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	switch (req.method) {
		case 'GET':
			return handleGet(req, res, session);
		case 'POST':
			return handlePost(req, res, session);
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			return res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}

async function handleGet(req, res, session) {
	try {
		const vehicles = await prisma.vehicle.findMany({
			where: { user_id: session.user.id },
			orderBy: { created_at: 'desc' },
		});
		return res.status(200).json(vehicles);
	} catch (error) {
		console.error('GET /api/vehicles error:', error);
		return res.status(500).json({ error: 'Failed to fetch vehicles' });
	}
}

async function handlePost(req, res, session) {
	try {
		const vehicle = await prisma.vehicle.create({
			data: {
				...req.body,
				user_id: session.user.id,
			},
		});
		return res.status(201).json(vehicle);
	} catch (error) {
		console.error('POST /api/vehicles error:', error);
		return res.status(500).json({ error: 'Failed to create vehicle' });
	}
}
```

### React Query Mutation with Cache Invalidation

```typescript
// Source: TanStack Query Official Docs - Mutations
// https://tanstack.com/query/v5/docs/react/guides/mutations

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toaster } from '@/components/ui/toaster';

const useCreateVehicle = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (values) => {
			const response = await fetch('/api/vehicles', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values),
			});
			if (!response.ok) {
				throw new Error('Failed to create vehicle');
			}
			return response.json();
		},
		onSuccess: (data) => {
			// Invalidate and refetch vehicle list
			queryClient.invalidateQueries({ queryKey: ['vehicles'] });
			toaster.create({
				title: 'Vehicle created',
				description: `${data.brand_name} ${data.model_name} added successfully`,
				type: 'success',
			});
		},
		onError: (error) => {
			toaster.create({
				title: 'Error',
				description: error.message || 'Failed to create vehicle',
				type: 'error',
			});
		},
	});
};
```

### Formik with Validation Schema

```typescript
// Source: Formik Official Docs + Yup
// https://formik.org/docs/guides/validation

import { useFormik } from 'formik';
import * as Yup from 'yup';

const VehicleSchema = Yup.object().shape({
	brand_name: Yup.string()
		.min(2, 'Too short')
		.max(50, 'Too long')
		.required('Required'),
	model_name: Yup.string()
		.min(2, 'Too short')
		.max(50, 'Too long')
		.required('Required'),
	production_year: Yup.number()
		.min(1900, 'Too old')
		.max(new Date().getFullYear() + 1, 'Invalid year')
		.required('Required'),
	fuel_type_id: Yup.number()
		.required('Required'),
	engine_capacity: Yup.number()
		.positive('Must be positive')
		.optional(),
	engine_power: Yup.number()
		.positive('Must be positive')
		.optional(),
});

const formik = useFormik({
	initialValues: {
		brand_name: '',
		model_name: '',
		production_year: new Date().getFullYear(),
		fuel_type_id: 1,
		engine_capacity: '',
		engine_power: '',
	},
	validationSchema: VehicleSchema,
	onSubmit: (values) => {
		mutation.mutate(values);
	},
});

// In JSX - show errors
{formik.touched.brand_name && formik.errors.brand_name && (
	<Text color="red.500">{formik.errors.brand_name}</Text>
)}
```

### Prisma Soft Delete Schema Update

```prisma
// Source: Prisma Schema Reference
// https://www.prisma.io/docs/orm/reference/prisma-schema-reference

model Vehicle {
  id              Int       @id @default(autoincrement())
  user_id         Int
  user            User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  brand_name      String    @db.VarChar(255)
  model_name      String    @db.VarChar(255)
  // ... other fields
  deleted         Boolean   @default(false)  // Add this field
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt
  fuelings        Fueling[]
  expenses        Expense[]
}
```

## State of the Art

| Old Approach                | Current Approach                    | When Changed       | Impact                                       |
| --------------------------- | ----------------------------------- | ------------------ | -------------------------------------------- |
| Create React App            | Next.js framework                   | 2021-2022          | SSR, API routes, file-based routing built-in |
| REST with Redux             | React Query + API routes            | 2020-2021          | Simpler state management, automatic caching  |
| Class components with state | Functional components + hooks       | 2019               | Less boilerplate, easier testing             |
| Prisma 1                    | Prisma 2+ (now at 6.x)              | 2020               | Better DX, migrations, type generation       |
| getInitialProps             | getServerSideProps / getStaticProps | 2020 (Next.js 9.3) | Better performance, clearer data fetching    |
| Manual form state           | Formik / React Hook Form            | 2018-2019          | Less boilerplate, validation built-in        |

**Deprecated/outdated:**

- **Create React App (CRA):** Deprecated January 2025, use Next.js or Vite for new projects
- **Pages Router over App Router:** Next.js 13+ recommends App Router, but Pages Router still supported (this project uses Pages Router intentionally)
- **Prisma `@default(now())` without timezone:** Should use `@default(dbgenerated("NOW()"))` or explicit timezone handling
- **React Query v3-4:** Version 5 (TanStack Query) has breaking changes, different import paths

## Open Questions

Things that couldn't be fully resolved:

1. **Chakra UI 3.x Autocomplete API**
   - What we know: Chakra UI 3.x is installed (3.31.0), MUI has robust Autocomplete component
   - What's unclear: Does Chakra UI 3.x include native Autocomplete, or do we need separate package/custom implementation?
   - Recommendation: Check Chakra UI 3.x docs for Autocomplete availability. If not available, build simple dropdown with Chakra Input + Menu, or consider lightweight library like `react-select` or `downshift`

2. **Soft Delete Cascade Behavior**
   - What we know: Prisma schema has `onDelete: Cascade` on relations, soft delete middleware converts delete to update
   - What's unclear: Does cascade still work when delete is converted to update? Need to test or manually cascade soft delete
   - Recommendation: Implement middleware to cascade soft delete to Fueling and Expense models when Vehicle is soft-deleted, or accept that related records remain (less risky for v1)

3. **Brand/Model Reference Tables**
   - What we know: Vehicle model uses `brand_name` and `model_name` as strings (not foreign keys)
   - What's unclear: Should autocomplete query Vehicle table directly, or create separate Brand/Model reference tables?
   - Recommendation: For Phase 2, query distinct brand_name/model_name from Vehicle table. Consider reference tables in future phase if needed for internationalization or validation

4. **Form Field Mapping to Prisma Schema**
   - What we know: CONTEXT.md says "Brand, Model, Year, Registration, Fuel Type" but schema has `fuel_type_id` (integer FK)
   - What's unclear: Are there reference tables for fuel types, or should we store string enums?
   - Recommendation: Check if `fuel_type_id` references a separate table. If yes, create API endpoint to fetch fuel type options for dropdown. If no table exists, create it or switch to enum.

## Sources

### Primary (HIGH confidence)

- Prisma Official Docs - CRUD operations: https://www.prisma.io/docs/orm/prisma-client/queries/crud
- Prisma Soft Delete Middleware: https://www.prisma.io/docs/orm/prisma-client/client-extensions/middleware/soft-delete-middleware
- TanStack Query Official Docs - Mutations: https://tanstack.com/query/v5/docs/react/guides/mutations
- Next.js API Routes Documentation: https://nextjs.org/docs/pages/building-your-application/routing/api-routes
- Formik Official Docs: https://formik.org/docs/guides/validation
- Existing codebase patterns: `/pages/api/vehicles/*.ts`, `/components/vehicles/VehicleForm.tsx`

### Secondary (MEDIUM confidence)

- Next.js + Prisma Best Practices 2026: https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help
- React Query and Forms blog post: https://tkdodo.eu/blog/react-query-and-forms
- Next.js API Routes Best Practices 2026: https://makerkit.dev/blog/tutorials/nextjs-api-best-practices

### Tertiary (LOW confidence)

- Chakra UI 3.x Autocomplete availability: Needs verification in official Chakra UI docs
- Soft delete cascade behavior with middleware: Needs testing in actual implementation
- Material UI Autocomplete as reference: https://mui.com/material-ui/react-autocomplete/ (different library, but patterns applicable)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All libraries already in package.json, existing patterns in codebase
- Architecture: HIGH - Existing API routes and components follow clear patterns
- Pitfalls: HIGH - Based on official Prisma/Next.js docs and common issues in GitHub issues

**Research date:** 2026-01-31
**Valid until:** 2026-03-31 (60 days - stable technology stack, unlikely to change)
