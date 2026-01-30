# Architecture Research: Fuelion Expansion

**Domain:** Vehicle expense tracking application  
**Researched:** 2026-01-30  
**Overall confidence:** HIGH (based on Prisma official docs, Vercel official docs, and existing codebase analysis)

## Summary

For the Fuelion expansion to support multiple expense types, vehicle photos, and statistics, I recommend:

1. **Data Model:** Keep the existing separate-tables approach (Fueling, Expense) but enhance the Expense model with an enum-based type discriminator and type-specific JSON fields for flexibility. This preserves existing schema while enabling extensibility.

2. **API Structure:** Create unified expense endpoints with type filtering, keeping the existing fueling endpoint for backward compatibility. Use RESTful patterns already established in the codebase.

3. **Statistics:** Use Prisma's `groupBy()` and `aggregate()` for monthly summaries. Pre-compute heavy aggregates only if performance degrades (unlikely at 3-5 vehicles per user scale).

4. **Image Storage:** Use Vercel Blob for simplicity and native integration. It's cost-effective, globally distributed, and handles the common 1-5 photos per vehicle use case perfectly.

---

## Data Model

### Current State Analysis

The existing schema has:

- `Fueling` model: Detailed fuel tracking (liters, price, mileage, location)
- `Expense` model: Generic with `type_id` integer (unclear mapping)
- Both link to `Vehicle` via foreign key

**Key insight:** The existing `Expense` model is underutilized. It has `type_id` but no enum definition, suggesting it was designed for expansion but never fully implemented.

### Option A: Enhanced Single Expense Table (Polymorphic with JSON)

```prisma
enum ExpenseType {
  FUEL
  SERVICE
  INSURANCE
  TAX
  PARKING
  TOLL
  OTHER
}

model Expense {
  id          Int         @id @default(autoincrement())
  vehicle_id  Int
  vehicle     Vehicle     @relation(fields: [vehicle_id], references: [id], onDelete: Cascade)
  date        DateTime    @db.Date
  mileage     Float       @default(0.0)
  type        ExpenseType
  cost        Float       @default(0.0)
  currency_id Int
  comment     String?

  // Type-specific data stored as JSON
  fuelData    Json?       // { quantity, costPerUnit, fullTank, station, country }
  serviceData Json?       // { serviceType, parts, laborCost, provider }
  insuranceData Json?     // { provider, policyNumber, coverage, startDate, endDate }

  created_at  DateTime    @default(now())
  updated_at  DateTime    @updatedAt

  @@index([vehicle_id, date])
  @@index([vehicle_id, type])
}
```

**Pros:**

- Single table for all expenses = simpler queries
- JSON fields allow flexible type-specific data without schema migrations
- Easy to add new expense types
- Statistics queries work across all types naturally

**Cons:**

- JSON fields aren't type-safe at database level
- Can't use database constraints on type-specific fields
- Slightly more complex validation logic in API

### Option B: Separate Tables per Type (Current Pattern Extended)

```prisma
model Fueling {
  // Keep existing schema
  id                     Int       @id @default(autoincrement())
  quantity               Float     @default(0.0)
  cost                   Float     @default(0.0)
  cost_per_unit          Float     @default(0.0)
  // ... all existing fields
}

model ServiceExpense {
  id          Int      @id @default(autoincrement())
  vehicle_id  Int
  vehicle     Vehicle  @relation(fields: [vehicle_id], references: [id], onDelete: Cascade)
  date        DateTime @db.Date
  mileage     Float    @default(0.0)
  cost        Float    @default(0.0)
  currency_id Int
  service_type String  // oil_change, tire_rotation, brake_service, etc.
  provider    String?
  parts_cost  Float?
  labor_cost  Float?
  description String?
}

model InsuranceExpense {
  id            Int      @id @default(autoincrement())
  vehicle_id    Int
  vehicle       Vehicle  @relation(fields: [vehicle_id], references: [id], onDelete: Cascade)
  date          DateTime @db.Date
  cost          Float    @default(0.0)
  currency_id   Int
  provider      String
  policy_number String?
  coverage_type String   // liability, comprehensive, collision
  start_date    DateTime @db.Date
  end_date      DateTime @db.Date
}
```

