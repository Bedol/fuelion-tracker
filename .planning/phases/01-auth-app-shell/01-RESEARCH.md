# Phase 1: Auth & App Shell - Research

**Researched:** 2026-01-30
**Domain:** NextAuth.js 4.x authentication, Chakra UI 3.x layout, i18n patterns
**Confidence:** HIGH

## Summary

Phase 1 focuses on verifying and completing the existing NextAuth.js Google OAuth implementation, establishing a foundational app shell with responsive navigation (desktop top bar, mobile bottom bar), and implementing consistent loading/error states with internationalization support (Polish/English).

The existing NextAuth 4.24.13 setup uses JWT strategy with Google OAuth and Prisma adapter, which is production-ready. The standard approach is to verify session handling with `useSession()` hook, protect routes with session checks, and use `SessionProvider` at the app root. For the app shell, Chakra UI 3.31.0 provides layout primitives (Box, Flex, Stack) and feedback components (Skeleton, Toast, Spinner, Alert) that work well with responsive design patterns.

For internationalization in Next.js Pages Router, the recommended approach is using a library like `next-intl` or `next-i18next` for dictionary-based translations, or implementing a simpler custom solution with context and JSON dictionaries if requirements are minimal (Polish + English only).

**Primary recommendation:** Complete NextAuth session verification, build responsive layout shell with Chakra UI primitives, implement contextual loading/error patterns using existing components, and add lightweight i18n using React Context with JSON dictionaries.

## Standard Stack

### Core

| Library          | Version | Purpose                                  | Why Standard                                                                                    |
| ---------------- | ------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| next-auth        | 4.24.13 | OAuth authentication, session management | Industry standard for Next.js auth, handles OAuth flows, JWT/database sessions, CSRF protection |
| @chakra-ui/react | 3.31.0  | UI component library                     | Production-ready components with accessibility, responsive design, theming support              |
| next             | 16.1.4  | Framework (Pages Router)                 | Project already uses Pages Router, stable routing and API routes                                |
| react            | 19.2.3  | UI library                               | Latest stable React with concurrent features                                                    |

### Supporting

| Library        | Version | Purpose      | When to Use                                            |
| -------------- | ------- | ------------ | ------------------------------------------------------ |
| @prisma/client | 7.3.0   | Database ORM | Already configured for user/session storage            |
| framer-motion  | 12.28.1 | Animations   | Chakra UI peer dependency, powers component animations |
| react-icons    | 5.5.0   | Icon library | Comprehensive icon set for navigation, UI elements     |

### Alternatives Considered

| Instead of    | Could Use               | Tradeoff                                                         |
| ------------- | ----------------------- | ---------------------------------------------------------------- |
| next-auth     | NextAuth v5 (Auth.js)   | v5 is newer but breaking changes, v4 is stable and sufficient    |
| Custom i18n   | next-intl, next-i18next | Full i18n libraries add complexity for simple 2-language support |
| Chakra UI 3.x | Chakra UI v2, shadcn/ui | v2 is older, shadcn requires more setup, v3 is current           |

**Installation:**

```bash
# Core dependencies already installed
npm install next-auth@^4.24.13 @chakra-ui/react@^3.31.0

# For i18n (if choosing library approach)
# npm install next-i18next
```

## Architecture Patterns

### Recommended Project Structure

```
pages/
├── _app.tsx              # SessionProvider, ChakraProvider, i18n context
├── api/
│   └── auth/
│       └── [...nextauth].ts  # NextAuth config (exists)
├── auth/
│   └── signin.tsx        # Minimal sign-in page
└── [protected pages]     # Use session checks

components/
├── layout/
│   ├── Layout.tsx        # Main authenticated layout
│   ├── Navigation.tsx    # Responsive nav (desktop/mobile)
│   └── UserMenu.tsx      # Avatar dropdown with sign out
├── ui/
│   ├── Loading.tsx       # Spinner (exists)
│   ├── SkeletonLoader.tsx  # Skeleton screens for page loads
│   └── ErrorAlert.tsx    # Error display component
└── errors/
    └── FetchDataErrorAlert.tsx  # Exists, reuse or enhance

contexts/
└── LocaleContext.tsx     # Language switching (Polish/English)

lib/
├── prisma.ts             # Prisma client (exists)
└── i18n/
    ├── dictionaries/
    │   ├── pl.json       # Polish translations
    │   └── en.json       # English translations
    └── useDictionary.ts  # Hook to access translations
```

