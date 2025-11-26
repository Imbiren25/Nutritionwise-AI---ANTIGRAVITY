## Objectives
- Establish a cohesive design system with consistent color, spacing, typography, and component patterns.
- Modernize the app shell (header/sidebar/bottom-nav) for desktop and mobile.
- Improve accessibility, responsiveness, and perceived performance (skeletons, transitions).
- Reduce UI drift by unifying buttons, inputs, cards, modals, and banners.

## Design System
- Tokens: Continue using CSS variables defined in `index.html:67-126` for light/dark themes; add spacing scale, elevation levels, and semantic colors (info/success/warning/error).
- Typography: Use Inter (already loaded) with a clear scale (xs–2xl); tighten line-height and tracking for headings.
- Radius & Shadows: Standardize to `12px` radius, 3 shadow levels (sm/md/lg) for cards and modals.
- State styles: Define focus, hover, disabled, and loading states across interactive components using `var(--text-accent)` and accessible ring colors.

## App Shell & Layout
- Sidebar: Keep current structure in `components/Layout.tsx:79-173`; add collapsible behavior, section headings, and compact density for smaller screens.
- Header: Add a top bar with page title, global actions, and quick search; show user avatar and status.
- Content Container: Use a max-width container (`max-w-7xl mx-auto`) with responsive padding for main areas (`App.tsx:254-266`).
- Mobile Bottom Nav: Retain `Layout.tsx:170-181` but increase touch targets and add active indicators; ensure safe-area padding.
- Banners: Keep `EnvironmentBanner` and `RemoteBanner` but move into header; stack and auto-dismiss non-critical notices.

## Core UI Components
Create a small set of reusable primitives (no new libraries):
- Button: Variants `primary`, `secondary`, `tertiary`, `danger`, `link`; sizes `sm/md/lg`; loading and disabled states; full-width option.
- Card: Header/body/footer slots; support `interactive` variant.
- Input: Text, select, textarea, number; with label, help text, error; consistent focus ring and invalid states.
- Modal: Accessible modal with focus trap and escape-close; sizes; scrollable body.
- Tabs: Simple controlled tabs for sections (e.g., Profile subsections).
- Tooltip: Lightweight accessible tooltip for icons and truncated text.
- Skeleton: Rect/line/round skeletons for loading states.
- Snackbar/Toast: Unify feedback notifications (already present) with consistent placement and colors.

Files to add/update
- Add `components/ui/Button.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx`, `Tabs.tsx`, `Tooltip.tsx`, `Skeleton.tsx` using existing CSS variables.
- Update pages to use these primitives: `Home.tsx`, `Assessments.tsx`, `AiAssistant.tsx`, `Reports.tsx`, `Profile.tsx`, `LandingPage.tsx`, `SignUp.tsx`.

## Theming & Settings
- Use `hooks/useTheme.ts` (initialized in `App.tsx:33-34`) to apply theme to `html[data-theme]` and font-size to `html[data-font-size]`.
- Add a theme switcher and font-size control in header; keep Profile controls but mirror quick-access.
- Ensure all components read colors from CSS variables so dark mode works automatically.

## Accessibility
- Audit interactive elements for roles, labels, and focus order; ensure keyboard navigation works across nav and modals.
- Provide visible focus rings; respect `prefers-reduced-motion` for animation utilities.
- Announce dynamic changes via ARIA live regions for `Snackbar` and key status banners.

## Responsiveness
- Grid system: Use responsive utility classes to arrange content in 1–3 columns depending on breakpoints.
- Breakpoints: Optimize for `sm`, `md`, `lg` with layout adjustments (sidebar collapse, header density, bottom-nav spacing).
- Safe areas: Add `pb-` padding for iOS safe-area at the bottom nav.

## Performance & UX
- Lazy-load heavy routes: code-split `PDFViewer.tsx`, `AiAssistant.tsx`, `Reports.tsx`.
- Skeletons: Show skeletons while hooks load data (`useAssessment`, `useReports`, `useStockInventory`).
- Transitions: Subtle fade/slide transitions for route changes and modals, respecting reduced motion.

## Tailwind & Styling Strategy
- Current setup uses CDN utilities (`index.html:8-52`) and CSS variables. To avoid CDN reliability issues and enable purge, plan two options:
  1) Keep CDN and ensure graceful fallback (already done) while relying primarily on CSS variables and utility classes.
  2) Optional upgrade: integrate Tailwind locally via PostCSS (adds dev dependency) with a config that maps variables; enables purge and JIT. This is recommended but will change tooling.
- We will start with option 1 to minimize risk; option 2 can be a follow-up.

## Page-Specific Upgrades
- Home (`components/Home.tsx`): Introduce dashboard-style cards for quick actions and recent items; add simple analytics glance.
- Assessments (`components/Assessments.tsx`, `AssessmentStepper.tsx`): Convert to step-based progress UI with sticky footer actions; show skeletons while AI responses stream.
- AI Assistant (`components/AiAssistant.tsx:1-20`): Tidy chat layout with message bubbles, timestamp, and inline loading dots; add prompt suggestions and attachment affordances.
- Reports (`components/Reports.tsx`, `PDFViewer.tsx:349-370`): Use cards and data tables with improved spacing; ensure print styles are preserved; add filter and sort controls.
- Profile (`components/Profile.tsx:1-20, 134-143`): Organize into tabs; unify inputs; show avatar and storage sync status; add compact edit modes.
- Landing/SignUp/ProfileSetup: Align with the design system using Buttons, Inputs, Cards; improve error messaging and validation states.

## Implementation Steps
1) Add UI primitives under `components/ui/*` using CSS variables and utility classes.
2) Update `Layout.tsx` for header, container, sidebar collapse, and bottom-nav spacing.
3) Replace ad-hoc buttons and inputs in major pages with the new components.
4) Add skeletons into hooks and pages where data loads.
5) Introduce lazy loading for heavy pages and transitions for route changes.
6) Accessibility pass: ensure ARIA, roles, and focus management in modals and nav.
7) QA: manual checks across breakpoints; dark/light themes; offline banners; print to PDF.

## Deliverables
- Unified UI primitives and upgraded app shell.
- Refactored pages adopting the design system.
- Accessibility improvements and skeleton loaders.
- Optional follow-up: local Tailwind integration and additional visual polish.

## Confirmation
- If you approve, I will implement the primitives, update `Layout`, refactor key pages, and verify via local preview with no external library additions in the first pass. 