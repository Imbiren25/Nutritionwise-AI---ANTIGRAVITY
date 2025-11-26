## Goal
Align the mobile header/app bar with the design system and ensure icons render correctly.

## Issue
- In `components/Layout.tsx` the mobile header uses icon names that don’t exist: `light_mode`/`dark_mode` and `menu`. The `Icon` map only defines `sun`, `moon`, and no `menu`, causing empty SVGs.

## Target Files
- `components/Layout.tsx` (header buttons)
- `components/Icon.tsx` (optional: add a real `menu` icon)

## Planned Changes
- Replace theme toggle icon names with existing ones:
  - Use `Icon name={settings.theme === 'dark' ? 'sun' : 'moon'}`
- For the menu button:
  - Option A (simplest): use a defined icon like `apps` for menu
  - Option B (optional): add `menu` to `Icon.icons` (three horizontal lines / hamburger) and use it in header
- Keep `Button` primitives and CSS variables; ensure aria-labels already present remain.
- Notifications button: ensure unread badge remains visible; adjust spacing for consistency.
- App bar polish:
  - Slightly tighten padding; keep sticky positioning
  - Make sure header typography uses `var(--text-primary)`
  - Confirm focus rings use `var(--text-accent)` and proper offset backgrounds

## Verification
- Build & preview; confirm icons render and focus states are visible
- Toggle theme to verify `sun/moon` swap
- Check mobile header across light/dark modes and unread badge visibility

## Deliverables
- Correct, visible icons in the mobile header
- Professional, consistent app-bar styling using shared primitives

## Approval
If approved, I will update `Layout.tsx` to use `sun/moon` and either swap `menu` to `apps` or add a `menu` icon in `Icon.tsx`, then verify in local preview.