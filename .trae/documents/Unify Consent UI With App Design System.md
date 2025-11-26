## Goal
Align the Data Privacy & Consent UI with the app’s professional design system, using the new primitives and CSS variables for consistent visuals, accessibility, and responsiveness.

## Scope
- Update onboarding consent modal and full policy modal
- Keep existing flow and handlers intact

## Target Files
- `components/ConsentModal.tsx` — primary consent UI
- `components/onboarding/FullPrivacyPolicyModal.tsx` — full policy details
- Integration points (no logic changes):
  - `components/OnboardingStepper.tsx` wiring
  - `components/Profile.tsx` → `privacy-policy` navigation

## Changes (ConsentModal)
- Replace raw container `div` with `Modal` + `Card` for structure and theming
- Replace ad‑hoc button classes with `Button` variants
- Swap hardcoded colors (e.g., `text-neutral-black`, `text-primary-green`) for CSS variables (`var(--text-primary)`, `var(--text-accent)`, `var(--button-primary-bg)`, etc.)
- Keep scrollable content (`max-h-[50vh] overflow-y-auto`) and animation
- Accessibility: ensure role, aria-modal via `Modal`, button labels remain descriptive

Implementation outline:
- Import: `import Modal from './ui/Modal'; import Card from './ui/Card'; import Button from './ui/Button';`
- Structure:
  - `<Modal open ...>` → `<Card title="Data Privacy & Consent">` → content block → actions
- Actions:
  - `View Full Policy` → `Button variant="link"`
  - `I Agree, Continue` → `Button variant="primary" size="md"`

## Changes (FullPrivacyPolicyModal)
- Wrap with `Modal` + `Card` for consistent chrome
- Use `Button` variants for `Back` (secondary/tertiary) and `Agree` (primary)
- Apply CSS variables for colors and typography
- Preserve long content scroll area and headings

## References
- Consent UI integration: `components/OnboardingStepper.tsx` step wiring and state
- Full policy modal triggers and handlers: `components/OnboardingStepper.tsx` (show/hide), `FullPrivacyPolicyModal.tsx` actions
- New primitives are available under `components/ui/*` (already present)

## Non‑Goals
- No changes to onboarding logic, analytics, storage, or DPDP content
- No new libraries

## Deliverables
- Professionally styled consent modal and full policy modal
- Consistent buttons, spacing, card shadows, and theme alignment
- A11y improvements via standardized modal component

## Confirmation
If approved, I will update `ConsentModal.tsx` and `FullPrivacyPolicyModal.tsx` to use `Modal`, `Card`, and `Button`, swap colors for CSS variables, and verify in local preview without altering flow or content.