# UI Consistency Guidelines

## Grid and Containers
- Use `max-w-container` for page containers; center with `mx-auto` and side padding `px-6 md:px-8 lg:px-12`.
- Preserve 8pt spacing rhythm: prefer `p-4`, `p-5`, `p-6` sparingly; default to `p-4` in cards.

## Spacing
- Vertical rhythm: prefer `space-y-4` for stacks, `gap-4` for grids; increase selectively.
- Avoid `py-20+` except for rare hero use; prefer `py-16` and `lg:py-24`.

## Components
- Card: header/body/footer padding `p-4`; borders `border-gray-100`; avoid excessive shadows.
- Button: sizes `sm` ≥ 44px height, `md` 48px, `lg` 56px; consistent `rounded-xl`.
- Modal: outer margin `mt-16` typical; content padding `p-4`.
- Tabs: maintain `px-4 py-2` minimal underlines; active state uses accent color and visible focus rings.
- Mobile bottom nav: `p-3` to meet touch-area targets.

## Interactive Elements
- Touch targets ≥ 44px height/width.
- Focus states: visible with `focus:ring-2` and contrast-compliant colors.

## Breakpoints
- Validate at `sm`, `md`, `lg`, `xl`; ensure grids reflow without overflow; maintain `gap-4` baseline.
