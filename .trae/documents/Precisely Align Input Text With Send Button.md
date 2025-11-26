## Goal
Make the input text extend exactly to the left edge of the send button, with no extra gap, while keeping the button flush to the composer border.

## Approach
- Compute the button’s visual width and set the input’s right padding to match it.
- Button width components: icon (`w-5` ≈ 1.25rem) + horizontal padding (`px-4` = 1rem each) → ~3.25rem total.
- Update the input’s `padding-right` from `pr-16` to `pr-[3.25rem]` for precise alignment; keep button at `right-0`.

## File To Update
- `components/AiAssistant.tsx` (composer section)
  - Input class: `pr-[3.25rem]`
  - Button class remains `absolute right-0 top-1/2 -translate-y-1/2`

## Verification
- Build and preview locally; confirm the input text stops exactly at the button’s left border in both light/dark themes.

## Accessibility
- Focus ring and `aria-label` unchanged; ensure no overlapping content.

## Deliverable
- Composer with precise input–button alignment, no gap, consistent with the app’s design system.