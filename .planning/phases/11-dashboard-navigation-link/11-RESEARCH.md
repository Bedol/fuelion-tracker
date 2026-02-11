# Phase 11: Dashboard Navigation Link - Research

**Researched:** 2026-02-11  
**Scope:** Restore dashboard/home navigation from statistics flows using locked decisions in `11-CONTEXT.md`  
**Confidence:** HIGH (repo code inspection)

## Current patterns

- **Primary nav owner:** `components/layout/Navigation.tsx` renders both desktop top bar and mobile bottom bar.
- **Layout wrapper:** `components/layout/AuthenticatedLayout.tsx` always renders `Navigation` for authenticated users and adds mobile bottom padding (`pb={{ base: '20', md: '6' }}`).
- **Global injection point:** `pages/_app.tsx` wraps every page with `components/Layout.tsx`; `components/Layout.tsx` only shows authenticated nav when `useSession()` has `session`.
- **Desktop nav today:** fuelion wordmark is plain `Heading` (not clickable), nav buttons are currently Vehicles + Statistics.
- **Mobile nav today:** bottom bar has Vehicles + Statistics tabs only.
- **Statistics surfaces today:**
  - `pages/statistics/index.tsx` has heading/placeholder copy only, no dashboard action.
  - `pages/vehicles/[id]/statistics.tsx` top actions currently are `Add Fueling` + `Back to Vehicle`.

## Integration points

- **Desktop top nav changes:**
  - Add Dashboard as first item in desktop nav button list in `components/layout/Navigation.tsx`.
  - Make logo/home text clickable to `/` in the same file (locked decision: logo click returns dashboard).
- **Mobile bottom nav changes:**
  - Add persistent Dashboard tab in `components/layout/Navigation.tsx` using same bottom-tab visual treatment as existing tabs.
- **Statistics page CTA changes:**
  - `pages/statistics/index.tsx`: add top secondary action button (`Go to Dashboard`) and keep it visible in current empty/placeholder state.
  - `pages/vehicles/[id]/statistics.tsx`: add top secondary action button to `/` in the existing actions row; keep it outside data-conditional sections so it remains visible during empty/error/loading states.
- **Auth/redirect behavior:**
  - Keep existing auth behavior unchanged (`useSession({ required: true })` + current sign-in redirects).

## Recommended keys/copy

- **Current i18n pattern:** dot-notation keys via `useLocale().t()` with dictionaries in `lib/i18n/dictionaries/en.json` and `lib/i18n/dictionaries/pl.json`.
- **Existing nav namespace:** `nav.vehicles`, `nav.statistics`, `nav.signOut`, `nav.signIn`.
- **Exact recommended new keys:**

| Key                        | EN                | PL                   | Why                                                           |
| -------------------------- | ----------------- | -------------------- | ------------------------------------------------------------- |
| `nav.dashboard`            | `Dashboard`       | `Pulpit`             | Shared label for desktop + mobile nav; matches locked wording |
| `statistics.goToDashboard` | `Go to Dashboard` | `Przejdź do pulpitu` | Dedicated stats CTA text per locked decision                  |

- **Copy consistency rule:** use `t('nav.dashboard')` for nav labels/logo semantics and `t('statistics.goToDashboard')` for stats CTA text everywhere.

## Icon conventions and recommendation

- **Current convention:** app uses `react-icons/fa` (`FaCar`, `FaChartBar`, `FaGasPump`), with icon + text in navigation buttons.
- **Best match for Dashboard/Home:** `FaHome` (already used in legacy `components/Sidebar.tsx`, aligns with app icon family and user expectation).
- **Consistency guidance:** use the same `FaHome` for desktop Dashboard item, mobile Dashboard tab, and statistics CTA.

## Risks and pitfalls

- **Active-route pitfall:** current `isActive` checks exact pathname equality (`router.pathname === path`), so nested routes do not highlight parent tabs. Adding Dashboard should not change this behavior unless intentionally improved.
- **Visibility pitfall on stats pages:** if CTA is placed inside `statistics && (...)` blocks in vehicle stats, it disappears on loading/error/no-data states (violates locked behavior).
- **Clickable logo pitfall:** current logo is a plain `Heading`; forgetting to wrap/link it leaves one locked requirement unmet.
- **Duplicate nav component confusion:** `components/Navigation.tsx` and `components/Sidebar.tsx` exist but are not the active layout path; phase should modify `components/layout/Navigation.tsx` only.
- **Localization pitfall:** several stats strings are hardcoded English; ensure new dashboard labels/buttons still use translation keys consistently even if surrounding text is not yet localized.

## Verification guidance

### Execution checklist

- Update desktop and mobile nav in `components/layout/Navigation.tsx`.
- Add translation keys to both dictionaries:
  - `lib/i18n/dictionaries/en.json`
  - `lib/i18n/dictionaries/pl.json`
- Add dashboard CTA on both statistics surfaces:
  - `pages/statistics/index.tsx`
  - `pages/vehicles/[id]/statistics.tsx`
- Keep CTA button variant secondary (e.g., `variant='outline'` or existing secondary style equivalent).

### Human verification checklist

- **Desktop:** Dashboard is first nav item; clicking it navigates immediately to `/`; logo click also navigates to `/`.
- **Mobile:** bottom bar always shows Dashboard tab with standard style; tap navigates immediately to `/`.
- **Stats global page (`/statistics`):** `Go to Dashboard` action is visible and works even in placeholder/empty state.
- **Vehicle stats page (`/vehicles/:id/statistics`):** `Go to Dashboard` action is visible at top and works regardless of loading/error/no-data chart states.
- **Locale:** EN shows `Dashboard` / `Go to Dashboard`; PL shows `Pulpit` / `Przejdź do pulpitu`.
- **Unauthenticated access:** behavior remains existing redirect/sign-in flow (no new custom guard logic).

Ready for planning.

Suggested split (max 2 plans):

1. **Plan A - Navigation surfaces:** desktop first-item Dashboard + clickable logo + mobile persistent Dashboard tab (+ icon parity).
2. **Plan B - Statistics return flow + i18n + QA:** add top dashboard CTA on both stats pages, wire translation keys, run manual cross-device/locale verification.
