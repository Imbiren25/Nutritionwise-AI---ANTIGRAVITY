## Goal
- Enrich every glossary entry with 4–5 sentences, precise and India‑specific.
- Maintain alphabetical ordering, category filters, search, and theme tokens.

## Content Standards
- Sources/anchors: ICMR/NIN (IFCT, RDAs), FSSAI (fortification, food safety), POSHAN/ICDS/PM POSHAN, WHO child growth standards.
- Writing style: neutral, factual, short sentences; no marketing; clearly India context when relevant.
- Validation: avoid hallucinations; cross‑check numeric ranges or program names (e.g., Vitamin A supplementation age windows, IFA programs) before inclusion.

## Data Model & Storage
- Keep `GlossaryItem { term, definition, category?, aliases? }`.
- Replace `definition` with an enriched 4–5 sentence paragraph for all entries across:
  - `data/glossary.ts`
  - `data/glossary-extended-1.ts`
  - `data/glossary-extended-2.ts`
  - `data/glossary-extended-3.ts`
- Ensure no duplicates; retain aliases and categories.

## UI/UX Behavior
- Show full definition (4–5 sentences) in each card.
- Preserve:
  - A→Z alphabetical ordering post filter/search
  - Category chips, search over term/definition/aliases
  - Theme tokens and accessibility (focus rings, aria labels)
- Optional performance toggle (if needed after review): collapse/expand long text per card, default expanded to match your request.

## Performance Safeguards
- Keep datasets lazy‑loaded via dynamic import (already in place).
- Continue `content-visibility: auto` for cards to reduce off‑screen rendering cost.
- Keep filtering using deferred query to avoid keystroke lag.

## Implementation Steps
1. Create an AI curation pass to draft 4–5 sentence definitions per term following the content standards.
2. Validate sensitive details (program names, thresholds) against India references; adjust text where numeric precision is unnecessary.
3. Update all dataset modules with enriched definitions; keep categories/aliases.
4. Verify A→Z sorting, category filters, and search index correctness with the longer text.
5. Run local preview and check mobile scroll performance; enable optional collapse if needed.

## Verification
- Spot‑check across categories (Foods, Programs, Measurements, Nutrients) for relevance and length consistency.
- Confirm alphabetical order and search responsiveness with long definitions.
- Confirm theme and accessibility remain intact.

## Acceptance Criteria
- Every visible item has a 4–5 sentence, India‑relevant definition.
- No duplicates; categories and aliases preserved.
- Sorting/filter/search function correctly and remain responsive on mobile/desktop.