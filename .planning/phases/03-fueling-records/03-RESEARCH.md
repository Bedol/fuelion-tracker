# Phase 03: Fueling Records - Research

**Researched:** 2026-01-31
**Domain:** Fueling Records Management (Form UX, List Display, Data Modeling)
**Confidence:** HIGH

## Summary

This phase delivers the core value proposition of Fuelion — enabling users to add fueling records in under 30 seconds through smart defaults and fast form UX. Research focused on Formik patterns for live calculations, TanStack Query for infinite scroll lists, Prisma for efficient data modeling, and Chakra UI v3 for consistent UI patterns.

**Primary recommendation:** Use `useFormik` with derived field calculations in `onChange` handlers, implement infinite scroll with `useInfiniteQuery` and `react-intersection-observer`, and store draft data in localStorage with `beforeunload` protection.

---

## Standard Stack

### Core (Already in Project)

| Library        | Version | Purpose                        | Why Standard                                    |
| -------------- | ------- | ------------------------------ | ----------------------------------------------- |
| Formik         | 2.4.9   | Form state management          | Established in codebase, works well with Chakra |
| TanStack Query | 5.90.19 | Server state & infinite scroll | Best-in-class for pagination, caching built-in  |
| Prisma         | 6.19.2  | Database ORM                   | Already configured with schema                  |
| Chakra UI      | 3.31.0  | Component library              | Project standard, includes Ark UI components    |

### Additional Dependencies Needed

| Library                     | Version | Purpose                        | Installation                              |
| --------------------------- | ------- | ------------------------------ | ----------------------------------------- |
| react-intersection-observer | ^9.x    | Infinite scroll trigger        | `npm install react-intersection-observer` |
| date-fns                    | ^3.x    | Date formatting & manipulation | `npm install date-fns`                    |

**Installation:**

```bash
npm install react-intersection-observer date-fns
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/fueling/
│   ├── FuelingForm.tsx           # Create/edit form component
│   ├── FuelingList.tsx           # List with infinite scroll
│   ├── FuelingListItem.tsx       # Individual list item
│   ├── FuelingDeleteModal.tsx    # Delete confirmation
│   └── hooks/
│       ├── useFuelingDraft.ts    # Draft save to localStorage
│       └── useLastFuelingData.ts # Get last fueling for defaults
├── hooks/
│   ├── useFuelings.ts            # useInfiniteQuery for list
│   ├── useCreateFueling.ts       # Create mutation
│   ├── useUpdateFueling.ts       # Update mutation
│   └── useDeleteFueling.ts       # Delete mutation
├── types/
│   └── fueling_types.ts          # Fueling type definitions
└── pages/api/fueling/
    ├── index.ts                  # GET list (paginated), POST create
    └── [id].ts                   # GET, PUT, DELETE single
```

### Pattern 1: Live Price-Per-Liter Calculation

**What:** Auto-calculate price-per-liter from total cost and liters entered
**When to use:** As user types, update read-only derived field
**Implementation approach:** Formik `onChange` handlers with `setFieldValue`

**Example:**

```typescript
// Source: Formik docs + Chakra UI patterns
const formik = useFormik({
  initialValues: {
    cost: '',
    quantity: '',
    cost_per_unit: 0,
    // ...other fields
  },
  onSubmit: (values) => {
    mutation.mutate(values);
  },
});

// Live calculation in onChange
const handleCostChange = (value: string) => {
  const cost = parseFloat(value) || 0;
  const quantity = parseFloat(formik.values.quantity) || 0;

  formik.setFieldValue('cost', value);

  if (quantity > 0) {
    const costPerUnit = cost / quantity;
    formik.setFieldValue('cost_per_unit', parseFloat(costPerUnit.toFixed(3)));
  }
};

const handleQuantityChange = (value: string) => {
  const quantity = parseFloat(value) || 0;
  const cost = parseFloat(formik.values.cost) || 0;

  formik.setFieldValue('quantity', value);

  if (quantity > 0) {
    const costPerUnit = cost / quantity;
    formik.setFieldValue('cost_per_unit', parseFloat(costPerUnit.toFixed(3)));
  }
};

// Read-only display field
<FormControl>
  <FormLabel>Price per liter</FormLabel>
  <Text fontWeight="bold" color="gray.700">
    {formik.values.cost_per_unit > 0
      ? `${formik.values.cost_per_unit.toFixed(3)} PLN/L`
      : '--'}
  </Text>
</FormControl>
```