### Pattern 1: NextAuth Session Protection

**What:** Protect routes using `useSession` hook with `required: true` or `getServerSideProps` with `getServerSession`
**When to use:** Every authenticated page/route
**Example:**

```typescript
// Source: https://next-auth.js.org/getting-started/client#require-session
import { useSession } from "next-auth/react"

export default function ProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to sign-in or show message
      router.push('/auth/signin')
    },
  })

  if (status === "loading") {
    return <SkeletonLoader />
  }

  return <div>Protected content</div>
}
```

### Pattern 2: Responsive Navigation with Chakra UI

**What:** Use Chakra's `useBreakpointValue` or CSS media queries for adaptive navigation (top bar desktop, bottom bar mobile)
**When to use:** Navigation component that adapts between desktop and mobile
**Example:**

```typescript
// Source: Chakra UI responsive design patterns
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react"

export default function Navigation() {
  const isMobile = useBreakpointValue({ base: true, md: false })

  return isMobile ? (
    <Box position="fixed" bottom="0" width="full" bg="white" shadow="md">
      {/* Bottom navigation */}
    </Box>
  ) : (
    <Flex as="nav" position="sticky" top="0" width="full" bg="white" shadow="sm">
      {/* Top navigation */}
    </Flex>
  )
}
```

### Pattern 3: Toast Notifications for User Actions

**What:** Use Chakra UI's `toaster.create()` for action feedback (success/error)
**When to use:** After mutations (add, delete, update operations)
**Example:**

```typescript
// Source: https://www.chakra-ui.com/docs/components/toast
import { toaster } from '@/components/ui/toaster';

const handleSubmit = async () => {
	try {
		await mutation.mutateAsync(data);
		toaster.create({
			title: 'Success',
			description: 'Changes saved successfully',
			type: 'success',
		});
	} catch (error) {
		toaster.create({
			title: 'Error',
			description: error.message,
			type: 'error',
		});
	}
};
```

### Pattern 4: Skeleton Screens for Initial Loads

**What:** Use Chakra's `<Skeleton>` and `<SkeletonText>` for loading states during data fetch
**When to use:** Initial page load when fetching data
**Example:**

```typescript
// Source: https://www.chakra-ui.com/docs/components/skeleton
import { Skeleton, SkeletonText, Stack } from "@chakra-ui/react"

const { data, isPending } = useQuery({ queryKey: ['vehicles'], queryFn: fetchVehicles })

if (isPending) {
  return (
    <Stack gap="6">
      <Skeleton height="200px" />
      <SkeletonText noOfLines={3} />
    </Stack>
  )
}
```

### Pattern 5: Context-Based i18n

**What:** React Context provider that wraps app with language state and dictionary access
**When to use:** Simple 2-language support without complex routing
**Example:**

```typescript
// Custom implementation pattern
import { createContext, useContext, useState } from "react"

type Locale = 'pl' | 'en'

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}>()

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('pl')
  const [dict, setDict] = useState({})

  // Load dictionary based on locale
  useEffect(() => {
    import(`./dictionaries/${locale}.json`).then(setDict)
  }, [locale])

  const t = (key: string) => {
    // Access nested keys like "nav.vehicles"
    return key.split('.').reduce((obj, k) => obj?.[k], dict) || key
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => useContext(LocaleContext)
```

### Anti-Patterns to Avoid

