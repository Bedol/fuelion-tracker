# Features Research: Vehicle Expense Tracking

**Domain:** Vehicle expense/fuel tracking application
**Researched:** 2026-01-30
**Confidence:** MEDIUM (based on competitor app store listings, real user reviews, and direct feature inspection)

## Summary

The vehicle expense tracking space is mature with established players (Fuelio 5M+ downloads, Drivvo 1M+, aCar 1M+, Spritmonitor 850K+ users). Users expect rapid data entry, comprehensive fuel consumption tracking, and clear cost visualization. The differentiating features that generate positive reviews focus on: ease of use, cloud sync without subscription fees, receipt scanning, and intelligent reminders. Common complaints center on: subscription fatigue, cluttered UIs, and missing recurring expense features. For Fuelion targeting Polish users with 3-5 vehicles and 30-second fueling entry, the core value proposition aligns well with market expectations.

## Table Stakes (Must Have)

Features users expect. Missing these = users leave immediately or rate poorly.

### Core Data Entry

| Feature                       | Why Expected                                 | Complexity | Notes                                                                             |
| ----------------------------- | -------------------------------------------- | ---------- | --------------------------------------------------------------------------------- |
| **Quick fueling entry**       | Core use case - users do this at gas station | Medium     | Fuelio's strength. Must capture: date, odometer, quantity, total cost, price/unit |
| **Partial fill-up support**   | Real-world scenario (prepay, low budget)     | Low        | Affects consumption calculation - must flag these entries                         |
| **Full tank algorithm**       | Only way to accurately calculate consumption | Low        | Industry standard: L/100km calculated between full tank fill-ups                  |
| **Multiple vehicles**         | Target users have 3-5 vehicles               | Low        | Already in schema - just needs UI polish                                          |
| **Date & odometer per entry** | Fundamental tracking                         | Low        | Already implemented                                                               |
| **Fuel type tracking**        | Different consumption characteristics        | Low        | Already in schema (Benzine, Diesel, LPG, EV)                                      |

### Cost Tracking

| Feature                          | Why Expected                              | Complexity | Notes                                                            |
| -------------------------------- | ----------------------------------------- | ---------- | ---------------------------------------------------------------- |
| **Non-fuel expense categories**  | Insurance, service, parking, tolls, fines | Low        | Schema has Expense model with type_id - needs category expansion |
| **Service/maintenance logging**  | Users track oil changes, tire swaps       | Low        | Fits in Expense model                                            |
| **Cost per category breakdown**  | See where money goes                      | Medium     | Aggregate queries + visualization                                |
| **Total cost of ownership view** | Understand full vehicle cost              | Medium     | Sum all expense types over time                                  |

### Statistics & Visualization

| Feature                                | Why Expected                      | Complexity | Notes                                  |
| -------------------------------------- | --------------------------------- | ---------- | -------------------------------------- |
| **Average fuel consumption (L/100km)** | Primary metric users care about   | Low        | Core calculation from fueling data     |
| **Cost per km/month/year**             | Budget planning                   | Low        | Aggregate calculations                 |
| **Consumption trend chart**            | See if efficiency degrades        | Medium     | Chart.js or similar                    |
| **Monthly cost chart**                 | Budget visualization              | Medium     | Already have statistics page to extend |
| **Fill-up history list**               | Review past entries, catch errors | Low        | Basic CRUD list                        |

### Data Management

| Feature                 | Why Expected                               | Complexity | Notes                                    |
| ----------------------- | ------------------------------------------ | ---------- | ---------------------------------------- |
| **Edit/delete entries** | Correct mistakes                           | Low        | Basic CRUD                               |
| **Data export (CSV)**   | Users want to own their data, tax purposes | Low        | Simple API endpoint                      |
| **Cloud backup**        | Don't lose years of data                   | Medium     | Already have auth - add backup mechanism |

### Mobile Experience

| Feature                   | Why Expected                                | Complexity | Notes                                        |
| ------------------------- | ------------------------------------------- | ---------- | -------------------------------------------- |
| **Responsive design**     | Most entries happen at gas station on phone | Medium     | Chakra UI helps, but needs careful attention |
| **Large touch targets**   | Pumping gas, gloves, cold hands             | Low        | UI consideration                             |
| **Offline-capable entry** | Gas stations may have poor signal           | High       | Requires service worker, IndexedDB           |

## Differentiators (Nice to Have)

Features that make Fuelion stand out. Competitors charge for many of these.

### Speed & Convenience

