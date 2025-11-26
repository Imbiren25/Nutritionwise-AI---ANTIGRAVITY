## Goal
Make the “Start New Assessment” section visually and behaviorally consistent with the app’s new UI primitives and CSS variables, improving accessibility and responsiveness.

## Target File
- `components/Assessments.tsx` (contains the heading and two action cards)

## Planned Changes
- Replace bespoke `ActionCard` styling with `Card` + `Button` primitives.
- Use `Icon` component for icons; remove inline SVGs.
- Apply CSS variables (`var(--text-primary)`, `var(--text-secondary)`, `var(--button-primary-bg)`) and keep the existing grid layout.
- Add accessible labels/titles and clearer focus states via Button defaults.
- Maintain feature-flag disabling (`disabled={!featureFlags.enable_*}`) with visual affordance.

## Implementation Outline
- Import: `Card`, `Button`, `Icon` from `components/ui` and `components/Icon`.
- Structure:
  - Heading block remains as-is.
  - Each option uses `<Card>` with title, description, icon in the header; call-to-action uses `<Button size="lg">Start</Button>`; background color removed in favor of consistent Card/Accent styling.
- Accessibility:
  - Add `aria-label` for each card button describing the action.
  - Ensure disabled state conveys via `disabled` and styling.

## Example (conceptual)
- 24-Hour Recall:
  - Card title: “24-Hour Recall” with `Icon name="checklist"`
  - Description: existing text
  - Primary button: `Start` → `onClick={() => onStartAssessment('24-hour')}`
- Stock Inventory: same structure with `Icon name="inventory"` and corresponding handler.

## Non-Goals
- No changes to logic, feature flags, or stepper flows.
- No new libraries.

## Deliverables
- Updated `Assessments.tsx` using `Card` and `Button`, aligned fonts, colors, shadows, spacing.
- Visual consistency with Home and Consent modals.

## Confirmation
If approved, I will implement the refactor in `Assessments.tsx`, ensure feature-flag states and handlers remain intact, and verify in local preview.