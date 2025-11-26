## Outcome
- Display glossary terms sorted alphabetically by term (A→Z) at all times.
- Sorting applies after category filtering and search, so users see A→Z ordered results.

## Sorting Rules
- Case‑insensitive compare: `term.trim().toLowerCase()`.
- Use `localeCompare` with `{ sensitivity: 'base' }` to handle diacritics consistently.
- Stable sort; preserve item identities and existing theme tokens.

## UI/UX
- Keep current layout (full list, search bar, category chips).
- Update the item count line to say: `Showing N items • Sorted A→Z`.
- Optional (if you want): letter headers (A, B, C…) above groups and a small alphabet jump bar; defaults OFF to keep layout clean.

## Implementation Steps
1. In `components/Glossary.tsx`, after computing `filtered`, derive `visible = [...filtered].sort((a,b)=>a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }))`.
2. Update the count text to include `Sorted A→Z`.
3. (Optional) Add letter grouping with a memoized map keyed by first letter, rendering a small header before each group.

## Verification
- Filter by a category (e.g., Foods) and confirm results are A→Z.
- Type a search term and confirm matched items are A→Z.
- Check performance remains smooth (O(n log n) on the filtered set).
- Confirm theme tokens and accessibility remain intact.

## Acceptance Criteria
- All visible glossary entries are ordered alphabetically by term.
- Sorting persists across category filters and search input.
- No visual regressions or performance issues.