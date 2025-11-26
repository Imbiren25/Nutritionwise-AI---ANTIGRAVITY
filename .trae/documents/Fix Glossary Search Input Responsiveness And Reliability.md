## Problem
- The search input in Glossary appears unresponsive when typing over a large dataset.
- Heavy filtering on every keystroke can block the main thread and feel “not working”.

## Targeted Fixes
- Debounce search input and use a deferred value for filtering to keep typing smooth.
- Add a lightweight loading state while datasets finish lazy-loading so users know when search is ready.
- Ensure the input receives focus reliably and the overlay icon doesn’t intercept clicks.
- Keep theme tokens, category chips, and full-list rendering intact.

## Implementation
1. In `components/Glossary.tsx`:
   - Add `useDeferredValue` (React 18) or a 200–300ms debounce state for `searchQuery`.
   - Use the deferred/debounced query in `filtered` calculation (`useMemo`).
   - Add a local `isLoading` flag toggled around the dynamic imports; render a small "Loading glossary…" hint next to the search until data arrives.
   - Add `autoFocus` to the search input and `aria-label="Search glossary"`.
   - Ensure the absolute search icon has `pointer-events: none` so it can’t block clicks.
2. Performance polish:
   - Apply `style={{contentVisibility:'auto'}}` to each card container to lower render cost off-screen.

## Verification
- Typing in the input updates results smoothly with no perceived lag.
- Search works across `term`, `definition`, and `aliases` after datasets load.
- Input focuses on load; clicking anywhere in the field is accepted.
- No visual regressions; theme tokens still used and category chips work.

## Acceptance Criteria
- Search input feels responsive and filters correctly.
- No blocked clicks by overlay icon; focus and accessibility preserved.
- Full list rendering remains, with a brief loading hint until datasets finish.