| Feature                          | Value Proposition                                       | Complexity | Why Differentiating                              |
| -------------------------------- | ------------------------------------------------------- | ---------- | ------------------------------------------------ |
| **Smart defaults**               | Pre-fill last station, current date, estimated odometer | Low        | Fuelio users love this. Reduces entry to <30 sec |
| **Favorite stations memory**     | One-tap station selection                               | Low        | Already in User schema (favorite_station)        |
| **Recent values quick-fill**     | Use same price/station as last time                     | Low        | Huge time saver at regular station               |
| **Receipt photo scanning (OCR)** | Auto-extract data from receipt                          | High       | Fuelio added this recently - praised in reviews  |
| **Voice entry**                  | Hands-free at gas pump                                  | High       | Defer to v2                                      |

### Polish Market Specific

| Feature                         | Value Proposition                  | Complexity | Why Differentiating                       |
| ------------------------------- | ---------------------------------- | ---------- | ----------------------------------------- |
| **PLN-only focus**              | No currency conversion confusion   | Low        | Simplify UX vs multi-currency competitors |
| **Polish gas station database** | Orlen, BP, Shell, Circle K presets | Low        | Faster entry than typing                  |
| **Polish region defaults**      | Voivodeship selection              | Low        | Already in User schema (default_region)   |

### Multi-Vehicle Households

| Feature                       | Value Proposition                   | Complexity | Why Differentiating                          |
| ----------------------------- | ----------------------------------- | ---------- | -------------------------------------------- |
| **Vehicle photos**            | Quick visual identification         | Low        | Target: 3-5 vehicles need visual distinction |
| **Per-vehicle dashboard**     | See each vehicle's health at glance | Medium     | Not just a list - summary cards              |
| **Household total cost view** | All vehicles combined cost tracking | Medium     | Unique for multi-vehicle users               |
| **Vehicle comparison**        | Which car is cheapest to run?       | Medium     | Side-by-side efficiency stats                |

### Reminders & Alerts

| Feature                               | Value Proposition                        | Complexity | Why Differentiating                    |
| ------------------------------------- | ---------------------------------------- | ---------- | -------------------------------------- |
| **Service reminders (date-based)**    | Insurance renewal, inspection due        | Medium     | Fuelio has this, users love it         |
| **Service reminders (mileage-based)** | Oil change at 15,000 km                  | Medium     | More complex - needs odometer tracking |
| **Consumption anomaly alert**         | "Your car used 20% more fuel than usual" | Medium     | Early warning for problems             |

### Data Insights

| Feature                           | Value Proposition                                    | Complexity | Why Differentiating            |
| --------------------------------- | ---------------------------------------------------- | ---------- | ------------------------------ |
| **A/C impact tracking**           | Already in schema - show how A/C affects consumption | Low        | Fuelio has this, underutilized |
| **Seasonal consumption patterns** | Winter vs summer efficiency                          | Medium     | Interesting insight for users  |
| **Fuel price trends**             | Track price changes at your stations                 | Medium     | Useful for timing fill-ups     |

### No-Subscription Model

| Feature               | Value Proposition                                   | Complexity | Why Differentiating              |
| --------------------- | --------------------------------------------------- | ---------- | -------------------------------- |
| **All features free** | Drivvo/aCar users complain about subscription creep | Low        | Business decision, not technical |
| **No ads**            | Clean experience                                    | Low        | Business decision                |

## Anti-Features (Don't Build in v1)

Features to deliberately exclude. Common scope creep traps.

| Anti-Feature                        | Why Exclude                                                 | Risk if Included                                     |
| ----------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| **Gas station price crowdsourcing** | Massive infrastructure need, data freshness problem         | Maintenance burden, inaccurate data frustrates users |
| **Trip GPS tracking**               | Fuelio has it, but battery drain, privacy concerns, complex | Scope explosion, battery complaints                  |
| **Fleet management**                | Different user segment, complex permissions                 | Over-engineering for target users                    |
| **Multiple currencies**             | Target is Polish users, PLN only per spec                   | UI complexity, conversion bugs                       |
| **OBD-II integration**              | Hardware dependency, compatibility issues                   | Support nightmare                                    |
| **Social features**                 | Share stats with friends, leaderboards                      | Low value, privacy concerns, moderation burden       |
| **AI fuel price predictions**       | Unreliable, builds false expectations                       | Users blame app when predictions wrong               |
| **Import from other apps**          | aCar supports many imports - massive effort                 | Edge cases, data format hell                         |
| **Multi-language**                  | Polish users only for v1                                    | Translation maintenance                              |
| **Bi-fuel/dual tank vehicles**      | Fuelio supports LPG+Petrol combos                           | Complex data model, edge cases                       |
| **Hour meter for equipment**        | Drivvo added for boats/tractors                             | Scope creep beyond cars                              |
| **Driver management**               | Fleet feature, wrong segment                                | Over-engineering                                     |
| **Recurring expenses auto-entry**   | Drivvo review: "been requesting for 2 years"                | Complex scheduling system                            |

## Competitor Analysis