- **Manual session management:** Don't build custom JWT handling when NextAuth provides it
- **Client-only auth checks:** Always verify session server-side for protected pages (use `getServerSession`)
- **Inline translations:** Don't hardcode strings in multiple places; use dictionary pattern
- **Layout shift on load:** Use skeleton screens to reserve space, avoid content jumping
- **Breaking existing components:** Existing `Layout.tsx`, `Loading.tsx`, `FetchDataErrorAlert.tsx` can be enhanced, not replaced

## Don't Hand-Roll

| Problem                | Don't Build                | Use Instead                  | Why                                                                    |
| ---------------------- | -------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| OAuth flows            | Custom Google OAuth        | NextAuth GoogleProvider      | Handles redirect URLs, token refresh, CSRF, state parameter validation |
| Session storage        | Custom JWT parsing         | NextAuth session callbacks   | Encrypted JWE, automatic rotation, cookie security policies            |
| i18n routing           | Custom locale routing      | React Context + dictionaries | Simple 2-language support doesn't need routing complexity              |
| Responsive breakpoints | Manual window.innerWidth   | Chakra's useBreakpointValue  | SSR-compatible, handles hydration, matches theme breakpoints           |
| Loading states         | Custom spinners everywhere | Chakra Skeleton/Spinner      | Accessible, themed, reduces layout shift                               |
| Toast queue management | Custom notification system | Chakra Toast (toaster)       | Handles stacking, positioning, timing, accessibility                   |

**Key insight:** NextAuth handles OAuth complexity (PKCE flow, token refresh, CSRF protection, session storage). Chakra UI handles responsive design, theming, and accessibility. Both are battle-tested for edge cases that custom solutions miss.

## Common Pitfalls

### Pitfall 1: Session Not Available in API Routes

**What goes wrong:** Using `useSession()` in API routes causes errors (client-side hook in server context)
**Why it happens:** `useSession` is React hook, API routes are server-only
**How to avoid:** Use `getServerSession(req, res, authOptions)` in API routes
**Warning signs:** "Invalid hook call" errors in API routes
**Example:**

```typescript
// WRONG
import { useSession } from 'next-auth/react';
export default function handler(req, res) {
	const session = useSession(); // Error!
}

// CORRECT
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions);
}
```

### Pitfall 2: Forgot SessionProvider Wrapper

**What goes wrong:** `useSession()` returns undefined/null even when authenticated
**Why it happens:** SessionProvider must wrap app in `_app.tsx` to provide context
**How to avoid:** Always wrap `<Component>` with `<SessionProvider session={pageProps.session}>`
**Warning signs:** Session always undefined, even after sign-in

### Pitfall 3: NEXTAUTH_URL Mismatch in Production

**What goes wrong:** OAuth redirect fails, "redirect_uri_mismatch" error
**Why it happens:** `NEXTAUTH_URL` doesn't match actual production URL
**How to avoid:** Set `NEXTAUTH_URL=https://yourdomain.com` in production env vars
**Warning signs:** Auth works locally but fails in production

### Pitfall 4: Using Client Components for Everything

**What goes wrong:** Unnecessary client JavaScript, slower page loads
**Why it happens:** Adding `"use client"` when not needed for interactivity
**How to avoid:** Only use `"use client"` for components with hooks (`useSession`, `useState`, etc.)
**Warning signs:** Large bundle size, slow hydration

### Pitfall 5: Hard-Coding Strings Before i18n Setup

**What goes wrong:** Need to find and replace all strings when adding translations
**Why it happens:** Writing UI text directly in JSX without dictionary pattern
**How to avoid:** From Phase 1, use `t('key')` pattern even if dictionary is minimal
**Warning signs:** Strings scattered across components in multiple files

### Pitfall 6: Not Handling Mobile Navigation State

**What goes wrong:** Mobile bottom nav shows on desktop, or vice versa
**Why it happens:** Not testing responsive behavior, breakpoint logic errors
**How to avoid:** Use Chakra's breakpoint utilities, test at different viewports
**Warning signs:** Navigation appears in wrong position on resize

## Code Examples