### Pattern 2: On-Blur Validation

**What:** Validate fields when user leaves them, not on every keystroke
**When to use:** Required for "fast entry" UX without annoying real-time errors
**Implementation approach:** Formik `validateOnChange: false, validateOnBlur: true`

**Example:**

```typescript
const formik = useFormik({
  initialValues: { /* ... */ },
  validateOnChange: false,  // Key: disable change validation
  validateOnBlur: true,     // Key: enable blur validation
  validate: (values) => {
    const errors: Record<string, string> = {};

    if (!values.cost || parseFloat(values.cost) <= 0) {
      errors.cost = 'Total cost is required';
    }
    if (!values.quantity || parseFloat(values.quantity) <= 0) {
      errors.quantity = 'Fuel amount is required';
    }
    if (!values.mileage || parseFloat(values.mileage) <= 0) {
      errors.mileage = 'Odometer reading is required';
    }

    return errors;
  },
  onSubmit: (values) => {
    mutation.mutate(values);
  },
});

// Error display only when touched
<FormControl isInvalid={formik.touched.cost && !!formik.errors.cost}>
  <FormLabel htmlFor="cost">Total Cost *</FormLabel>
  <Input
    id="cost"
    name="cost"
    type="number"
    onChange={handleCostChange}
    onBlur={formik.handleBlur}
    value={formik.values.cost}
  />
  <FormErrorMessage>{formik.errors.cost}</FormErrorMessage>
</FormControl>
```

### Pattern 3: Smart Defaults from Last Fueling

**What:** Pre-fill date (today), fuel type (last used), show last odometer as hint
**When to use:** Every form initialization for speed
**Implementation approach:** `useQuery` to fetch last fueling, merge with initialValues

**Example:**

```typescript
// Hook to get last fueling data
const useLastFuelingData = (vehicleId: number) => {
  return useQuery({
    queryKey: ['lastFueling', vehicleId],
    queryFn: async () => {
      const response = await fetch(`/api/fueling/last?vehicleId=${vehicleId}`);
      if (!response.ok) return null;
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// API route for last fueling
// GET /api/fueling/last?vehicleId=123
const lastFueling = await prisma.fueling.findFirst({
  where: { vehicle_id: vehicleId },
  orderBy: { date: 'desc' },
});

// Form initialization
const { data: lastFueling } = useLastFuelingData(vehicle.id);

const getInitialValues = () => {
  const today = format(new Date(), 'yyyy-MM-dd');

  return {
    cost: '',
    quantity: '',
    cost_per_unit: 0,
    date: today,
    mileage: '',
    fuel_type: lastFueling?.fuel_type || vehicle.fuel_type, // Smart default
    full_tank: true,
    // Store last odometer for hint display
    last_odometer: lastFueling?.mileage || vehicle.mileage,
    vehicle_id: vehicle.id,
  };
};

// Show hint
<FormControl>
  <FormLabel htmlFor="mileage">Odometer *</FormLabel>
  <Input
    id="mileage"
    name="mileage"
    type="number"
    placeholder={`Last: ${formik.values.last_odometer}`}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.mileage}
  />
  <FormHelperText>Last recorded: {formik.values.last_odometer} km</FormHelperText>
</FormControl>
```

### Pattern 4: Infinite Scroll List with Monthly Grouping

**What:** Load fuelings as user scrolls, group by month with headers
**When to use:** Lists that can grow large (100+ fuelings)
**Implementation approach:** `useInfiniteQuery` + `react-intersection-observer` + manual grouping

**Example:**

