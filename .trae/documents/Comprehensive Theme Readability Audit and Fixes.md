## Objectives
- Ensure readable, consistent typography and colors across light and dark themes.
- Eliminate hardcoded colors that break contrast; use the app’s CSS variables everywhere.
- Align UI components to a professional, cohesive design system.

## Audit Scope
- Search for problematic classes across components: `text-white`, `text-neutral-*`, `text-primary-green`, `bg-secondary-blue`, raw hexes (`#...`), and ad‑hoc `gray-*` utilities.
- Pages/components: Layout shell, Home, Assessments, AI Assistant, Reports/PDF Viewer, Profile, Modals (Consent, Privacy), Onboarding steps, Banners.

## Fix Strategy
- Replace hardcoded text and bg classes with variable-based utilities:
  - Text: `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, accent: `text-[var(--text-accent)]`, link: `text-[var(--text-link)]`.
  - Backgrounds: `bg-[var(--bg-primary|secondary|tertiary)]`, modal: `bg-[var(--bg-modal)]`.
  - Buttons: continue using variants via `components/ui/Button.tsx` with `var(--button-primary-*)` and `var(--button-secondary-*)`.
  - Alerts/banners: `text-[var(--text-on-accent)]` on accent surfaces.
- Keep `text-[var(--button-primary-text)]` only when the surface is an accent background; avoid `text-white` on neutral surfaces.
- Normalize borders to `border-[var(--border-primary)]`; underlines to `border-[var(--text-accent)]` where appropriate.

## Global Tokens & Mapping
- Confirm light/dark tokens in `index.html` remain the source of truth.
- Add optional Tailwind theme mappings for legacy names to reduce drift (e.g., map `primary-green` to `var(--text-accent)`) or convert usage to arbitrary value utilities.

## Component-Specific Adjustments
- Layout: ensure header, sidebar, bottom nav use tokens; notification badges contrast with both themes.
- Banners: use `text-on-accent` for accent backgrounds; remove environment banner (already hidden) in non-production if requested.
- AI Assistant: finalized bubbles and composer use tokens; keep `aria-live` and skeletons.
- Assessments: action cards use `Card` + `Button`; remove leftover white text.
- Reports/PDF Viewer: use tokens for on-screen; preserve print overrides in `@media print` for high-contrast output.
- Modals: `ConsentModal` and `FullPrivacyPolicyModal` use `Modal`, `Card`, `Button`; verify scroll and focus rings.

## Accessibility & Contrast
- Validate WCAG AA for primary text on `bg-secondary` (dark text) and for `text-on-accent` on accent surfaces.
- Ensure focus rings use `var(--text-accent)` and are visible in both themes.
- Respect reduced motion; no flashing highlights.

## Verification
- Run local preview in both themes: toggle via header or Profile.
- Manual pass across routes: Home, Assessments, AI Assistant, Reports (including PDF viewer), Profile, Onboarding.
- Check disabled states, errors, warnings, and links for contrast.

## Deliverables
- Refactored components using variable-based colors and consistent borders/spacings.
- Optional Tailwind mapping or complete transition to variable utilities.
- Verified readability in light and dark themes.

## Confirmation
Upon approval, I will apply the replacements across the codebase, update any legacy color usages, rebuild, and verify the UI and contrast in light and dark themes via local preview.