## Scope
- Add 250+ new glossary entries related to nutrition in India.
- Match existing format: `{ term, definition }`, same UI/variables and search behavior.
- Keep performance acceptable and maintain code style.

## Data Model & Source
- Create a dedicated dataset module (e.g., `data/glossary.ts`) exporting `GlossaryItem[]`.
- Type: `interface GlossaryItem { term: string; definition: string; category?: string; aliases?: string[] }` (optional fields for future use).
- Populate entries from curated India‑specific domains: ICMR/NIN, IFCT, FSSAI, POSHAN Abhiyaan, ICDS/Anganwadi, PM Poshan, NFSA, fortified staples, millets, regional foods, nutrient deficiencies, RDA/RNI, public health programs, common clinical terms.
- Use AI drafting to expand and normalize definitions, then manual refine for accuracy and neutrality.

## UI/UX Changes
- Keep current card layout, theme tokens, and search bar.
- Add lazy data loading via dynamic import to avoid large initial bundle.
- Add simple client‑side pagination or “Show 50 more” to keep scroll light.
- Optional: category chips (e.g., “Foods”, “Nutrients”, “Programs”, “Measurements”, “Policies”) to filter; maintain System/Light/Dark appearance.

## Performance & Accessibility
- Dynamic import dataset (`import('./data/glossary')`) so Home loads fast.
- Efficient search: lowercased substring match on `term`, `definition`, and `aliases`.
- Keyboard navigable filters; visible focus ring; semantic headings.

## Implementation Steps
1. Add `data/glossary.ts` with 250+ curated entries; keep each definition concise (1–2 sentences).
2. Define `GlossaryItem` type and export array.
3. Update `Glossary.tsx` to lazy‑load dataset and merge with existing core terms; keep same rendering and theme variables.
4. Implement load‑more pagination (50 per page) and retain search filtering across full dataset.
5. Optional: add category chips; filter combined with search.
6. Verify: switching theme/size/bold reflects; search latency under ~50ms; no jank on mobile.

## Acceptance Criteria
- 250+ new items added, India‑specific, accurate, matched format.
- Search works across terms/definitions/aliases.
- No visual regressions; colors use `var(--*)` tokens.
- Initial load remains snappy due to dynamic import.

## Deliverables
- New dataset file with entries.
- Updated `Glossary.tsx` with lazy loading, pagination, optional filters.
- Brief verification notes and demo in preview.

## Future (Optional)
- “Suggest term” button to log entries locally for later review.
- Fuzzy search (Fuse.js) if needed after usage feedback.