**Pros:**

- Strong typing at database level
- Clear schema for each expense type
- Type-specific constraints and indexes

**Cons:**

- Statistics queries require UNION or multiple queries
- Adding new types requires migrations
- More models to maintain
- Vehicle model needs multiple relation arrays

### Recommendation: Hybrid Approach

**Use Option A (enhanced single table)** with these modifications:

1. **Keep existing `Fueling` model** - It's specialized, has detailed fields, and refactoring would break existing data/code
2. **Enhance `Expense` model** for all OTHER expense types with JSON flexibility
3. **Create a unified view** for statistics that combines both

```prisma
// Keep Fueling as-is (it's already specialized and working)

enum ExpenseType {
  SERVICE
  INSURANCE
  TAX
  PARKING
  TOLL
  OTHER
}

model Expense {
  id          Int         @id @default(autoincrement())
  vehicle_id  Int
  vehicle     Vehicle     @relation(fields: [vehicle_id], references: [id], onDelete: Cascade)
  date        DateTime    @db.Date
  mileage     Float?      @default(0.0)
  type        ExpenseType
  cost        Float       @default(0.0)
  currency_id Int
  comment     String?
  metadata    Json?       // Type-specific data

  created_at  DateTime    @default(now())
  updated_at  DateTime    @updatedAt

  @@index([vehicle_id, date])
  @@index([vehicle_id, type])
}

model VehiclePhoto {
  id          Int      @id @default(autoincrement())
  vehicle_id  Int
  vehicle     Vehicle  @relation(fields: [vehicle_id], references: [id], onDelete: Cascade)
  url         String   // Vercel Blob URL
  pathname    String   // Original filename for display
  size        Int      // File size in bytes
  uploaded_at DateTime @default(now())
  is_primary  Boolean  @default(false)

  @@index([vehicle_id])
}
```

**Rationale:**

- Preserves existing Fueling model and data
- Single Expense table for flexibility on new types
- JSON metadata handles type variations without migrations
- Clean photo model for vehicle images
- Indexes support common query patterns

---

## API Structure

### Existing Pattern (from codebase)

```typescript
// pages/api/fueling/index.ts - POST/GET pattern with switch
export default async function handle(req, res) {
	switch (method) {
		case 'POST': // Create fueling
		case 'GET': // List fuelings
		default: // 405 Method Not Allowed
	}
}
```

### Recommended API Expansion

```
/api/vehicles/
  GET    - List user's vehicles
  POST   - Create vehicle

/api/vehicles/[id]
  GET    - Get vehicle details
  PUT    - Update vehicle
  DELETE - Delete vehicle

/api/vehicles/[id]/photos
  GET    - List vehicle photos
  POST   - Upload photo (returns Vercel Blob URL)

/api/vehicles/[id]/photos/[photoId]
  DELETE - Delete photo

/api/fueling/
  GET    - List fuelings (keep existing)
  POST   - Create fueling (keep existing)

/api/fueling/[id]
  GET    - Get fueling details
  PUT    - Update fueling
  DELETE - Delete fueling

/api/expenses/
  GET    - List expenses (supports ?type=SERVICE&vehicleId=1)
  POST   - Create expense

/api/expenses/[id]
  GET    - Get expense details
  PUT    - Update expense
  DELETE - Delete expense

/api/vehicles/[id]/statistics
  GET    - Get aggregated stats for vehicle
         - Query params: ?period=month&year=2026&month=1
```

### API Response Patterns

Follow existing pattern with typed responses:

```typescript
// types/expense_types.ts
export type ExpenseData = {
	id: number;
	vehicle_id: number;
	date: string; // ISO date
	type: ExpenseType;
	cost: number;
	currency_id: number;
	comment?: string;
	metadata?: Record<string, unknown>;
};

export type VehicleStatistics = {
	period: {
		year: number;
		month?: number;
	};
	totals: {
		fuel: number;
		service: number;
		insurance: number;
		other: number;
		total: number;
	};
	fuelMetrics?: {
		totalLiters: number;
		averageCostPerLiter: number;
		averageConsumption: number; // L/100km
		totalDistance: number;
	};
};
```