```typescript
// Hook: useFuelings.ts
export const FUELINGS_PER_PAGE = 20;

export const useFuelings = (vehicleId: number) => {
  return useInfiniteQuery({
    queryKey: ['fuelings', vehicleId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(
        `/api/fueling?vehicleId=${vehicleId}&skip=${pageParam}&take=${FUELINGS_PER_PAGE}`
      );
      if (!response.ok) throw new Error('Failed to fetch fuelings');
      return response.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      // If we got a full page, there might be more
      if (lastPage.length === FUELINGS_PER_PAGE) {
        return allPages.length * FUELINGS_PER_PAGE;
      }
      return undefined; // No more pages
    },
    initialPageParam: 0,
  });
};

// API: pages/api/fueling/index.ts (GET handler)
const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { vehicleId, skip = '0', take = '20' } = req.query;

  const fuelings = await prisma.fueling.findMany({
    where: { vehicle_id: Number(vehicleId) },
    orderBy: { date: 'desc' }, // Newest first
    skip: Number(skip),
    take: Number(take),
  });

  res.json(fuelings);
};

// Component: FuelingList.tsx
import { useInView } from 'react-intersection-observer';
import { format, parseISO } from 'date-fns';

const FuelingList = ({ vehicleId }: { vehicleId: number }) => {
  const { ref, inView } = useInView({ threshold: 0 });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useFuelings(vehicleId);

  // Trigger load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten pages and group by month
  const fuelings = data?.pages.flatMap((page) => page) || [];

  const groupedFuelings = useMemo(() => {
    const groups: Record<string, typeof fuelings> = {};

    fuelings.forEach((fueling) => {
      const monthKey = format(parseISO(fueling.date), 'MMMM yyyy');
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(fueling);
    });

    return groups;
  }, [fuelings]);

  if (isLoading) return <Loading />;
  if (isError) return <FetchDataErrorAlert errorMessage="Failed to load fuelings" />;

  return (
    <Box>
      {Object.entries(groupedFuelings).map(([month, monthFuelings]) => (
        <Box key={month} mb={6}>
          <Heading size="sm" mb={3} color="gray.600">
            {month}
          </Heading>
          <VStack spacing={2} align="stretch">
            {monthFuelings.map((fueling) => (
              <FuelingListItem key={fueling.id} fueling={fueling} />
            ))}
          </VStack>
        </Box>
      ))}

      {/* Infinite scroll trigger */}
      <Box ref={ref} py={4} textAlign="center">
        {isFetchingNextPage && <Spinner />}
        {!hasNextPage && fuelings.length > 0 && (
          <Text color="gray.500" fontSize="sm">No more fuelings</Text>
        )}
      </Box>
    </Box>
  );
};
```

### Pattern 5: Draft Save with localStorage

**What:** Auto-save form state to localStorage, warn on unsaved changes
**When to use:** Protect user data during long form entry or accidental navigation
**Implementation approach:** `useEffect` with debounce + `beforeunload` event

**Example:**

```typescript
// Hook: useFuelingDraft.ts
const DRAFT_KEY = (vehicleId: number) => `fueling-draft-${vehicleId}`;

export const useFuelingDraft = (vehicleId: number) => {
	const [hasDraft, setHasDraft] = useState(false);

	// Load draft on mount
	const loadDraft = useCallback(() => {
		if (typeof window === 'undefined') return null;
		const saved = localStorage.getItem(DRAFT_KEY(vehicleId));
		return saved ? JSON.parse(saved) : null;
	}, [vehicleId]);

	// Save draft (debounced)
	const saveDraft = useCallback(
		debounce((values: Record<string, unknown>) => {
			if (typeof window === 'undefined') return;
			localStorage.setItem(DRAFT_KEY(vehicleId), JSON.stringify(values));
			setHasDraft(true);
		}, 1000),
		[vehicleId]
	);

	// Clear draft
	const clearDraft = useCallback(() => {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(DRAFT_KEY(vehicleId));
		setHasDraft(false);
	}, [vehicleId]);

	// Warn before unload if draft exists
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasDraft) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasDraft]);

	return { loadDraft, saveDraft, clearDraft, hasDraft };
};

// Usage in form
const { loadDraft, saveDraft, clearDraft } = useFuelingDraft(vehicle.id);

const formik = useFormik({
	initialValues: loadDraft() || getDefaultValues(),
	// ...
});

// Auto-save on change
useEffect(() => {
	if (formik.dirty) {
		saveDraft(formik.values);
	}
}, [formik.values, formik.dirty, saveDraft]);

// Clear on successful submit
const handleSubmit = (values: FuelingFormValues) => {
	mutation.mutate(values, {
		onSuccess: () => {
			clearDraft();
			// ... navigate
		},
	});
};
```