### NextAuth Configuration (Verify Existing)

```typescript
// Source: https://next-auth.js.org/configuration/options
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

export const authOptions = {
	session: {
		strategy: 'jwt', // Existing setup
	},
	adapter: PrismaAdapter(prisma), // Existing
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (session?.user) {
				session.user.id = Number(token.sub);
			}
			return session;
		},
	},
	pages: {
		signIn: '/auth/signin', // Custom sign-in page
	},
};

export default NextAuth(authOptions);
```

### SessionProvider Setup in \_app.tsx

```typescript
// Source: https://next-auth.js.org/getting-started/client#sessionprovider
// pages/_app.tsx
import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from "@chakra-ui/react"
import { LocaleProvider } from "@/contexts/LocaleContext"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <LocaleProvider>
          <Component {...pageProps} />
        </LocaleProvider>
      </ChakraProvider>
    </SessionProvider>
  )
}
```

### Protected Page Pattern

```typescript
// Pattern from NextAuth docs + React Query
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import Layout from "@/components/layout/Layout"
import SkeletonLoader from "@/components/ui/SkeletonLoader"
import ErrorAlert from "@/components/ui/ErrorAlert"

export default function VehiclesPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/signin')
    },
  })

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    enabled: !!session, // Only fetch when authenticated
  })

  if (status === "loading" || isPending) {
    return <Layout><SkeletonLoader /></Layout>
  }

  if (isError) {
    return <Layout><ErrorAlert error={error} /></Layout>
  }

  return (
    <Layout>
      {/* Vehicle list */}
    </Layout>
  )
}
```

### Minimal Sign-In Page

```typescript
// pages/auth/signin.tsx
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Box, Button, Heading, Stack } from "@chakra-ui/react"
import { FaGoogle } from "react-icons/fa"
import { useEffect } from "react"

export default function SignIn() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      router.push('/') // Redirect to home if already signed in
    }
  }, [session, router])

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Stack gap="6" align="center">
        <Heading>Fuelion</Heading>
        <Button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          leftIcon={<FaGoogle />}
          colorScheme="blue"
          size="lg"
        >
          Sign in with Google
        </Button>
      </Stack>
    </Box>
  )
}
```

### Responsive Navigation Component

```typescript
// components/layout/Navigation.tsx
import { Box, Flex, Button, Avatar, Menu } from "@chakra-ui/react"
import { useSession, signOut } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { FaCar, FaChartBar } from "react-icons/fa"
import { useLocale } from "@/contexts/LocaleContext"

export default function Navigation() {
  const { data: session } = useSession()
  const { locale, setLocale, t } = useLocale()
  const router = useRouter()

  const isActive = (path: string) => router.pathname === path

  // Desktop: top bar
  // Mobile: bottom bar (useBreakpointValue or CSS media queries)

  return (
    <>
      {/* Desktop top navigation */}
      <Box
        as="nav"
        position="sticky"
        top="0"
        width="full"
        bg="white"
        shadow="sm"
        zIndex="sticky"
        display={{ base: 'none', md: 'block' }}
      >
        <Flex maxW="1200px" mx="auto" px="6" py="4" justify="space-between" align="center">
          <Flex gap="6" align="center">
            <Heading size="md">Fuelion</Heading>
            <Button
              as={NextLink}
              href="/vehicles"
              variant={isActive('/vehicles') ? 'solid' : 'ghost'}
              leftIcon={<FaCar />}
            >
              {t('nav.vehicles')}
            </Button>
            <Button
              as={NextLink}
              href="/statistics"
              variant={isActive('/statistics') ? 'solid' : 'ghost'}
              leftIcon={<FaChartBar />}
            >
              {t('nav.statistics')}
            </Button>
          </Flex>
          <Flex gap="4" align="center">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setLocale(locale === 'pl' ? 'en' : 'pl')}
            >
              {locale === 'pl' ? 'EN' : 'PL'}
            </Button>
            <Menu.Root>
              <Menu.Trigger asChild>
                <Avatar name={session?.user?.name} src={session?.user?.image} size="sm" cursor="pointer" />
              </Menu.Trigger>
              <Menu.Content>
                <Menu.Item value="signout" onClick={() => signOut()}>
                  {t('nav.signOut')}
                </Menu.Item>
              </Menu.Content>
            </Menu.Root>
          </Flex>
        </Flex>
      </Box>

      {/* Mobile bottom navigation */}
      <Box
        position="fixed"
        bottom="0"
        width="full"
        bg="white"
        shadow="md"
        zIndex="sticky"
        display={{ base: 'block', md: 'none' }}
      >
        <Flex justify="space-around" py="3">
          <Button
            as={NextLink}
            href="/vehicles"
            variant={isActive('/vehicles') ? 'solid' : 'ghost'}
            flexDirection="column"
            height="auto"
            py="2"
          >
            <FaCar size="20" />
            <Box fontSize="xs" mt="1">{t('nav.vehicles')}</Box>
          </Button>
          <Button
            as={NextLink}
            href="/statistics"
            variant={isActive('/statistics') ? 'solid' : 'ghost'}
            flexDirection="column"
            height="auto"
            py="2"
          >
            <FaChartBar size="20" />
            <Box fontSize="xs" mt="1">{t('nav.statistics')}</Box>
          </Button>
        </Flex>
      </Box>
    </>
  )
}
```

