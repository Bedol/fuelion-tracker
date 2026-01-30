# Stack Research: Fuelion Additions

**Project:** Fuelion - Vehicle Expense Tracking App  
**Researched:** 2026-01-30  
**Focus:** Charts, Image Upload, Form UX Improvements

## Summary

For Fuelion's feature additions, I recommend **Recharts** for charting (React-native, declarative, excellent TypeScript support), **Chakra UI's built-in FileUpload** combined with **UploadThing** for image handling (first-party integration, managed storage, Next.js Pages Router support), and leveraging **existing Chakra UI 3.x form components** with **Formik** for enhanced form UX. This approach minimizes new dependencies while maximizing compatibility with the existing stack. The key principle: prefer what's already in the ecosystem before adding new libraries.

---

## Charts & Visualization

### Recommended: Recharts

| Attribute             | Value                               |
| --------------------- | ----------------------------------- |
| **Package**           | `recharts`                          |
| **Version**           | `^3.7.0` (latest as of Jan 2026)    |
| **Peer Dependencies** | `react-is` (matching React version) |
| **Bundle Size**       | ~170KB minified                     |
| **Confidence**        | HIGH                                |

**Why Recharts:**

1. **React-native approach**: Built with React and D3, uses declarative JSX components that feel natural in a React codebase
2. **Excellent TypeScript support**: Strict mode enabled, well-typed exports (`BarShapeProps`, `TooltipIndex`, etc.)
3. **Responsive out of the box**: `ResponsiveContainer` built-in or use the new `responsive` prop directly on charts
4. **Active development**: v3.7.0 released Jan 2026, regular releases with performance improvements
5. **Most popular**: 26.6k GitHub stars, 803k+ projects using it, ~2.4M weekly npm downloads
6. **Perfect for expense tracking**: Line charts for trends, bar charts for comparisons, pie charts for breakdowns

**For Fuelion specifically:**

- Fuel consumption over time: `LineChart` with `XAxis` (date), `YAxis` (liters/km)
- Cost breakdown by category: `PieChart` for insurance vs fuel vs service
- Monthly comparison: `BarChart` with `stackOffset` for stacked expenses

**Integration with existing stack:**

- Works directly with React 19 (Recharts v3+ tested)
- Plays well with TanStack Query data (pass query results directly to `data` prop)
- Styling via standard React props (no CSS-in-JS conflicts with Chakra/Tailwind)

**Code Example:**

```tsx
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

// Using TanStack Query data directly
const { data: fuelData } = useQuery({
	queryKey: ['fuelings'],
	queryFn: fetchFuelings,
});

<ResponsiveContainer width='100%' height={300}>
	<LineChart data={fuelData}>
		<XAxis dataKey='date' />
		<YAxis />
		<Tooltip />
		<Line type='monotone' dataKey='consumption' stroke='#ff7300' />
	</LineChart>
</ResponsiveContainer>;
```

### Alternatives Considered

| Library                        | Why Not Chosen                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| **Chart.js / react-chartjs-2** | Canvas-based (no CSS styling), extra wrapper needed, less React-idiomatic                  |
| **Nivo**                       | More complex API, heavier bundle, better for advanced visualizations than expense tracking |
| **Victory**                    | More verbose API, smaller community, less active development                               |
| **Apache ECharts**             | Overkill for expense tracking, complex configuration, imperative API                       |
| **Tremor**                     | Tailwind-only (we use Chakra primarily), opinionated dashboard components                  |

**Note on Nivo:** Excellent library with beautiful defaults and v0.99.0 has React 19 support (v0.98.0+), but its API is more complex and bundle is larger. Consider if you need advanced visualizations like Sankey diagrams or choropleth maps later.

---

## Image Upload

### Recommended: Chakra UI FileUpload + UploadThing

**Approach:** Use Chakra UI 3.x's built-in `FileUpload` component for the UI/UX, paired with UploadThing for server-side handling and storage.

#### Part 1: UI Component (Built-in)

| Attribute      | Value                                  |
| -------------- | -------------------------------------- |
| **Package**    | `@chakra-ui/react` (already installed) |
| **Version**    | `^3.31.0` (already in project)         |
| **Confidence** | HIGH                                   |

**Why use Chakra's FileUpload:**

- Already in your dependencies - zero new packages for UI
- Consistent styling with rest of app
- Built-in drag & drop dropzone
- File preview, size display, delete triggers
- Accessible by default

**Chakra FileUpload provides:**