### Anti-Patterns to Avoid

- **Validating on every keystroke:** Causes premature error display, slows user down
- **Using controlled inputs without debouncing:** Excessive re-renders on rapid input
- **Calculating derived values in render:** Causes inconsistent state; use `onChange` instead
- **Loading all fuelings at once:** Memory and performance issues with large datasets
- **No cleanup of localStorage drafts:** Drafts accumulate and never expire

---

## Don't Hand-Roll

| Problem                | Don't Build                    | Use Instead                                        | Why                                                   |
| ---------------------- | ------------------------------ | -------------------------------------------------- | ----------------------------------------------------- |
| Form state management  | Custom useState hooks          | Formik                                             | Handles dirty state, validation, submission lifecycle |
| Infinite scroll        | Scroll event listeners         | `useInfiniteQuery` + `react-intersection-observer` | Optimized, battle-tested, handles edge cases          |
| Date formatting        | Manual string manipulation     | `date-fns`                                         | Handles timezones, locales, edge cases                |
| Pagination math        | Manual offset calculation      | Prisma `skip`/`take`                               | Database-optimized, race-condition safe               |
| Beforeunload handling  | Direct window.addEventListener | Custom hook with cleanup                           | Memory leak prevention, proper cleanup                |
| Form draft persistence | Direct localStorage calls      | Hook with debounce                                 | Prevents excessive writes, handles SSR                |

**Key insight:** The combination of Formik + TanStack Query handles 90% of form and data concerns. Custom solutions often miss edge cases like race conditions, memory leaks, or optimistic updates.

---

## Common Pitfalls

### Pitfall 1: Floating Point Calculation Errors

**What goes wrong:** `0.1 + 0.2 !== 0.3` — price calculations show 5.9999999 instead of 6.00
**Why it happens:** JavaScript uses IEEE 754 floating point arithmetic
**How to avoid:** Use `toFixed(3)` for price-per-liter, store as number, display formatted

```typescript
// BAD
const costPerUnit = cost / quantity; // 5.999999999

// GOOD
const costPerUnit = parseFloat((cost / quantity).toFixed(3)); // 6.000
```

**Warning signs:** Prices displayed with many decimal places, "rounding" errors in totals

### Pitfall 2: Timezone Date Issues

**What goes wrong:** Fueling saved on Jan 31 shows as Jan 30 or Feb 1 in list
**Why it happens:** Date objects include time; timezone conversion shifts the day
**How to avoid:** Store dates as `yyyy-MM-dd` strings, use `date-fns` `parseISO` and `format`

```typescript
// For date input (type="date")
const today = format(new Date(), 'yyyy-MM-dd'); // "2026-01-31"

// When displaying
const displayDate = format(parseISO(fueling.date), 'MMM d, yyyy'); // "Jan 31, 2026"
```

### Pitfall 3: Race Conditions in Infinite Scroll

**What goes wrong:** User scrolls fast, multiple pages load simultaneously, data appears out of order or duplicated
**Why it happens:** `fetchNextPage` called multiple times before previous resolves
**How to avoid:** TanStack Query handles this with `isFetchingNextPage` flag — always check before fetching

```typescript
// BAD
useEffect(() => {
	if (inView) fetchNextPage(); // Multiple calls!
}, [inView]);

// GOOD
useEffect(() => {
	if (inView && hasNextPage && !isFetchingNextPage) {
		fetchNextPage();
	}
}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
```

### Pitfall 4: Dirty Check on Navigation

**What goes wrong:** User fills form, navigates away without saving, data is lost despite draft system
**Why it happens:** Next.js router navigation doesn't trigger `beforeunload`
**How to avoid:** Use Next.js `beforePopState` or warn with custom router hook