---

## Statistics & Aggregation

### Query Patterns (Prisma Official Docs Verified)

**Monthly expense totals by type:**

```typescript
// Using Prisma groupBy() - officially supported
const monthlyExpenses = await prisma.expense.groupBy({
	by: ['type'],
	where: {
		vehicle_id: vehicleId,
		date: {
			gte: new Date(year, month - 1, 1),
			lt: new Date(year, month, 1),
		},
	},
	_sum: {
		cost: true,
	},
});

// Fueling aggregates
const fuelingStats = await prisma.fueling.aggregate({
	where: {
		vehicle_id: vehicleId,
		date: {
			gte: startDate,
			lt: endDate,
		},
	},
	_sum: {
		cost: true,
		quantity: true,
		distance_traveled: true,
	},
	_avg: {
		cost_per_unit: true,
	},
});
```

**Combined statistics endpoint:**

```typescript
// pages/api/vehicles/[id]/statistics.ts
export default async function handle(req, res) {
	const { id } = req.query;
	const { year, month } = req.query;

	const startDate = new Date(year, month - 1, 1);
	const endDate = new Date(year, month, 1);

	// Run queries in parallel
	const [fuelingStats, expensesByType] = await Promise.all([
		prisma.fueling.aggregate({
			where: { vehicle_id: Number(id), date: { gte: startDate, lt: endDate } },
			_sum: { cost: true, quantity: true, distance_traveled: true },
			_avg: { cost_per_unit: true },
			_count: true,
		}),
		prisma.expense.groupBy({
			by: ['type'],
			where: { vehicle_id: Number(id), date: { gte: startDate, lt: endDate } },
			_sum: { cost: true },
		}),
	]);

	// Transform to response shape
	return res.json({
		period: { year: Number(year), month: Number(month) },
		totals: {
			fuel: fuelingStats._sum.cost || 0,
			...expensesByType.reduce(
				(acc, e) => ({
					...acc,
					[e.type.toLowerCase()]: e._sum.cost || 0,
				}),
				{}
			),
		},
		fuelMetrics:
			fuelingStats._count > 0
				? {
						totalLiters: fuelingStats._sum.quantity,
						averageCostPerLiter: fuelingStats._avg.cost_per_unit,
						totalDistance: fuelingStats._sum.distance_traveled,
					}
				: null,
	});
}
```

### Caching Strategy

**TanStack Query settings (already in use):**

```typescript
// Statistics queries - moderate stale time since data doesn't change frequently
const { data: stats } = useQuery({
	queryKey: ['vehicle-stats', vehicleId, year, month],
	queryFn: () => fetchVehicleStats(vehicleId, year, month),
	staleTime: 5 * 60 * 1000, // 5 minutes
	gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
});

// Invalidate on new expense/fueling
queryClient.invalidateQueries({ queryKey: ['vehicle-stats', vehicleId] });
```

**When NOT to pre-compute:**

- User has 3-5 vehicles (stated requirement)
- ~100-200 expense records per year per vehicle
- Prisma/PostgreSQL handles this instantly

**When to consider pre-computation:**

- If query times exceed 200ms
- If adding complex calculations (trends, predictions)
- If expanding to fleet management (100+ vehicles)

---

## Image Storage

### Option A: Vercel Blob (Recommended)

**From Vercel Official Docs (verified 2026-01-30):**

```typescript
// Installation
npm install @vercel/blob

// Upload (server-side or client-side)
import { put } from '@vercel/blob';

const blob = await put(`vehicles/${vehicleId}/${filename}`, file, {
  access: 'public',
  addRandomSuffix: true, // Prevents overwrites, adds unique suffix
});
// Returns: { url, pathname, contentType, contentDisposition }
```

**Implementation:**