| App                 | Strengths                                                                                         | Weaknesses                                                                     | Key Feature                                  | Rating           |
| ------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------- | ---------------- |
| **Fuelio** (Sygic)  | Most comprehensive, bi-fuel support, receipt scanning, widgets, weather integration, GPS trip log | Complex UI, Polish translation could be better                                 | Full tank consumption algorithm + cloud sync | 4.7/5 (133K)     |
| **Drivvo**          | Clean UI, fleet management, checklists, routes                                                    | Subscription increased ($6 to $25/yr), no recurring expenses, slower updates   | Fleet management + driver tracking           | 4.7/5 (112K)     |
| **aCar** (Fuelly)   | Massive import support, cross-platform sync, widgets, parts tracking                              | Outdated UI ("early 2000s"), bugs since Fuelly acquisition, subscription model | Fuelly.com web integration                   | 2.2/5 (21K)      |
| **Spritmonitor.de** | Web-first, huge database, community MPG comparisons                                               | German-focused, dated interface                                                | Real-world MPG database                      | N/A (855K users) |
| **Fuelly.com**      | Web platform, community data, simple                                                              | No native app (via aCar), basic features                                       | Community MPG comparison                     | N/A (711K users) |

### Key Takeaways from Competitors

1. **Fuelio is the gold standard** - Most features, best reviews. But complex.
2. **Subscription fatigue is real** - Drivvo/aCar users complaining about price jumps
3. **Simple wins** - Users praise "clean design", "no bloat"
4. **Cloud sync is table stakes** - But free cloud sync is differentiator
5. **Receipt scanning is hot** - Fuelio just added, getting praise
6. **Reminders are loved** - Both date and mileage based

## Feature Dependencies

```
Core Foundation (Must build first)
├── Vehicle CRUD with photos
│   └── Per-vehicle dashboard
│       └── Vehicle comparison
├── Fueling entry (quick, <30 sec)
│   ├── Smart defaults (station, date, odometer estimate)
│   ├── Full tank algorithm
│   └── Partial fill-up support
├── Expense entry (categories)
│   └── Cost breakdown by category
└── Basic statistics
    ├── L/100km calculation
    ├── Cost per km/month
    └── Charts (consumption, costs)

Second Layer (After foundation)
├── Data export (CSV)
├── Date-based reminders
│   └── Mileage-based reminders (needs odometer tracking)
├── Fill-up history with edit/delete
└── Mobile-optimized responsive UI

Third Layer (Differentiators)
├── Household total cost view
├── Consumption anomaly detection
└── Receipt photo storage (manual first, OCR later)

Future (v2+)
├── Offline mode with sync
├── Receipt OCR
├── Voice entry
└── Seasonal pattern analysis
```

## Recommended v1 Scope

Based on table stakes + strategic differentiators for Polish 3-5 vehicle households:

### Must Ship (v1.0)

1. **Full Vehicle CRUD** - Create, edit, delete with photos, clear visual cards
2. **Quick Fueling Entry** - <30 seconds with smart defaults, partial fill support
3. **Multiple Expense Categories** - Fuel, Service, Insurance, Parking, Tolls, Other
4. **Core Statistics** - L/100km, cost per km, monthly costs, total ownership
5. **Basic Charts** - Consumption trend, monthly cost breakdown
6. **Responsive Mobile UI** - Large touch targets, works at gas station
7. **Data Export** - CSV for tax records

### Should Ship (v1.1)

1. **Smart Defaults** - Remember last station, estimate odometer
2. **Polish Station Presets** - Orlen, BP, Shell, Circle K
3. **Service Reminders** - Date-based (insurance, inspection)
4. **Household Cost View** - All vehicles combined
5. **Receipt Photo Attachment** - No OCR, just storage

### Could Ship (v1.2)

1. **Mileage-based Reminders** - Oil change at X km
2. **Vehicle Comparison** - Side-by-side efficiency
3. **Consumption Anomaly Alert** - "20% above average"
4. **A/C Impact Visualization** - Use existing schema field

### Won't Ship (v1.x)

- GPS tracking, crowdsourced prices, fleet management, multi-currency, OBD-II, social features, import from other apps

## Sources

- Google Play Store: Fuelio listing (133K reviews, 5M+ downloads) - HIGH confidence
- Google Play Store: Drivvo listing (112K reviews, 1M+ downloads) - HIGH confidence
- Google Play Store: aCar listing (21K reviews, 1M+ downloads) - HIGH confidence
- Spritmonitor.de homepage (855K users, 53M fuel-ups) - HIGH confidence
- Fuelly.com homepage (711K users, 62M fuel-ups) - HIGH confidence
- User reviews from app stores - MEDIUM confidence (real feedback but individual perspectives)
- Existing Fuelion codebase analysis - HIGH confidence