```typescript
// Custom hook for navigation blocking
export const useNavigationBlock = (isBlocked: boolean) => {
	const router = useRouter();

	useEffect(() => {
		if (!isBlocked) return;

		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = '';
		};

		const handleRouteChangeStart = () => {
			if (!confirm('You have unsaved changes. Leave anyway?')) {
				throw 'routeChange aborted';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		router.events.on('routeChangeStart', handleRouteChangeStart);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			router.events.off('routeChangeStart', handleRouteChangeStart);
		};
	}, [isBlocked, router]);
};
```

### Pitfall 5: Stale Initial Values

**What goes wrong:** Edit form shows old data because initialValues cached on first render
**Why it happens:** `useFormik` doesn't reinitialize when `initialValues` prop changes by default
**How to avoid:** Use `enableReinitialize: true` option

```typescript
const formik = useFormik({
	initialValues: fuelingData,
	enableReinitialize: true, // Critical for edit forms!
	onSubmit: (values) => {
		updateMutation.mutate(values);
	},
});
```

---

## Code Examples

### Create/Edit Form Component

```typescript
// Source: Project patterns + Formik docs
import { useFormik } from 'formik';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useFuelingDraft } from '../../hooks/useFuelingDraft';
import { useLastFuelingData } from '../../hooks/useLastFuelingData';

interface FuelingFormValues {
  cost: string;
  quantity: string;
  cost_per_unit: number;
  mileage: string;
  date: string;
  full_tank: boolean;
  fuel_type: string;
  last_odometer?: number;
  vehicle_id: number;
}

interface FuelingFormProps {
  vehicle: Vehicle;
  initialData?: Fueling; // For edit mode
  onSubmit: (values: FuelingFormValues) => void;
  isSubmitting: boolean;
}

const FuelingForm: React.FC<FuelingFormProps> = ({
  vehicle,
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const { loadDraft, saveDraft, clearDraft } = useFuelingDraft(vehicle.id);
  const { data: lastFueling } = useLastFuelingData(vehicle.id);

  const isEditMode = !!initialData;

  const getInitialValues = (): FuelingFormValues => {
    if (isEditMode && initialData) {
      return {
        cost: String(initialData.cost),
        quantity: String(initialData.quantity),
        cost_per_unit: initialData.cost_per_unit,
        mileage: String(initialData.mileage),
        date: format(new Date(initialData.date!), 'yyyy-MM-dd'),
        full_tank: initialData.full_tank,
        fuel_type: String(initialData.fuel_type_id),
        vehicle_id: vehicle.id,
      };
    }

    // Check for draft first
    const draft = loadDraft();
    if (draft) return draft;

    // Default values with smart defaults
    return {
      cost: '',
      quantity: '',
      cost_per_unit: 0,
      mileage: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      full_tank: true,
      fuel_type: lastFueling?.fuel_type || vehicle.fuel_type,
      last_odometer: lastFueling?.mileage || vehicle.mileage,
      vehicle_id: vehicle.id,
    };
  };

  const formik = useFormik<FuelingFormValues>({
    initialValues: getInitialValues(),
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validate: (values) => {
      const errors: Record<string, string> = {};

      const cost = parseFloat(values.cost);
      if (!values.cost || cost <= 0) {
        errors.cost = 'Total cost is required';
      }

      const quantity = parseFloat(values.quantity);
      if (!values.quantity || quantity <= 0) {
        errors.quantity = 'Fuel amount is required';
      }

      const mileage = parseFloat(values.mileage);
      if (!values.mileage || mileage <= 0) {
        errors.mileage = 'Odometer reading is required';
      } else if (values.last_odometer && mileage < values.last_odometer) {
        errors.mileage = `Must be greater than last reading (${values.last_odometer})`;
      }

      return errors;
    },
    onSubmit: (values) => {
      onSubmit(values);
      if (!isEditMode) clearDraft();
    },
  });

  // Auto-save draft
  useEffect(() => {
    if (!isEditMode && formik.dirty) {
      saveDraft(formik.values);
    }
  }, [formik.values, formik.dirty, isEditMode, saveDraft]);

  // Live calculation handlers
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cost = parseFloat(value) || 0;
    const quantity = parseFloat(formik.values.quantity) || 0;

    formik.setFieldValue('cost', value);

    if (quantity > 0) {
      const costPerUnit = cost / quantity;
      formik.setFieldValue('cost_per_unit', parseFloat(costPerUnit.toFixed(3)));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const quantity = parseFloat(value) || 0;
    const cost = parseFloat(formik.values.cost) || 0;

    formik.setFieldValue('quantity', value);

    if (quantity > 0) {
      const costPerUnit = cost / quantity;
      formik.setFieldValue('cost_per_unit', parseFloat(costPerUnit.toFixed(3)));
    } else {
      formik.setFieldValue('cost_per_unit', 0);
    }
  };

  return (
    <Box as="form" onSubmit={formik.handleSubmit}>
      <VStack spacing={4} align="stretch">
        {/* Total Cost */}
        <FormControl
          isRequired
          isInvalid={formik.touched.cost && !!formik.errors.cost}
        >
          <FormLabel htmlFor="cost">Total Price Paid *</FormLabel>
          <Input
            id="cost"
            name="cost"
            type="number"
            step="0.01"
            placeholder="0.00"
            onChange={handleCostChange}
            onBlur={formik.handleBlur}
            value={formik.values.cost}
          />
          <FormErrorMessage>{formik.errors.cost}</FormErrorMessage>
        </FormControl>

        {/* Liters */}
        <FormControl
          isRequired
          isInvalid={formik.touched.quantity && !!formik.errors.quantity}
        >
          <FormLabel htmlFor="quantity">Liters *</FormLabel>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            step="0.01"
            placeholder="0.00"
            onChange={handleQuantityChange}
            onBlur={formik.handleBlur}
            value={formik.values.quantity}
          />
          <FormErrorMessage>{formik.errors.quantity}</FormErrorMessage>
        </FormControl>

        {/* Live Price per Liter */}
        <FormControl>
          <FormLabel>Price per Liter</FormLabel>
          <Text
            fontWeight="bold"
            fontSize="lg"
            color={formik.values.cost_per_unit > 0 ? 'green.600' : 'gray.400'}
          >
            {formik.values.cost_per_unit > 0
              ? `${formik.values.cost_per_unit.toFixed(3)} ${vehicle.currency}/L`
              : '--'}
          </Text>
        </FormControl>

        {/* Full Tank Toggle */}
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="full_tank" mb="0">
            Full Tank
          </FormLabel>
          <Switch
            id="full_tank"
            name="full_tank"
            isChecked={formik.values.full_tank}
            onChange={(e) =>
              formik.setFieldValue('full_tank', e.target.checked)
            }
          />
        </FormControl>

        {/* Odometer */}
        <FormControl
          isRequired
          isInvalid={formik.touched.mileage && !!formik.errors.mileage}
        >
          <FormLabel htmlFor="mileage">Odometer *</FormLabel>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            placeholder={`Last: ${formik.values.last_odometer || vehicle.mileage}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.mileage}
          />
          <FormHelperText>
            Last recorded: {formik.values.last_odometer || vehicle.mileage} {vehicle.mileage_unit}
          </FormHelperText>
          <FormErrorMessage>{formik.errors.mileage}</FormErrorMessage>
        </FormControl>

        {/* Date */}
        <FormControl>
          <FormLabel htmlFor="date">Date *</FormLabel>
          <Input
            id="date"
            name="date"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.date}
          />
        </FormControl>

        {/* Submit */}
        <ButtonGroup mt={4}>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            loadingText="Saving..."
          >
            {isEditMode ? 'Save Changes' : 'Add Fueling'}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </ButtonGroup>
      </VStack>
    </Box>
  );
};

