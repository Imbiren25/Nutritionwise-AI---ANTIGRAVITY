## Outcome
- Display glossary entries sorted A→Z by term for every category selection and search.
- Sorting happens after category filtering and search so the visible list is always alphabetical.

## Sorting Rules
- Case-insensitive compare using `term.trim().toLowerCase()`.
- `localeCompare('en', { sensitivity: 'base' })` for robust ordering with diacritics.
- Stable sort; items retain identity and existing UI/theme.

## Implementation
1. In `components/Glossary.tsx`:
   - After computing `filtered`, derive `visible = [...filtered].sort((a,b)=>a.term.localeCompare(b.term,'en',{sensitivity:'base'}))`.
   - Update the status text to: `Showing N items • Sorted A→Z`.
2. Optional UX:
   - Group by first letter with tiny headers for long lists (A, B, C…); keep OFF by default.

## Verification
- Select any category (e.g., “Foods”) and confirm items render A→Z.
- Type a query; matched items are A→Z.
- Performance remains smooth (sorting on filtered set only).
- No visual regressions; tokens/ARIA unchanged.

## Acceptance Criteria
- All visible items are alphabetically ordered by term.
- Sorting persists across category chips and search.
- Theme, accessibility, and responsiveness preserved.