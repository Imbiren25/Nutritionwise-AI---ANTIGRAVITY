## Goals
- Deliver three optimized modes (desktop/web, tablet, mobile) with fluid layouts, adaptive navigation, responsive design tokens, and performance-focused rendering.
- Maintain brand identity and meet WCAG 2.1 AA across all modes.

## Breakpoints & Device Modes
- Breakpoints: mobile <768px, tablet 768–1023px, desktop ≥1024px.
- Tailwind screens: use `sm` (mobile), `md` (tablet), `lg` (desktop); define aliases if needed.
- Device detection: implement `useDeviceMode()` hook returning `mode: 'mobile' | 'tablet' | 'desktop'` from `window.innerWidth`.

## Layout System
- Fluid grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with baseline `gap-4`.
- Detail pages: upgrade to `lg:grid-cols-12` with `col-span-8` content and `col-span-4` sidebar.
- Containers: standardize to `max-w-container` (1200px) + `mx-auto` + `px-6 md:px-8 lg:px-12`.
- Spacing: section vertical rhythm `py-16` mobile/tablet, `lg:py-24` desktop; component base padding `p-4`.

## Navigation Patterns
- Desktop: top horizontal navbar; optional breadcrumb; collapsible sidebar for data-heavy screens.
- Tablet: collapsible left sidebar with larger hit areas; slim horizontal navbar.
- Mobile: hamburger or bottom tab bar; `p-3–p-4` touch areas; slide-in drawers for secondary actions.

## Visual Design System
- Color palette: confirm AA contrast for backgrounds, text, and interactive states; support light/dark variants with brand accents.
- Typography: responsive scales using Tailwind and `clamp` (e.g., `text-[clamp(1.125rem,2.5vw,1.5rem)]`); line-height tuned per mode (tighter desktop, looser mobile).
- Interactive elements: touch targets ≥48×48 mobile, ≥44×44 tablet; visible `focus:ring-2` branded focus, hover/active feedback.

## Performance Strategy
- Responsive images: `<picture/srcset/sizes>` with lazy loading (`loading="lazy"`).
- Conditional rendering: gate complex widgets by device mode; `lazy()` + `Suspense`; defer heavy charts on mobile.
- Motion: lightweight CSS transitions; respect `prefers-reduced-motion` with motion-disabled fallbacks.

## Accessibility (WCAG 2.1 AA)
- Keyboard navigability: logical focus order; skip-to-content links on desktop.
- ARIA: roles/labels for navigation, dialogs, tabs; semantic HTML maintained.
- Contrast: automated checks for design tokens; ensure AA for interactive/state colors.
- Touch/affordance: validate target sizes and clear cues.

## Testing Protocol
- Cross-browser: Chrome, Safari, Firefox (latest) on macOS/Windows.
- Devices: physical testing on representative phones/tablets/desktops (with zoom/emulation).
- Breakpoints: verify <768, 768–1023, ≥1024; inspect grids, spacing, nav.
- Visual regression: baseline screenshots per device mode; automated comparisons post changes.
- Accessibility validation: keyboard & screen reader flows; contrast tooling (axe, Lighthouse).

## Implementation Steps
1. Build and integrate `useDeviceMode()` and small responsive utilities.
2. Standardize containers & grids across pages (Tailwind + baseline gaps).
3. Refactor navigation per mode (desktop top nav; tablet sidebar; mobile hamburger/bottom bar).
4. Update/document typography scales, colors, and spacing tokens.
5. Develop `ResponsiveImage` abstraction with modern `<picture>`.
6. Implement device-mode gating for complex components.
7. Add `prefers-reduced-motion` styles and fallbacks.
8. Execute full testing protocol; iterate on UI/accessibility fixes.
9. Produce deliverables: mode-specific style guide, cross-browser/device report, performance metrics.

## Deliverables
- Production-ready responsive CSS/JS across all modes.
- Style guides per mode (grid, typography, spacing, interactions).
- Cross-browser/device test report with visual regression baselines.
- Performance report (LCP, CLS, TBT, image-loading metrics).

## Risks & Mitigation
- Spacing readability: adhere to 8pt rhythm; validate with real user tests.
- Conditional rendering: progressive disclosure to avoid hidden important content; confirm via UX tests.
- Performance: monitor with devtools/Lighthouse; use throttling; iterate to fix regressions.

## Next Actions
- On approval, begin implementation: hook, layout/nav adaptations, tokens, responsive assets, conditional rendering, motion preferences.
- Run tests, refine, and compile documentation and reports alongside changes.