export default FuelingForm;
```

### Delete Confirmation Modal

```typescript
// Pattern from DeleteVehicleModal.tsx
import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { toaster } from '../ui/toaster';

interface DeleteFuelingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fueling: {
    id: number;
    date: string;
    cost: number;
  };
  onDeleteSuccess: () => void;
}

const DeleteFuelingModal: React.FC<DeleteFuelingModalProps> = ({
  isOpen,
  onClose,
  fueling,
  onDeleteSuccess,
}) => {
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const resp = await fetch(`/api/fueling/${fueling.id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete fueling');
      }
      return resp.json();
    },
    onSuccess: () => {
      toaster.create({
        type: 'success',
        title: 'Fueling deleted',
        description: `Record from ${fueling.date} has been removed.`,
      });
      onClose();
      onDeleteSuccess();
    },
    onError: (error: Error) => {
      toaster.create({
        type: 'error',
        title: 'Failed to delete',
        description: error.message,
      });
    },
  });

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Fueling Record?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text mb={4}>
                Are you sure you want to delete the fueling record from{' '}
                <strong>{fueling.date}</strong> ({fueling.cost} {currency})?
              </Text>
              <Text color="red.600" fontSize="sm">
                This action cannot be undone. Vehicle statistics will be recalculated.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorScheme="red"
                onClick={() => deleteMutation.mutate()}
                loading={deleteMutation.isPending}
                loadingText="Deleting..."
              >
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
```

---

## State of the Art

| Old Approach              | Current Approach         | When Changed | Impact                                                    |
| ------------------------- | ------------------------ | ------------ | --------------------------------------------------------- |
| `useState` for forms      | `useFormik`              | 2020+        | Handles validation, dirty state, submission automatically |
| Manual pagination buttons | Infinite scroll          | 2022+        | Better UX for long lists, mobile-friendly                 |
| `moment.js`               | `date-fns`               | 2020+        | Tree-shakeable, smaller bundle, immutable                 |
| Direct localStorage       | Hook-based with debounce | 2022+        | Performance optimization, SSR safety                      |
| Scroll event listeners    | Intersection Observer    | 2020+        | Better performance, native browser API                    |

**Deprecated/outdated:**

- `moment.js` for date handling — use `date-fns` instead
- Manual page number pagination for user lists — use infinite scroll
- `validateOnChange: true` for fast-entry forms — use `validateOnBlur`

---

## Open Questions

1. **Partial tank visual styling**
   - What we know: Should be "subtle style difference" per context
   - What's unclear: Exact color choice (yellow? orange? dashed border?)
   - Recommendation: Use `colorScheme="orange"` with lighter background variant, or dashed left border

2. **Draft expiration**
   - What we know: Draft should save to localStorage
   - What's unclear: Should drafts expire after N days?
   - Recommendation: Add timestamp to draft, show "draft from 3 days ago" warning, allow user to discard

3. **Filter UI design**
   - What we know: Filter by month or date range required
   - What's unclear: Dropdown vs button group vs date range picker
   - Recommendation: Start with simple month selector (last 12 months dropdown), add date range later if needed

---

## Sources

### Primary (HIGH confidence)

- Prisma Schema (project) — Database structure
- Formik 2.4 docs — Form patterns, validation
- TanStack Query 5 docs — Infinite queries, pagination
- Chakra UI 3.x docs — Component APIs, FormControl patterns

### Secondary (MEDIUM confidence)

- react-intersection-observer docs — Infinite scroll trigger
- date-fns docs — Date formatting patterns
- Existing project components (`VehicleForm.tsx`, `DeleteVehicleModal.tsx`) — Established patterns

### Tertiary (LOW confidence)

- WebSearch results for "live form calculation patterns" — Validated against Formik docs
- Community patterns for draft persistence — Validated with localStorage API docs

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — Project dependencies already locked
- Architecture patterns: HIGH — Established Formik/TanStack Query patterns
- Pitfalls: HIGH — Documented from real issues and verified
- Code examples: HIGH — Based on existing project patterns

**Research date:** 2026-01-31
**Valid until:** 2026-04-30 (stable libraries, low change risk)

---

## Quick Reference for Planner

### Key Implementation Notes

1. **Form field order:** Cost → Liters → (calculated price) → Full tank toggle → Odometer → Date
2. **Validation:** On-blur only (`validateOnChange: false`)
3. **Infinite scroll:** 20 items per page, sorted by date DESC
4. **Draft key:** `fueling-draft-${vehicleId}`
5. **Month grouping:** Use `date-fns` `format(date, 'MMMM yyyy')` as group key
6. **Price precision:** 3 decimal places for per-liter, 2 for total
7. **Partial tank UI:** Orange tint or dashed border — final choice during implementation