### Skeleton Loader Component

```typescript
// components/ui/SkeletonLoader.tsx
import { Stack, Skeleton, SkeletonText, Box } from "@chakra-ui/react"

type SkeletonLoaderProps = {
  type?: 'page' | 'list' | 'card'
}

export default function SkeletonLoader({ type = 'page' }: SkeletonLoaderProps) {
  if (type === 'list') {
    return (
      <Stack gap="4">
        {[1, 2, 3].map((i) => (
          <Box key={i} p="4" borderWidth="1px" borderRadius="md">
            <Skeleton height="20px" width="60%" mb="2" />
            <SkeletonText noOfLines={2} />
          </Box>
        ))}
      </Stack>
    )
  }

  if (type === 'card') {
    return (
      <Box p="4" borderWidth="1px" borderRadius="md">
        <Skeleton height="150px" mb="4" />
        <SkeletonText noOfLines={3} />
      </Box>
    )
  }

  // Default page skeleton
  return (
    <Stack gap="6" maxW="1200px" mx="auto">
      <Skeleton height="40px" width="300px" />
      <Skeleton height="200px" />
      <SkeletonText noOfLines={4} />
    </Stack>
  )
}
```

### Enhanced Error Alert

```typescript
// components/ui/ErrorAlert.tsx
import { Alert, Box, Button, Collapsible } from "@chakra-ui/react"
import { useState } from "react"
import { useLocale } from "@/contexts/LocaleContext"

type ErrorAlertProps = {
  error: Error | { message: string }
  title?: string
}

export default function ErrorAlert({ error, title }: ErrorAlertProps) {
  const [showDetails, setShowDetails] = useState(false)
  const { t } = useLocale()

  return (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Box flex="1">
        <Alert.Title>{title || t('errors.generic')}</Alert.Title>
        <Alert.Description>
          {error.message || t('errors.tryAgain')}
        </Alert.Description>
        {error.stack && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDetails(!showDetails)}
              mt="2"
            >
              {showDetails ? t('errors.hideDetails') : t('errors.showDetails')}
            </Button>
            <Collapsible.Root open={showDetails}>
              <Collapsible.Content>
                <Box
                  as="pre"
                  fontSize="xs"
                  p="2"
                  bg="gray.100"
                  borderRadius="md"
                  overflow="auto"
                  mt="2"
                >
                  {error.stack}
                </Box>
              </Collapsible.Content>
            </Collapsible.Root>
          </>
        )}
      </Box>
    </Alert.Root>
  )
}
```

## State of the Art

