## What’s In Scope
- The Appearance section in Profile: Theme (Light/Dark/System), Font Size (Small/Medium/Large), Bold Text toggle.
- Confirm what responds globally and identify any non‑responsive parts or inconsistencies.

## Findings
- Theme controls:
  - Implementation: `Profile.tsx:248-270` (ThemeSelector) using `useTheme().changeAppearance({ theme })`.
  - Global application: `useTheme.ts:1-73` sets `html[data-theme]` to `light | dark | system` and updates on `prefers-color-scheme` changes when `system` is selected.
  - Responsive components: Most pages use CSS variables (`var(--text-*)`, `var(--bg-*)`) and reflect theme changes immediately (Layout, AI chat, Home, Assessments, Glossary, Conversion Tool, PDF Viewer header/sections).
  - Residual risks: Components that still use legacy classes (`text-neutral-*`, `text-gray-*`) may not fully reflect theme. We’ve corrected many, but a sweep remains for edge cases (print overrides are intentionally separate).
- Font Size controls:
  - Implementation: `Profile.tsx:272-298` (FontSizeSelector) calls `changeAppearance({ fontSize })`.
  - Global application: `useTheme.ts` sets `html[data-font-size]` to `small|medium|large`; base `index.html:149-159` defines scaling.
  - Responsive components: All rem‑based and utility classes respond; any hardcoded pixel sizes won’t scale (rare in current code).
- Bold Text toggle:
  - Implementation: `Profile.tsx:314-328` (ToggleSwitch) sets `boldText` via `changeAppearance({ boldText })`.
  - Global application: `useTheme.ts` sets `html[data-bold-text]`; base CSS increases weights for typical classes.
  - Responsive components: Headings and typical text respond; custom font‑weight edge cases may need manual checks.

## Problems Identified
1) Residual hardcoded colors in some components can reduce theme consistency (e.g., occasional `text-neutral-*` or `text-gray-*`).
2) Print styles use neutral colors (by design) but must not leak into on‑screen styles.
3) Minor discoverability: Theme/System selection and active state are correct, but adding clear selected states for font size and theme chips improves clarity (already partially present).
4) ToggleSwitch uses label as `id`, which is fine but might collide if duplicated; not an issue in current usage.

## Fix Plan
1) Theme Consistency Sweep
- Grep across components for `text-neutral-*`, `text-gray-*`, `text-primary-green`, `bg-secondary-blue` and replace with tokens: `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, `text-[var(--text-accent)]`, `bg-[var(--bg-secondary)]`, `border-[var(--border-primary)]`.
- Validate that all screens reflect theme switch instantly.

2) Font Size & Bold Checks
- Confirm that major components use rem/sizing utilities; adjust any outliers using px to rem where feasible.
- Verify bold text toggle visually increases weights per `index.html` definitions without breaking headings.

3) UI Feedback Improvements (non‑breaking)
- Ensure selected chip styles are visually distinct for Theme and Font Size (already implemented with `bg-[var(--bg-secondary)] shadow-sm text-[var(--text-accent)]`).
- Add subtle focus ring for keyboard selection on Theme/Size buttons.

4) Print Isolation
- Confirm that `@media print` styles remain isolated and do not influence on‑screen colors.

## Acceptance Criteria
- Switching Theme (Light/Dark/System) updates all views; no remnants of the wrong color classes on-screen.
- Changing Font Size visibly scales app typography via `html[data-font-size]`.
- Bold Text toggle increases weight application-wide without distortions.
- No print styles leak into on‑screen.

## Next Actions
- I will perform the code sweep for residual hardcoded neutrals/primary-green and standardize to tokens, then re‑validate the Appearance controls across screens.
- Optional enhancement: add keyboard focus ring styles for Theme/Size buttons and verify ARIA where relevant.

Approve, and I’ll execute the fixes and verification immediately.