- `FileUpload.Dropzone` - drag & drop area
- `FileUpload.Trigger` - click to upload button
- `FileUpload.ItemPreview` - image preview thumbnails
- `FileUpload.ItemSizeText` - file size display
- `FileUpload.ItemDeleteTrigger` - remove file

#### Part 2: Server-Side & Storage

| Attribute      | Value                                |
| -------------- | ------------------------------------ |
| **Package**    | `uploadthing` + `@uploadthing/react` |
| **Version**    | `^7.x` (latest)                      |
| **Storage**    | UploadThing managed (S3-compatible)  |
| **Confidence** | HIGH                                 |

**Why UploadThing:**

1. **First-party Next.js Pages Router support**: Official adapter, documented setup
2. **Managed storage**: No need to configure S3, Cloudflare, or self-host
3. **Type-safe file routes**: Define upload constraints in TypeScript
4. **Built-in auth integration**: Works with NextAuth
5. **Generous free tier**: 2GB storage, 2GB transfer/month
6. **Tailwind integration**: `withUt()` helper for styling

**Setup for Next.js Pages Router:**

```typescript
// server/uploadthing.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy';

const f = createUploadthing();

export const ourFileRouter = {
	vehicleImage: f({
		image: { maxFileSize: '4MB', maxFileCount: 1 },
	})
		.middleware(async ({ req, res }) => {
			const session = await getSession({ req });
			if (!session) throw new UploadThingError('Unauthorized');
			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// Save file.ufsUrl to Prisma
			return { url: file.ufsUrl };
		}),
} satisfies FileRouter;
```

**Integration pattern:**

```tsx
// Combine Chakra UI with UploadThing
import { FileUpload } from '@chakra-ui/react';
import { useUploadThing } from '~/utils/uploadthing';

const { startUpload } = useUploadThing('vehicleImage');

<FileUpload.Root
	onFileAccept={async (details) => {
		const uploaded = await startUpload(details.files);
		// Handle uploaded[0].url
	}}
>
	<FileUpload.Dropzone>
		<FileUpload.DropzoneContent />
	</FileUpload.Dropzone>
</FileUpload.Root>;
```

### Alternatives Considered

| Approach                       | Why Not Chosen                                                          |
| ------------------------------ | ----------------------------------------------------------------------- |
| **react-dropzone + S3 direct** | More setup, need to manage S3 credentials, CORS, presigned URLs         |
| **Cloudinary**                 | Overkill for vehicle photos, complex pricing, more features than needed |
| **Supabase Storage**           | Would need to add Supabase, already have PostgreSQL via Prisma          |
| **Vercel Blob**                | Good option but UploadThing has better DX and file route abstraction    |
| **Self-hosted MinIO**          | Infrastructure overhead, not worth it for vehicle photos                |

**Note:** react-dropzone (v14.4.0, 11k stars) is excellent if you want to handle uploads yourself. It's a UI-only library (not a file uploader) that works great with any storage backend. Consider it if you need more control or want to avoid third-party storage.

---

## Form UX Improvements

### Recommended: Leverage Existing Stack

**Approach:** The existing stack (Formik 2.x + Chakra UI 3.x) has everything needed for fast data entry. Focus on _patterns_ rather than new libraries.

| Component             | Source        | Purpose                                          |
| --------------------- | ------------- | ------------------------------------------------ |
| **NumberInput**       | Chakra UI 3.x | Fuel amount, odometer, price entry with steppers |
| **Field**             | Chakra UI 3.x | Labels, helper text, error messages              |
| **Combobox**          | Chakra UI 3.x | Vehicle selection with search                    |
| **Segmented Control** | Chakra UI 3.x | Quick fuel type selection (Gasoline/Diesel/LPG)  |
| **Native Select**     | Chakra UI 3.x | Station selection                                |

**Confidence:** HIGH

### Key Patterns for 30-Second Fueling Entry

#### 1. Smart Defaults

```typescript
const formik = useFormik({
	initialValues: {
		vehicleId: lastUsedVehicle, // Remember last vehicle
		date: new Date().toISOString().split('T')[0], // Today
		fuelType: vehicle?.defaultFuelType, // From vehicle settings
		station: lastStation, // Remember last station
		odometer: previousOdometer + estimatedDelta, // Suggest based on average
		liters: '', // Always empty - user must enter
		pricePerLiter: lastPricePerLiter, // Suggest last price
	},
});
```

#### 2. Mobile-Optimized NumberInput

```tsx
<NumberInput.Root
	min={0}
	step={0.01}
	inputMode='decimal' // Shows numeric keyboard on mobile
	formatOptions={{
		style: 'decimal',
		minimumFractionDigits: 2,
	}}
>
	<NumberInput.Label>Liters</NumberInput.Label>
	<NumberInput.Input />
	<NumberInput.Control /> {/* Stepper buttons */}
</NumberInput.Root>
```

