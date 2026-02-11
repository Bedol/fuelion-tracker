# Coding Conventions

**Analysis Date:** 2026-01-30

## Naming Patterns

**Files:**

- Components: PascalCase (`VehicleCard.tsx`, `NewFuelingForm.tsx`, `FetchDataErrorAlert.tsx`)
- Pages: kebab-case for dynamic routes (`[id].tsx`), lowercase otherwise (`index.tsx`, `new.tsx`)
- Hooks: camelCase (`getCountries.ts`, `getStates.ts`)
- Type files: snake_case (`vehicle_types.ts`)
- API routes: lowercase (`index.ts`, `[...nextauth].ts`)

**Functions:**

- Event handlers: camelCase with `handle` prefix (`handleSubmit`, `handleCardClick`)
- Data fetchers: camelCase with `get` prefix (`getCountries`, `getStates`)
- Mutations: descriptive camelCase (`vehicleMutation`, `refuelMutation`)

**Variables:**

- camelCase for local variables (`sliderValue`, `showTooltip`)
- snake_case for database fields/form values (`brand_name`, `fuel_type_id`)

**Types:**

- PascalCase for type names (`VehicleData`, `NewFuelingFormProps`, `SelectOptionType`)
- Suffix with `Props` for component prop types (`LayoutProps`, `NavItemProps`, `NewFuelingFormProps`)
- Enums: PascalCase names, PascalCase members (`FuelType.Gasoline`, `VehicleType.Passenger`)

**Components:**

- PascalCase function names (`VehicleCard`, `Layout`, `Header`)
- Nested components in same file: also PascalCase (`StatCard`, `QuickActionCard`, `NavItem`)

## Code Style

**Formatting:**

- Tool: Prettier 3.x
- Config: `.prettierrc`
- Key settings:
  - Tabs for indentation (width: 2)
  - Semicolons required
  - Single quotes (including JSX)
  - Trailing commas: ES5 style
  - Print width: 80 characters

**Linting:**

- Tool: ESLint 9.x with flat config
- Config: `eslint.config.mjs`
- Key rules:
  - TypeScript ESLint recommended rules
  - React plugin recommended rules
  - Browser and Node globals enabled
- Ignores: `node_modules/**`, `.next/*`

**TypeScript:**

- Strict mode: **disabled** (`strict: false` in `tsconfig.json`)
- Target: ES5
- Module resolution: Node
- JSX: preserve

## Import Organization

**Order:**

1. External libraries (React, Next.js, Chakra UI, TanStack Query)
2. Auth imports (next-auth)
3. Internal components (relative paths `../`, `../../`)
4. Hooks and utilities
5. Types
6. Data/constants

**Example from `pages/vehicles/index.tsx`:**

```typescript
import { Vehicle } from '@prisma/client';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import FetchDataErrorAlert from '../../components/errors/FetchDataErrorAlert';
import Loading from '../../components/Loading';
import VehicleCard from '../../components/VehicleCard';
```

**Path Aliases:**

- None configured - uses relative paths (`../`, `../../`)

## Component Patterns

**Functional Components with Arrow Functions:**

```typescript
const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<Box minH="100vh" bg="gray.50">
			{children}
		</Box>
	);
};

export default Layout;
```

**Component Props Type Pattern:**

```typescript
type LayoutProps = {
	children: ReactNode;
};

// Or inline for simpler components:
interface NavItemProps {
	icon: any;
	children: React.ReactNode;
	href: string;
	isActive?: boolean;
}
```

**Use `type` for data structures, `interface` for component props** (both patterns exist, but `type` is more common)

**Default Exports:**

- All components use default exports
- Named exports for type exports and constants

## Error Handling

**Data Fetching Pattern:**
Use TanStack Query states with dedicated error components:

```typescript
const { data, isPending, isError } = useQuery({
	queryKey: ['vehicles'],
	queryFn: async () => {
		const result = await fetch('/api/vehicles');
		return result.json();
	}
});

if (isPending) return <Loading />;
if (isError) return <FetchDataErrorAlert errorMessage='An error occurred while fetching vehicles.' />;
```

**Mutation Error Handling:**
Use toast notifications via Chakra UI:

```typescript
const refuelMutation = useMutation({
	mutationFn: (values) =>
		fetch('/api/fueling', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		}),
	onSuccess: () => {
		toast({
			title: 'Fueling added.',
			position: 'top-right',
			status: 'success',
		});
	},
	onError: () => {
		toast({
			title: 'An error occurred.',
			position: 'top-right',
			status: 'error',
		});
	},
});
```

**API Route Error Handling:**
Return 405 for unsupported methods:

```typescript
switch (method) {
	case 'GET':
		// handle GET
		break;
	default:
		res.setHeader('Allow', ['GET', 'POST']);
		res.status(405).end(`Method ${method} Not Allowed`);
}
```

## Logging

**Framework:** Native `console`

**Patterns:**

- `console.log()` for debugging form values
- No structured logging framework
- No log levels differentiation

**Example:**

```typescript
console.log(values, 'form values');
console.log('Card clicked');
```

## Comments

**When to Comment:**

- TODO comments for incomplete features: `// TODO: move this type to global types`
- Inline explanations for non-obvious logic
- Section dividers in JSX: `{/* Header */}`, `{/* Main Navigation */}`

**JSDoc/TSDoc:**

- Not used consistently
- Type annotations rely on TypeScript inference

**TODO Format:**

```typescript
// TODO: move this type to global types
// TODO: Convert whole form to new component
// TODO: use formik hook instead Formik component
// TODO: Add validation
```

## Function Design

**Size:** Functions tend to be short; large components extract nested components

**Parameters:**

- Destructure props in function signature: `({ children, title })`
- Use Formik `field` and `form` objects for form fields

**Return Values:**

- Components return JSX
- Hooks return objects with named properties
- Early returns for loading/error states

## Module Design

**Exports:**

- Default export for components
- Named exports for types, constants, enums
- Mixed exports in `types/vehicle_types.ts`:

```typescript
export type VehicleData = { ... };
export const fuelTypes: SelectOptionType[] = [ ... ];
export enum FuelType { ... }
```

**Barrel Files:**

- Not used - direct imports to specific files

## Form Handling

**Formik Patterns:**

**Pattern 1 - Component Approach (forms with complex fields):**

```typescript
<Formik initialValues={...} onSubmit={handleSubmit}>
	{() => (
		<Form>
			<Field name='quantity'>
				{({ field, form }) => (
					<NumberInput
						onChange={(val) => form.setFieldValue(field.name, parseFloat(val))}
					/>
				)}
			</Field>
		</Form>
	)}
</Formik>
```

**Pattern 2 - Hook Approach (simpler forms):**

```typescript
const formik = useFormik({
	initialValues: initialValues,
	onSubmit: async (values) => {
		await mutation.mutate(values);
	},
});

<form onSubmit={formik.handleSubmit}>
	<Input
		name='brand'
		onChange={formik.handleChange}
		value={formik.values.brand}
	/>
</form>
```

## API Route Patterns

**Switch Statement for Methods:**

```typescript
export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse<...>
) {
	const { method, body } = req;

	switch (method) {
		case 'POST':
			{
				const result = await prisma.model.create({ data: body });
				res.json(result);
			}
			break;
		case 'GET':
			{
				const items = await prisma.model.findMany();
				res.json(items);
			}
			break;
		default:
			res.setHeader('Allow', ['POST', 'GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
```

## Styling Approach

**Mixed Chakra UI and Tailwind:**

- Chakra UI: Complex components (`Layout.tsx`, `Header.tsx`, `Sidebar.tsx`)
- Tailwind CSS: Simple layouts and pages (`pages/vehicles/index.tsx`, `pages/vehicles/new.tsx`)

**Chakra UI Props:**

```typescript
<Box minH="100vh" bg="gray.50" p={6}>
```

**Tailwind Classes:**

```typescript
<button className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
```

## Git Conventions

**Commit Format:** Conventional Commits (enforced by commitlint)

**Allowed Types:**
`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `translation`, `security`, `changeset`

**Rules:**

- Subject: lowercase, no period, imperative mood
- Scope: lowercase
- Header max length: 100 characters
- Body max line length: 100 characters

**Examples:**

```bash
feat(vehicles): add vehicle statistics page
fix(auth): resolve session expiration issue
```

---

_Convention analysis: 2026-01-30_