| Old Approach             | Current Approach        | When Changed | Impact                                                                                  |
| ------------------------ | ----------------------- | ------------ | --------------------------------------------------------------------------------------- |
| NextAuth v3              | NextAuth v4             | 2021         | JWT strategy as default, improved TypeScript support, removed implicit database adapter |
| Chakra UI v2             | Chakra UI v3            | 2024         | New component API, Ark UI integration, improved performance                             |
| Manual i18n              | next-i18next, next-intl | 2019+        | Standardized dictionary pattern, SSR support                                            |
| Custom responsive hooks  | useBreakpointValue      | Chakra v1+   | SSR-compatible, no hydration mismatch                                                   |
| Separate toast libraries | Built-in Chakra Toast   | Chakra v2+   | Integrated with theme, accessibility built-in                                           |

**Deprecated/outdated:**

- **NextAuth database sessions as default:** JWT strategy is now default (faster, no DB queries per request)
- **Chakra v2 API:** v3 uses new component composition patterns, different prop names
- **Manual cookie handling:** NextAuth handles all cookie security automatically

## Open Questions

1. **Interim landing page (Phase 1-4)**
   - What we know: Dashboard is Phase 5, sign-in redirects need a landing page before then
   - What's unclear: Should it be empty placeholder, redirect to Vehicles, or simple welcome screen?
   - Recommendation: Redirect to `/vehicles` as default landing, add Dashboard route placeholder that shows "Coming soon"

2. **Existing Layout.tsx component usage**
   - What we know: Current `Layout.tsx` uses Header + Sidebar pattern
   - What's unclear: Does it conflict with new responsive navigation design (top/bottom bars)?
   - Recommendation: Enhance existing Layout to accept navigation variant, or create new AuthenticatedLayout component

3. **Mobile breakpoint for navigation switch**
   - What we know: Desktop top bar, mobile bottom bar
   - What's unclear: Exact breakpoint (768px? 900px?) and whether tablet should use mobile or desktop pattern
   - Recommendation: Use Chakra's `md` breakpoint (768px), tablets get bottom bar (touch-friendly)

4. **Sign out redirect behavior**
   - What we know: User can sign out from any page
   - What's unclear: Should redirect to sign-in page or public landing page?
   - Recommendation: Redirect to `/auth/signin` with message "You have been signed out"

## Sources

### Primary (HIGH confidence)

- NextAuth.js v4 official documentation - https://next-auth.js.org/getting-started/introduction (accessed 2026-01-30)
- NextAuth.js Configuration Options - https://next-auth.js.org/configuration/options (accessed 2026-01-30)
- NextAuth.js Client API - https://next-auth.js.org/getting-started/client (accessed 2026-01-30)
- Chakra UI v3 Components - https://www.chakra-ui.com/docs/components/ (accessed 2026-01-30)
- Chakra UI Skeleton - https://www.chakra-ui.com/docs/components/skeleton (accessed 2026-01-30)
- Chakra UI Toast - https://www.chakra-ui.com/docs/components/toast (accessed 2026-01-30)
- Next.js Pages Router i18n - https://nextjs.org/docs/pages/building-your-application/routing/internationalization (accessed 2026-01-30)
- Existing codebase: pages/api/auth/[...nextauth].ts, package.json, components/Layout.tsx, components/Loading.tsx

### Secondary (MEDIUM confidence)

- Next.js i18n libraries comparison (next-intl, next-i18next) - from official Next.js docs resources section
- Chakra UI responsive design patterns - inferred from component API documentation
- React Context pattern for lightweight i18n - standard React pattern, widely documented

### Tertiary (LOW confidence)

- None - all research based on official documentation and existing code inspection

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All libraries installed and versions verified in package.json
- Architecture: HIGH - NextAuth and Chakra patterns documented in official sources
- Pitfalls: HIGH - Common issues documented in NextAuth troubleshooting, Chakra migration guides

**Research date:** 2026-01-30
**Valid until:** 2026-03-01 (30 days - stable libraries, mature ecosystem)