#### 3. Quick Fuel Type with Segmented Control

```tsx
<SegmentedControl.Root
	value={formik.values.fuelType}
	onValueChange={(e) => formik.setFieldValue('fuelType', e.value)}
>
	<SegmentedControl.Item value='gasoline'>Benzyna</SegmentedControl.Item>
	<SegmentedControl.Item value='diesel'>Diesel</SegmentedControl.Item>
	<SegmentedControl.Item value='lpg'>LPG</SegmentedControl.Item>
</SegmentedControl.Root>
```

#### 4. Auto-Calculate Total

```typescript
// In Formik, derive total from liters * pricePerLiter
const totalCost = useMemo(() => {
	const liters = parseFloat(formik.values.liters) || 0;
	const price = parseFloat(formik.values.pricePerLiter) || 0;
	return (liters * price).toFixed(2);
}, [formik.values.liters, formik.values.pricePerLiter]);
```

### Why Not Add New Form Libraries

| Library             | Reason to Skip                                    |
| ------------------- | ------------------------------------------------- |
| **react-hook-form** | Already using Formik, migration cost not worth it |
| **Zod**             | Formik has built-in validation, Yup also works    |
| **Final Form**      | Similar to Formik, no compelling advantage        |
| **Mantine Forms**   | Would conflict with Chakra UI styling             |

**Recommendation:** Keep Formik. It's already in the project, works well with Chakra UI, and the team knows it. The form UX improvement comes from _patterns and smart defaults_, not from switching libraries.

---

## NOT Recommended

| Library/Approach                   | Why Avoid                                                |
| ---------------------------------- | -------------------------------------------------------- |
| **D3.js directly**                 | Too low-level, Recharts provides better abstraction      |
| **Chart.js without wrapper**       | Imperative API, not React-idiomatic                      |
| **AWS S3 directly**                | Complex setup, credential management, CORS configuration |
| **Firebase Storage**               | Would add Firebase dependency for just storage           |
| **Formidable/Multer**              | For file parsing, UploadThing handles this               |
| **react-hook-form**                | Already using Formik, don't mix form libraries           |
| **Replacing Formik with anything** | Working, known, team-familiar - keep it                  |

---

## Installation

```bash
# Charts
npm install recharts react-is

# Image Upload (UploadThing)
npm install uploadthing @uploadthing/react

# No new packages needed for Form UX - use existing Chakra UI 3.x components
```

### Environment Variables

```bash
# UploadThing (get from uploadthing.com dashboard)
UPLOADTHING_TOKEN=sk_live_xxxxx
```

### Tailwind Configuration (for UploadThing styling)

```typescript
// tailwind.config.ts
import { withUt } from 'uploadthing/tw';

export default withUt({
	// existing config
});
```

---

## Confidence Levels

| Addition               | Confidence | Verification Source                           | Notes                               |
| ---------------------- | ---------- | --------------------------------------------- | ----------------------------------- |
| Recharts v3.7.0        | HIGH       | GitHub releases (Jan 21, 2026), official docs | Latest release, active development  |
| Chakra FileUpload      | HIGH       | Official Chakra UI 3.x docs                   | Built-in, no additional packages    |
| UploadThing v7.x       | HIGH       | Official docs, Pages Router guide             | First-party Next.js support         |
| react-dropzone v14.4.0 | HIGH       | GitHub releases (Jan 29, 2026)                | Alternative if self-hosting storage |
| Nivo v0.99.0           | HIGH       | GitHub releases (May 23, 2025)                | React 19 support confirmed          |
| Form UX patterns       | HIGH       | Chakra UI 3.x docs                            | Built-in components verified        |

---

## Sources

- Recharts: https://github.com/recharts/recharts (26.6k stars, v3.7.0 released Jan 21, 2026)
- Recharts docs: https://recharts.github.io/
- UploadThing: https://docs.uploadthing.com/getting-started/pagedir
- Chakra UI FileUpload: https://www.chakra-ui.com/docs/components/file-upload
- Chakra UI NumberInput: https://www.chakra-ui.com/docs/components/number-input
- Chakra UI Field: https://www.chakra-ui.com/docs/components/field
- Nivo: https://nivo.rocks/, https://github.com/plouc/nivo/releases
- Chart.js: https://www.chartjs.org/docs/latest/
- react-dropzone: https://github.com/react-dropzone/react-dropzone (11k stars, v14.4.0)
