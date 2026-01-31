---
status: investigating
trigger: 'Add Fueling button shows disabled cursor on hover on /vehicles/[id]/fuelings page'
created: 2026-01-31
updated: 2026-01-31
---

## Current Focus

hypothesis: The ButtonGroup component in Chakra UI v3 may be passing unintended props to child buttons, causing them to appear disabled
test: Replace ButtonGroup with Stack component which is a simpler layout container
test: Change ButtonGroup to Stack
expecting: Stack doesn't pass props to children like ButtonGroup does, which should fix the disabled cursor issue
next_action: Replace ButtonGroup with Stack in fuelings/index.tsx and FuelingList.tsx

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

## Resolution

root_cause: The ButtonGroup component in Chakra UI v3 was potentially passing unintended props to child buttons, causing them to render with disabled styling (cursor: not-allowed). The ButtonGroup is designed to share recipe props among child buttons, which can cause unexpected behavior.

fix: Replaced ButtonGroup with Stack component in pages/vehicles/[id]/fuelings/index.tsx. Stack is a simpler layout component that doesn't pass props to its children. Also added explicit cursor='pointer' prop to both buttons to ensure correct cursor appearance.

verification: Code changes applied successfully. The Stack component with direction='row' provides the same visual layout (horizontal buttons with gap) without the prop-passing behavior of ButtonGroup.

files_changed:

- pages/vehicles/[id]/fuelings/index.tsx: Changed ButtonGroup to Stack, added cursor='pointer' to buttons
- components/fueling/FuelingList.tsx: Added cursor='pointer' to Add First Fueling button
