## Goal
- Always display the complete glossary list (no pagination).
- Remove the “Show 50 more” button and render all filtered items at once.

## Changes
- In `components/Glossary.tsx`:
  - Remove `perPage`, `visibleCount` state and logic.
  - Set `visible = filtered` directly.
  - Delete `canLoadMore` computation and the load-more button block.
  - Keep dynamic imports and category chips; keep search over term/definition/aliases.
  - Show a small counter like “Showing N items” next to the search for feedback.

## Performance Safeguards
- Keep dynamic import of datasets to avoid increasing the initial bundle.
- Use lightweight DOM: same card layout, but consider adding `content-visibility: auto` via a utility class to reduce rendering cost when off-screen.
- If mobile jank is observed, add an optional toggle to collapse long definitions (defaults expanded).

## Verification
- Navigate to Glossary and confirm the full list renders immediately after data loads.
- Search and category filters operate across the entire dataset.
- Confirm theme tokens and accessibility (focus rings, headings) remain intact.

## Acceptance Criteria
- No “Show 50 more” button; entire filtered list is visible.
- Search/filter behavior unchanged; initial bundle remains small.
- No visual regressions; list usable on mobile and desktop.