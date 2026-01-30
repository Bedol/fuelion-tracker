# Fuelion

## What This Is

Aplikacja webowa do śledzenia kosztów eksploatacji pojazdów. Użytkownicy mogą rejestrować tankowania, wydatki serwisowe, ubezpieczenia i inne opłaty związane z pojazdami. Aplikacja pokazuje statystyki i wykresy pomagające zrozumieć ile kosztuje utrzymanie auta.

Publiczna aplikacja — każdy może się zarejestrować przez Google OAuth.

## Core Value

**Szybkie dodawanie wpisów** — jeśli dodanie tankowania zajmuje więcej niż 30 sekund, użytkownik przestanie używać aplikacji.

## Requirements

### Validated

<!-- Inferred from existing codebase -->

- ✓ Autoryzacja Google OAuth — existing (NextAuth configured)
- ✓ Podstawowa struktura Next.js Pages Router — existing
- ✓ Połączenie z bazą PostgreSQL przez Prisma — existing
- ✓ Schema dla Vehicle i Fueling — existing

### Active

<!-- Current scope. Building toward these. -->

**Pojazdy:**

- [ ] Tworzenie pojazdu z danymi podstawowymi (marka, model, rok, rejestracja)
- [ ] Tworzenie pojazdu z danymi technicznymi (pojemność, moc, typ paliwa)
- [ ] Dodawanie zdjęcia pojazdu
- [ ] Lista pojazdów użytkownika
- [ ] Edycja i usuwanie pojazdu

**Wydatki — Tankowania:**

- [ ] Dodawanie tankowania (ilość, cena, przebieg, data)
- [ ] Lista tankowań dla pojazdu
- [ ] Edycja i usuwanie tankowania

**Wydatki — Serwis/naprawy:**

- [ ] Dodawanie wydatku serwisowego (typ, koszt, przebieg, data, opis)
- [ ] Lista wydatków serwisowych
- [ ] Edycja i usuwanie

**Wydatki — Ubezpieczenia:**

- [ ] Dodawanie ubezpieczenia (typ, koszt, okres ważności)
- [ ] Lista ubezpieczeń
- [ ] Przypomnienie o wygasającym ubezpieczeniu (v2?)

**Wydatki — Inne opłaty:**

- [ ] Dodawanie innych opłat (przegląd, parking, myjnia, opłaty drogowe)
- [ ] Lista innych opłat

**Statystyki i wykresy:**

- [ ] Wykres przebiegu miesięcznego
- [ ] Wykres kosztów tankowania i trendu cen paliwa
- [ ] Wykres zużycia paliwa (L/100km w czasie)
- [ ] Podsumowanie wszystkich kosztów per pojazd/miesiąc

**UI/UX:**

- [ ] Czytelna nawigacja między sekcjami
- [ ] Dashboard z podsumowaniem
- [ ] Proste, szybkie formularze
- [ ] Responsywność (mobile-first)

### Out of Scope

- Wiele walut — tylko PLN, upraszcza implementację
- Jednostki imperialne — tylko metryczne (km, litry)
- Eksport danych — może w przyszłości
- Powiadomienia push — zbyt skomplikowane na start
- Notatki tekstowe przy pojazdach — zdjęcie wystarczy
- API publiczne — tylko wewnętrzne API

## Context

**Stan istniejącego kodu:**

- Next.js 16.1.4 (Pages Router), TypeScript 5.9, React 19
- Chakra UI 3.x + Tailwind CSS 4.x (oba używane)
- TanStack React Query 5.x, Formik 2.x
- Prisma 7.x z PostgreSQL
- NextAuth 4.x z Google OAuth (skonfigurowane)
- Podstawowa struktura API dla vehicles i fueling istnieje
- Brak testów

**Podejście:**

- Zachowujemy setup (Next.js, Prisma, Auth)
- Logikę biznesową i UI budujemy od nowa
- Priorytet: UX dodawania wpisów musi być szybki i prosty

**Użytkownicy:**

- Typowy użytkownik: 3-5 pojazdów
- Publiczna aplikacja (każdy może się zarejestrować)

## Constraints

- **Waluta**: Tylko PLN — uproszczenie v1
- **Jednostki**: Tylko metryczne (km, litry) — docelowy rynek: Polska
- **Stack**: Zachowujemy istniejący (Next.js, Chakra, Prisma, NextAuth)
- **Auth**: Tylko Google OAuth — bez email/password
- **Hosting**: Vercel-compatible (domyślny setup Next.js)

## Key Decisions

| Decision                   | Rationale                             | Outcome   |
| -------------------------- | ------------------------------------- | --------- |
| Tylko Google OAuth         | Prostsze, bezpieczniejsze, mniej kodu | — Pending |
| Chakra UI + Tailwind razem | Już skonfigurowane, działające        | — Pending |
| Brak testów w v1           | Szybszy development, mała skala       | — Pending |
| PLN jako jedyna waluta     | Docelowy rynek: Polska                | — Pending |

---

_Last updated: 2026-01-30 after initialization_
