# Requirements: Fuelion

**Defined:** 2026-01-30
**Core Value:** Szybkie dodawanie wpisów — 30 sekund na dodanie tankowania

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **AUTH-01**: User can sign in with Google OAuth
- [ ] **AUTH-02**: User session persists across browser refresh
- [ ] **AUTH-03**: User can sign out from any page
- [ ] **AUTH-04**: Unauthenticated users are redirected to sign-in page

### Vehicles

- [ ] **VEHI-01**: User can create a vehicle with basic data (brand, model, year, registration)
- [ ] **VEHI-02**: User can add technical data to vehicle (engine capacity, power, fuel type)
- [ ] **VEHI-03**: User can view list of their vehicles
- [ ] **VEHI-04**: User can edit vehicle data
- [ ] **VEHI-05**: User can delete a vehicle (with confirmation)
- [ ] **VEHI-06**: User can select a vehicle to view its details and expenses

### Fueling

- [ ] **FUEL-01**: User can add fueling record (liters, total price, odometer, date)
- [ ] **FUEL-02**: User can mark fueling as full tank or partial
- [ ] **FUEL-03**: User can view list of fuelings for a vehicle
- [ ] **FUEL-04**: User can edit existing fueling record
- [ ] **FUEL-05**: User can delete fueling record (with confirmation)
- [ ] **FUEL-06**: Price per liter is auto-calculated from total and liters

### Statistics

- [ ] **STAT-01**: User can view fuel consumption (L/100km) over time chart
- [ ] **STAT-02**: User can view monthly fuel costs chart
- [ ] **STAT-03**: User can view summary: total spent, average consumption, total distance
- [ ] **STAT-04**: Consumption is calculated only from full-tank fuelings

### UI/UX

- [ ] **UIUX-01**: App has clear navigation between sections (vehicles, fuelings, stats)
- [ ] **UIUX-02**: Dashboard shows summary of user's vehicles and recent activity
- [ ] **UIUX-03**: Forms are simple with minimal required fields
- [ ] **UIUX-04**: Forms have smart defaults (current date, last odometer value)
- [ ] **UIUX-05**: User receives feedback on actions (success/error toasts)
- [ ] **UIUX-06**: Loading and error states are clearly displayed

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Vehicle Photos

- **PHOT-01**: User can upload photo for vehicle
- **PHOT-02**: Vehicle photo is displayed in vehicle list and details

### Additional Expense Types

- **EXPN-01**: User can add service/repair expense
- **EXPN-02**: User can add insurance expense
- **EXPN-03**: User can add other expenses (inspection, parking, tolls)
- **EXPN-04**: User can view all expenses in unified timeline

### Advanced Statistics

- **ADVS-01**: User can view monthly mileage chart
- **ADVS-02**: User can compare costs between vehicles
- **ADVS-03**: User can export data to CSV

### Responsiveness

- **RESP-01**: App works well on mobile devices
- **RESP-02**: Touch-friendly input controls

### Smart Features

- **SMRT-01**: Smart defaults remember user's preferences (last station, fuel type)
- **SMRT-02**: Reminders for upcoming insurance expiry
- **SMRT-03**: Reminders for upcoming inspection

## Out of Scope

| Feature                  | Reason                                     |
| ------------------------ | ------------------------------------------ |
| Multiple currencies      | PLN only, simplifies v1                    |
| Imperial units           | Metric only (km, liters), Polish market    |
| Email/password auth      | Google OAuth only, simpler and more secure |
| GPS tracking             | High complexity, privacy concerns          |
| Fuel price crowdsourcing | Requires community, moderation             |
| OBD-II integration       | Hardware dependency, too complex           |
| Social features          | Not core value, adds complexity            |
| Import from other apps   | Complex parsing, low priority              |
| Offline mode             | High complexity, requires sync logic       |
| Receipt OCR              | High complexity, cloud API costs           |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status  |
| ----------- | ----- | ------- |
| AUTH-01     | 1     | Pending |
| AUTH-02     | 1     | Pending |
| AUTH-03     | 1     | Pending |
| AUTH-04     | 1     | Pending |
| VEHI-01     | 2     | Pending |
| VEHI-02     | 2     | Pending |
| VEHI-03     | 2     | Pending |
| VEHI-04     | 2     | Pending |
| VEHI-05     | 2     | Pending |
| VEHI-06     | 2     | Pending |
| FUEL-01     | 3     | Pending |
| FUEL-02     | 3     | Pending |
| FUEL-03     | 3     | Pending |
| FUEL-04     | 3     | Pending |
| FUEL-05     | 3     | Pending |
| FUEL-06     | 3     | Pending |
| STAT-01     | 4     | Pending |
| STAT-02     | 4     | Pending |
| STAT-03     | 4     | Pending |
| STAT-04     | 4     | Pending |
| UIUX-01     | 1     | Pending |
| UIUX-02     | 5     | Pending |
| UIUX-03     | 3     | Pending |
| UIUX-04     | 3     | Pending |
| UIUX-05     | 3     | Pending |
| UIUX-06     | 1     | Pending |

**Coverage:**

- v1 requirements: 26 total
- Mapped to phases: 26 ✓
- Unmapped: 0

---

_Requirements defined: 2026-01-30_
_Last updated: 2026-01-30 after roadmap creation (traceability updated)_
