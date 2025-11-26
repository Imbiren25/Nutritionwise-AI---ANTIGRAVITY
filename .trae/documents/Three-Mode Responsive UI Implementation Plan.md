## Overview
- Implement three optimized modes (web/desktop, tablet, mobile) with fluid layouts, adaptive navigation, responsive design tokens, and performance-conscious rendering.
- Preserve brand identity while meeting WCAG 2.1 AA and device-specific usability needs.

## Breakpoints & Device Modes
- Breakpoints: mobile <768px, tablet 768–1023px, desktop ≥1024px.
- Tailwind screens: use `md` for tablet, `lg` for desktop; keep `sm` for small mobile; define aliases if desired.
- Add a `useDeviceMode()` hook to expose `mode: 'mobile' | 'tablet' | 'desktop'` using `window.innerWidth` + breakpoints.

## Layout System
- Fluid grid:
  - Content grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with baseline `gap-4`.
  - Detail pages: switch to `lg:grid-cols-12` for more granular layouts (e.g., `col-span-8` content, `col-span-4` sidebar).
- Containers:
  - Use `max-w-container` (1200px) across screens; center with `mx-auto` and `px-6 md:px-8 lg:px-12`.
- Spacing:
  - Normalize section paddings to `py-16` (mobile/tablet) and `lg:py-24` (desktop).
  - Components default to `p-4`; increase only for dense content needs.

## Navigation Patterns
- Desktop:
  - Top horizontal navbar; optional secondary breadcrumb for deep pages.
  - Sidebar optional on data-heavy pages (collapsible).
- Tablet:
  - Collapsible left sidebar, larger hit areas; keep horizontal navbar slim.
- Mobile:
  - Hamburger menu or bottom tab bar (existing bottom nav) with `p-3`–`p-4` hit areas.
  - Drawer for secondary actions; reduce menu depth.

## Visual Design System
- Color palette:
  - Confirm AA contrast for text/background and interactive states across all modes.
  - Provide dark/light variants with consistent brand accents.
- Typography:
  - Use responsive scales via Tailwind and clamp where useful, e.g., `text-[clamp(1.125rem,2.5vw,1.5rem)]` for headings.
  - Line-heights tuned per mode: slightly tighter on desktop content, looser on mobile.
- Interactive elements:
  - Touch targets ≥48x48px on mobile; ≥44px tablet, desktop sized to context.
  - Visible focus states using `focus:ring-2` with brand accent; maintain hover/active states.

## Performance Considerations
- Images:
  - Implement `<picture>` with `srcset` and `sizes` for device-specific resolutions.
  - Lazy-load offscreen images; use `loading="lazy"`.
- Conditional rendering:
  - Gate complex widgets/components based on mode; use `lazy()` and `Suspense`.
  - Avoid rendering heavy charts on mobile until user reveals.
- Transitions:
  - Use lightweight CSS transitions; respect `prefers-reduced-motion` with motion-disabled fallbacks.

## Accessibility (WCAG 2.1 AA)
- Keyboard navigability: logical focus order, skip-to-content links in desktop.
- ARIA roles/labels for nav, tabs, dialogs; ensure semantic HTML.
- Contrast checks for all tokens; state colors meet AA.
- Touch target compliance and clear affordances.

## Testing Protocol
- Cross-browser: Chrome, Safari, Firefox latest on macOS; mobile Safari/Chrome.
- Devices: physical/real-device testing on phone and tablet; desktop monitors with zoom scenarios.
- Breakpoint sweeps: verify layouts at <768, 768–1023, ≥1024; inspect grids, spacing, nav patterns.
- Visual regression: screenshot baselines per screen/mode, compare after changes.
- Accessibility validation: keyboard-only flows, screen reader sanity checks, contrast tooling.

## Implementation Steps
1. Add `useDeviceMode()` hook and small utility for responsive decisions.
2. Standardize containers and grids across pages using Tailwind breakpoints and `gap-4` baseline.
3. Adapt navigation per mode (desktop top nav, tablet sidebar, mobile bottom nav/hamburger).
4. Update typography scales and spacing tokens; confirm contrast across modes.
5. Introduce `ResponsiveImage` wrapper for `picture/srcset/sizes`.
6. Add conditional rendering gates for complex components on mobile/tablet.
7. Add `prefers-reduced-motion` CSS and guard animations.
8. Run testing protocol and fix issues iteratively.
9. Produce deliverables: style guide per mode, cross-browser report, performance metrics.

## Deliverables
- Complete responsive CSS/JS implementation across modes.
- Mode-specific style guide documenting grids, typography, spacings, interactions.
- Cross-browser/device testing report; visual regression snapshots.
- Performance metrics per device class (LCP, CLS, TBT) and image loading improvements.

## Risks & Mitigation
- Overly aggressive spacing changes can harm readability → adhere to 8pt rhythm and validate with users.
- Conditional rendering could hide important info → add progressive disclosure and explicit triggers.
- Performance regressions → measure and iterate; use devtools, Lighthouse and network throttling.

## Next Actions
- Proceed to implement the hook, container/grid standardization, nav adaptations, and responsive assets.
- Validate with the testing protocol; refine based on findings.
- Compile documentation and reports alongside changes.

Please confirm to begin implementation across the codebase following this plan.