## Goal
Move the send button further right so it visually touches the right border of the chat composer, maintaining accessibility and layout integrity.

## Change
- In `components/AiAssistant.tsx`, update the send button position from `right-2` to `right-0`.
- Increase input right padding to avoid overlap (from `pr-14` to `pr-16`).

## Accessibility
- Keep focus ring and aria-label unchanged.
- Ensure button remains keyboard-focusable and does not overflow outside the rounded container.

## Verification
- Build and preview; confirm the button sits flush against the right inner border of the composer and the input text does not overlap.

## Deliverable
- Updated composer with button visually touching the right border, consistent with the app’s design system.