```typescript
// pages/api/vehicles/[id]/photos.ts
import { put, del, list } from '@vercel/blob';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
	api: {
		bodyParser: false, // Required for file uploads
	},
};

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { id } = req.query;

	switch (req.method) {
		case 'POST': {
			// Use formidable or busboy for multipart parsing
			const blob = await put(`vehicles/${id}/${filename}`, file, {
				access: 'public',
				addRandomSuffix: true,
			});

			// Save to database
			const photo = await prisma.vehiclePhoto.create({
				data: {
					vehicle_id: Number(id),
					url: blob.url,
					pathname: blob.pathname,
					size: file.size,
				},
			});

			return res.json(photo);
		}

		case 'GET': {
			const photos = await prisma.vehiclePhoto.findMany({
				where: { vehicle_id: Number(id) },
				orderBy: { uploaded_at: 'desc' },
			});
			return res.json(photos);
		}
	}
}
```

**Pros:**

- Native Vercel integration (no extra config)
- Global CDN distribution
- 99.999999999% durability (S3-backed)
- Simple SDK, works with Next.js Pages Router
- Cost-effective for small files ($0.02/GB storage, $0.03/GB transfer)
- Supports client-side uploads (reduces server load)

**Cons:**

- Vendor lock-in to Vercel
- URLs are public (but unguessable with random suffix)

### Option B: Cloudinary

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const result = await cloudinary.uploader.upload(file.path, {
	folder: `fuelion/vehicles/${vehicleId}`,
	transformation: [{ width: 1200, crop: 'limit' }],
});
```

**Pros:**

- Image transformations (resize, crop, optimize)
- Not tied to Vercel

**Cons:**

- Additional service to configure
- Pricing can be complex
- Overkill for simple photo storage

### Option C: AWS S3

**Pros:**

- Industry standard
- Fine-grained access control

**Cons:**

- More configuration required
- Need to handle presigned URLs
- Not as integrated with Vercel

### Recommendation: Vercel Blob

**Use Vercel Blob because:**

1. Already deploying to Vercel (native integration)
2. Simple SDK matches existing code patterns
3. Perfect for 1-5 photos per vehicle use case
4. No image transformation needs (just storage/display)
5. Cost-effective at expected scale

**File upload limits to enforce:**

- Max 5 photos per vehicle
- Max 10MB per photo
- Allowed types: image/jpeg, image/png, image/webp

---

## Build Order

Based on dependencies and risk analysis:

### Phase 1: Data Model Enhancement

**Build:** Enhanced Expense model, VehiclePhoto model, database migration

**Why first:** Everything depends on the data model. Get this right before building UI or APIs.

**Tasks:**

1. Add `ExpenseType` enum to Prisma schema
2. Update `Expense` model with type, metadata fields
3. Create `VehiclePhoto` model
4. Add indexes for performance
5. Run migration (`npx prisma migrate dev`)

**Risk:** LOW - Additive changes, backward compatible

### Phase 2: Expense API Expansion

**Build:** `/api/expenses/` endpoints with type filtering

**Why second:** Enables expense entry before statistics (can't calculate stats without data)

**Tasks:**

1. Create `/api/expenses/index.ts` (GET with filters, POST)
2. Create `/api/expenses/[id].ts` (GET, PUT, DELETE)
3. Add validation for type-specific metadata
4. Integrate with existing auth (NextAuth)

**Depends on:** Phase 1

### Phase 3: Image Upload

**Build:** Vehicle photo upload with Vercel Blob

**Why third:** Independent of expenses, can parallelize with Phase 4

**Tasks:**

1. Install `@vercel/blob`
2. Create `/api/vehicles/[id]/photos.ts`
3. Add multipart form handling
4. Implement upload limits

**Depends on:** Phase 1 (VehiclePhoto model)

### Phase 4: Expense Entry UI

**Build:** Forms for different expense types

**Why fourth:** Needs APIs from Phase 2

**Tasks:**

1. Create expense type selector component
2. Build type-specific form fields (dynamic)
3. Add to existing vehicle detail page
4. Use Formik (existing pattern) + TanStack Query mutations

**Depends on:** Phase 2

### Phase 5: Statistics API

**Build:** `/api/vehicles/[id]/statistics` endpoint

**Why fifth:** Needs expense data to exist

**Tasks:**

1. Implement aggregation queries
2. Combine Fueling + Expense data
3. Support period filtering (monthly, yearly)

**Depends on:** Phase 1, Phase 2

### Phase 6: Statistics Dashboard

**Build:** Charts and visualization UI

**Why last:** Needs all data and APIs complete

**Tasks:**

1. Select chart library (recommend Recharts - works well with React)
2. Build monthly expense breakdown chart
3. Build fuel consumption trends
4. Responsive layout for mobile

**Depends on:** Phase 5

---

## Integration Points

### Connecting to Existing Code

**Authentication (existing):**

```typescript
// pages/api/expenses/index.ts
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const session = await getServerSession(req, res, authOptions);
if (!session) {
	return res.status(401).json({ error: 'Unauthorized' });
}
```

**Data fetching (existing pattern):**

```typescript
// hooks/useExpenses.ts - follow existing getCountries pattern
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useExpenses = (vehicleId: number) => {
	return useQuery({
		queryKey: ['expenses', vehicleId],
		queryFn: async () => {
			const res = await fetch(`/api/expenses?vehicleId=${vehicleId}`);
			return res.json();
		},
	});
};

