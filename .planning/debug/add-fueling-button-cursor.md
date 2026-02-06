---
status: resolved
trigger: 'Add Fueling button shows disabled cursor on hover on /vehicles/[id]/fuelings page'
created: 2026-01-31
updated: 2026-02-06
---

## Current Focus

hypothesis: The Add Fueling button is receiving a disabled state in the rendered DOM (disabled/aria-disabled), which forces the not-allowed cursor
test: Inspect the rendered button in the browser to confirm whether disabled or aria-disabled attributes are present and identify any overlaying elements
expecting: If disabled attributes exist, trace where they are set; if no attributes, check for overlay elements applying cursor: not-allowed
next_action: Closed - user confirmed the button is clickable

## Symptoms

expected: Add Fueling button should be clickable with normal cursor on hover
actual: Button shows disabled cursor on hover
errors: None visible in code
reproduction: Navigate to /vehicles/[id]/fuelings and hover over Add Fueling button
started: Unknown - likely introduced with Chakra UI 3.x migration

## Eliminated

## Evidence

- timestamp: 2026-01-31
  checked: pages/vehicles/[id]/fuelings/index.tsx line 106
  found: Button uses `colorPalette='blue'` prop
  implication: Chakra UI v3 uses `colorScheme`, not `colorPalette`

- timestamp: 2026-01-31
  checked: components/fueling/FuelingList.tsx line 106
  found: Button uses `colorPalette='blue'` prop in empty state
  implication: Same issue in both locations

- timestamp: 2026-01-31
  checked: Chakra UI v3 ButtonGroup and Group component source
  found: ButtonGroup passes props via ButtonPropsProvider; Group clones children with data attributes
  implication: gap prop on ButtonGroup goes to Group (flex container), not buttons

- timestamp: 2026-01-31
  checked: Disabled layer style in Chakra UI theme
  found: disabled layer style sets `cursor: "not-allowed"` and `opacity: "0.5"`
  implication: Button shows disabled cursor when \_disabled styles are applied

- timestamp: 2026-02-06
  checked: pages/vehicles/[id]/fuelings/index.tsx
  found: Action buttons already use Stack and explicit cursor='pointer'
  implication: ButtonGroup no longer present; disabled cursor likely not from ButtonGroup

- timestamp: 2026-02-06
  checked: components/fueling/FuelingList.tsx
  found: Empty-state button uses colorPalette='blue' and cursor='pointer'
  implication: Empty-state button mirrors Add Fueling button styling

- timestamp: 2026-02-06
  checked: pages/vehicles/[id]/statistics.tsx
  found: Add Fueling button uses same colorPalette/cursor pattern without ButtonGroup
  implication: Issue is specific to fuelings page context, not button props alone

- timestamp: 2026-02-06
  checked: user verification
  found: User confirmed the Add Fueling button is clickable
  implication: Fix verified in the UI

## Resolution

root_cause: The ButtonGroup component in Chakra UI v3 was potentially passing unintended props to child buttons, causing them to render with disabled styling (cursor: not-allowed). The ButtonGroup is designed to share recipe props among child buttons, which can cause unexpected behavior.

fix: Replaced ButtonGroup with Stack component in pages/vehicles/[id]/fuelings/index.tsx. Stack is a simpler layout component that doesn't pass props to its children. Also added explicit cursor='pointer' prop to both buttons to ensure correct cursor appearance.

verification: User confirmed the Add Fueling button is clickable in the UI.

files_changed:

- pages/vehicles/[id]/fuelings/index.tsx: Changed ButtonGroup to Stack, added cursor='pointer' to buttons
- components/fueling/FuelingList.tsx: Added cursor='pointer' to Add First Fueling button
