# Fuelion

## What This Is

Aplikacja webowa do sledzenia kosztow eksploatacji pojazdow.
Wersja v1.0 dostarcza komplet: logowanie Google, zarzadzanie pojazdami,
tankowania, statystyki oraz dashboard z ostatnia aktywnoscia.

Publiczna aplikacja - kazdy moze sie zarejestrowac przez Google OAuth.

## Current State

- Shipped version: **v1.0 MVP** (2026-02-11)
- Milestone coverage: **26/26 v1 requirements complete**
- Delivery scope: **11 phases, 41 plans, 87 tasks**
- Planning archives:
  - `.planning/milestones/v1.0-ROADMAP.md`
  - `.planning/milestones/v1.0-REQUIREMENTS.md`
  - `.planning/milestones/v1.0-MILESTONE-AUDIT.md`

## Core Value

**Szybkie dodawanie wpisow** - jesli dodanie tankowania zajmuje wiecej niz
30 sekund, uzytkownik przestanie uzywac aplikacji.

## Requirements

### Validated

- ✓ AUTH-01..AUTH-04 - pelny przeplyw autoryzacji i redirectow (v1.0)
- ✓ VEHI-01..VEHI-06 - pelny CRUD pojazdow i widok szczegolow (v1.0)
- ✓ FUEL-01..FUEL-06 - pelny CRUD tankowan + smart defaults (v1.0)
- ✓ STAT-01..STAT-04 - statystyki spalania, kosztow i podsumowan (v1.0)
- ✓ UIUX-01..UIUX-06 - nawigacja, dashboard, feedback i stany ladowania (v1.0)

### Active (next milestone candidates)

- [ ] PHOT-01/PHOT-02 - dodawanie i wyswietlanie zdjec pojazdu
- [ ] EXPN-01..EXPN-04 - wydatki serwisowe, ubezpieczenia i inne oplaty
- [ ] ADVS-01/ADVS-02/ADVS-03 - zaawansowane statystyki i eksport CSV
- [ ] RESP-01/RESP-02 - dopracowanie mobile UX i touch controls
- [ ] SMRT-01..SMRT-03 - bardziej inteligentne domyslne wartosci i przypomnienia

### Out of Scope (still valid)

- Wiele walut - tylko PLN
- Jednostki imperialne - tylko metryczne (km, litry)
- API publiczne - tylko wewnetrzne API
- GPS tracking / OBD-II / OCR paragonow - zbyt duza zlozonosc na obecny etap

## Next Milestone Goals

1. Zdefiniowac nowy zakres biznesowy (`/gsd-new-milestone`).
2. Ustalic nowe `.planning/REQUIREMENTS.md` pod kolejna wersje.
3. Przeanalizowac tech debt z audytu v1.0 i zdecydowac co wlaczyc do v1.1.

## Context

**Stan kodu po v1.0:**

- Next.js 16.1.4 (Pages Router), TypeScript, React 19
- Chakra UI 3.x + Tailwind CSS 4.x
- TanStack Query + Formik
- Prisma + PostgreSQL
- NextAuth (Google OAuth)
- Brak frameworka testowego (manual verification artifacts used)

**Known non-blocking debt after v1.0:**

- Ujednolicenie error envelope API
- Dodatkowe invalidation dla `['lastFueling', vehicleId]`
- Finalny runtime matrix (2 konta) dla ownership edge cases
- Cleanup legacy pustych katalogow faz

## Constraints

- **Waluta**: Tylko PLN
- **Jednostki**: Tylko metryczne (km, litry)
- **Stack**: Next.js + Chakra + Prisma + NextAuth
- **Auth**: Tylko Google OAuth
- **Hosting**: Vercel-compatible

## Key Decisions

| Decision                      | Rationale                                             | Outcome          |
| ----------------------------- | ----------------------------------------------------- | ---------------- |
| Google OAuth only             | Prostota i mniejsza powierzchnia bezpieczenstwa       | ✓ Good (v1.0)    |
| Chakra UI + Tailwind razem    | Szybsza iteracja UI w istniejacym stacku              | ✓ Good (v1.0)    |
| Fueling UX priorytetem        | Core value oparty o czas wpisu do 30 sekund           | ✓ Good (v1.0)    |
| Gap-closure phases 6-11       | Bezpieczne domkniecie audytow bez destabilizacji core | ✓ Good (v1.0)    |
| Manual verification artifacts | Brak test harnessu, potrzeba dowodow runtime          | ⚠ Revisit (v1.1) |

---

_Last updated: 2026-02-11 after v1.0 milestone completion_