export const useCreateExpense = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: ExpenseData) => {
			const res = await fetch('/api/expenses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			return res.json();
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['expenses', variables.vehicle_id],
			});
			queryClient.invalidateQueries({
				queryKey: ['vehicle-stats', variables.vehicle_id],
			});
		},
	});
};
```

**Form handling (existing pattern):**

```typescript
// Use Formik as established in AGENTS.md
const formik = useFormik({
	initialValues: { type: 'SERVICE', cost: '', date: '', comment: '' },
	onSubmit: (values) => createExpense.mutate(values),
});
```

**UI components (existing):**

- Use Chakra UI for forms, modals, layout
- Follow PascalCase component naming
- Use existing Loading and FetchDataErrorAlert components

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: N+1 Queries in Statistics

**What:** Fetching expenses one-by-one in a loop
**Why bad:** Kills performance, especially with multiple vehicles
**Instead:** Use Prisma's `groupBy()` and `aggregate()` - single query

### Anti-Pattern 2: Storing Images in Database

**What:** Saving image blobs in PostgreSQL
**Why bad:** Bloats database, slow queries, expensive backups
**Instead:** Store URLs only, use Vercel Blob for actual files

### Anti-Pattern 3: Synchronous Statistics Calculation

**What:** Calculating all stats on every page load
**Why bad:** Slow page loads, wasted computation
**Instead:** Use TanStack Query caching, only refetch on mutations

### Anti-Pattern 4: Over-Engineering for Scale

**What:** Adding Redis caching, background jobs, materialized views
**Why bad:** Premature optimization, added complexity
**Instead:** Start simple. Prisma + PostgreSQL handles thousands of records easily. Optimize only when metrics show need.

---

## Confidence Assessment

| Area          | Confidence | Reason                                                  |
| ------------- | ---------- | ------------------------------------------------------- |
| Data Model    | HIGH       | Based on Prisma official docs, existing schema analysis |
| API Structure | HIGH       | Follows existing codebase patterns                      |
| Statistics    | HIGH       | Prisma groupBy/aggregate officially documented          |
| Image Storage | HIGH       | Vercel Blob docs verified, native integration           |
| Build Order   | HIGH       | Dependencies are clear from schema                      |

## Sources

- Prisma Relations: https://www.prisma.io/docs/orm/prisma-schema/data-model/relations
- Prisma Aggregation: https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
- Vercel Blob: https://vercel.com/docs/storage/vercel-blob
- TanStack Query Caching: https://tanstack.com/query/latest/docs/framework/react/guides/caching
- Existing codebase: prisma/schema.prisma, pages/api/\*.ts, AGENTS.md
