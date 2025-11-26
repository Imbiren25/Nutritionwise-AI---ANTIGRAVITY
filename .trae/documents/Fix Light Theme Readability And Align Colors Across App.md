## Problems Observed
- White text appears on light surfaces in some places, causing poor contrast.
- Mixed use of ad‑hoc color classes (`text-white`, `text-neutral-*`, `text-primary-green`, `bg-secondary-blue`) and CSS variables leads to inconsistency.
- Tailwind local build does not define custom color tokens (e.g., `primary-green`), risking broken classes.

## Objectives
- Ensure all text in light theme uses dark readable colors unless on accent backgrounds.
- Align all components to use the CSS variable palette for text, borders, and backgrounds.
- Preserve accent contrast (white text on accent buttons/banners only).

## Target Areas
- Global tokens in `index.html` (light/dark variables are good; enforce usage).
- Components using hardcoded color utilities:
  - Buttons/banners/modals: `text-white`, `bg-*` custom tokens
  - Headings using `text-neutral-*` and `text-primary-green`
  - Informational labels in `PDFViewer`, `Profile`, `Assessments`, and onboarding modals

## Plan Of Changes
1) Color Strategy
- Replace `text-white` with `text-[var(--text-primary)]` when used on neutral backgrounds.
- Keep `text-white` only on accent surfaces (e.g., `bg-[var(--button-primary-bg)]`, `bg-secondary-blue`).
- Replace hardcoded neutrals (`text-neutral-*`) with variables: `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`.
- Replace custom color names (`text-primary-green`, `bg-secondary-blue`) with variable forms or define them in Tailwind.

2) Tailwind Mapping (prefer variables)
- Extend Tailwind theme to expose named colors mapped to CSS variables to support existing usages:
  - `primary-green`: `var(--text-accent)` / `var(--button-primary-bg)`
  - `secondary-blue`: `#2196F3` (or a variable added to tokens)
  - `neutral-*` aliases mapped to existing variable palette when feasible
- Alternatively, systematically convert those classes to arbitrary values `text-[var(--text-accent)]`, `bg-[var(--bg-secondary)]` across components.

3) Component Audit & Fixes
- Banners (`EnvironmentBanner`, `RemoteBanner`): ensure text color matches background; use `text-[var(--text-on-accent)]` for accent banners and `text-[var(--text-primary)]` on neutral.
- Buttons: already use variables in `components/ui/Button.tsx`; confirm no stray `text-white` outside accent variant.
- Consent/Policy modals: confirmed using variables; re-check any leftover `text-white` and replace if neutral.
- Assessments: now using `Card` + `Button`; confirm no `text-white` remains.
- AI Assistant: on refactor, ensure header/title uses variables, messages use neutral text, composer uses variables.
- PDFViewer: replace `text-neutral-black/medium/dark` and `text-primary-green` with variables for on-screen; keep print overrides.

4) Global Safeguards
- Add a lightweight CSS safeguard in `index.css` that prevents `.text-white` on neutral surfaces in light theme by scoping:
  - `html[data-theme='light'] .bg-[var(--bg-secondary)] .text-white { color: var(--text-primary); }` (limited and careful to avoid breaking accent components)
- Prefer component-level fixes to avoid side effects; the safeguard is fallback.

5) QA
- Check pages in light theme: Home, Assessments, AI Assistant, Reports, Profile, PDF viewer.
- Validate contrast (WCAG AA) for text on banners and buttons.
- Verify dark theme unaffected.

## Deliverables
- Consistent readable text across light theme.
- Refactored components using variable-based colors.
- Optional Tailwind color mapping to reduce future drift.

## Approval
If approved, I will audit and replace problematic color classes across components, add Tailwind color mappings or convert to variable-based utilities where appropriate, and verify via local preview in light theme.