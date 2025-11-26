## Scope
- Expand the Glossary with 500 additional India‑specific nutrition terms.
- Match the existing term/definition format and theme tokens.
- Ensure zero duplicates with the currently present list.

## Data Model & Organization
- Keep the same item shape: `{ term: string; definition: string; category?: string; aliases?: string[] }`.
- Split dataset into multiple chunks for performance:
  - `data/glossary-core.ts` (existing short set)
  - `data/glossary-extended-1.ts`, `data/glossary-extended-2.ts`, `data/glossary-extended-3.ts` (≈170 items each)
- Dynamically import all extended chunks in Glossary to avoid bloating initial bundle.

## Content Domains (Curated, India‑specific)
- Foods & Ingredients: staple cereals, pulses, millets, regional dishes, oils, spices, traditional preparations (e.g., sattu, chikki, laddoo types, papad, pickles)
- Nutrients & Metabolism: vitamins/minerals, protein quality metrics, glycaemic concepts
- Measurements & Assessment: anthropometry, MUAC variants, household measures, FFQ, 24‑h recall
- Programs & Policies: POSHAN Abhiyaan, ICDS/Anganwadi, PM POSHAN, NFSA/PDS, Eat Right India, fortification standards
- Fortified Staples & Biofortification: fortified rice/oil/atta/DFS, biofortified millets
- Therapeutics & Clinical: SAM/MAM, CMAM, RUTF, F‑75/F‑100, ORS, zinc
- WASH, Safety & Labelling: hygiene, cold chain, adulteration, FoPL, recalls
- Life Stages & Public Health: maternal/adolescent/elderly nutrition, anaemia, hidden hunger, growth monitoring
- Regional/Cultural: fasting foods, state‑specific items, temple prasadam handling

## Deduplication Strategy
- Normalise keys: lowercase trimmed `term`.
- Maintain a `Set`/`Map` of existing terms when merging.
- If a new item’s normalised term already exists:
  - Skip or merge aliases/category if they add value (without changing definition semantics).
- Provide a merge summary (dev console) with counts of skipped/merged to verify exactly +500 net new entries.

## UI/UX (Keep Stable)
- Preserve current search bar, cards, theme variables and accessibility.
- Continue category chips and “Show 50 more” pagination (50 per page).
- Search indexes `term`, `definition`, `aliases` across full dataset.

## Performance
- Use dynamic imports for extended datasets; show loader only once.
- Avoid blocking the main thread: merge datasets synchronously but light work (maps/arrays only).
- Keep per‑page pagination to limit DOM size.

## Implementation Steps
1. Create `data/glossary-extended-1.ts`, `-2.ts`, `-3.ts` with ~170 curated entries each (food, programs, measurement, etc.).
2. In `Glossary.tsx`, dynamically import all extended modules and merge with existing items.
3. Implement dedupe (normalise term keys) and alias/category merging.
4. Keep pagination and category chips; ensure search covers merged dataset.
5. Verify: count increase is exactly +500; no duplicates; theme responsiveness; mobile smoothness.

## Verification
- Programmatic count check (console): existing + new = expected; duplicates skipped = 0.
- Visual: categories render; search latency acceptable; pagination loads more smoothly.
- Build size: extended data goes to separate chunks (`dist/assets/glossary-extended-*.js`).

## Acceptance Criteria
- 500 unique, India‑specific terms added without repetition.
- Format and style match existing Glossary cards.
- Search and filters operate across the entire set.
- Performance and theme consistency maintained.
