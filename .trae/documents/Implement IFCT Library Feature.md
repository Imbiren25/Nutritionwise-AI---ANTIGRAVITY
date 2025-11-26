## Feature Overview
- Provide a searchable IFCT Library for Indian foods aligned with ICMR-NIN IFCT 2021.
- Show per-100g nutrient values for key nutrients: `energy`, `protein`, `fat`, `carbs`, `fiber`, `iron`, `calcium`, `vitaminA`, `zinc`.
- Enable quick AI-assisted lookups and comparisons via existing Gemini integration.

## UI/UX
- New page `IFCTLibrary` accessible from Home ToolCard (currently an alert at `components/Home.tsx:117`).
- Layout: left search + filters, right results table.
- Search: free-text by food name; debounce; highlight matches.
- Filters: food group (cereals, pulses, dairy, vegetables, fruits, oils, sugars, mixed dishes).
- Table: sticky header, sortable columns, pagination for large lists.
- Row actions: “Copy values”, “Compare”, “Open in Conversions” (deep-link to `conversion-tool` with selected food).
- Accessibility: labeled inputs, focus states, ARIA for table and controls.

## Data Model
- Add `IFCTFood` type in `types.ts` with fields: `id`, `name`, `group`, `source`, `per100g: { energy; protein; fat; carbs; fiber; iron; calcium; vitaminA; zinc }`.
- Create initial dataset `data/ifct.ts` with a seed list (15–30 common Indian foods) to avoid blank state; keep extensible.
- Support alias names for search (e.g., roti/chapati, chana/chickpea).

## AI Integration
- Extend `services/geminiService.ts` with a function `lookupIFCT(foodName: string)`:
  - Prompt Gemini to return IFCT 2021-aligned estimates when local data missing.
  - Normalize units to per-100g, return structured JSON matching `IFCTFood` shape.
- Add `compareIFCT(foods: string[])` to request a compact comparison table via AI when users select multiple items.
- Guardrails: include disclaimers and mark AI-derived rows with a badge and source field.

## Navigation & Routing
- Update `types.Page` to include `"ifct-library"`.
- In `components/Home.tsx:117`, change IFCT ToolCard to `onClick={() => setActivePage('ifct-library')}`.
- Add new `components/IFCTLibrary.tsx` and render it from `App.tsx` when activePage is `"ifct-library"`.

## Implementation Steps
1. Types: add `IFCTFood` and expand `Page` union.
2. Data: create `data/ifct.ts` with a small, verified seed dataset.
3. Service: add `lookupIFCT` and `compareIFCT` in `geminiService.ts` with strict JSON schema and unit normalization.
4. Page: build `IFCTLibrary.tsx`:
   - State: `query`, `activeGroup`, `sort`, `page`, `selectedFoods`.
   - Use `useDebounce(query)` for efficient search.
   - Merge local dataset + AI results (dedupe by normalized name).
   - Table with sort and pagination; badge AI values.
   - Actions: compare selected, copy values, open in conversions.
5. Home: wire ToolCard navigation.
6. App: include page rendering branch.

## Validation
- Run TypeScript build, ensure types are strict and no `unknown` leaks.
- Manual test via preview:
  - Search "Rice", "Dal", "Paneer" shows seeded rows.
  - Filter by group works; sorting works.
  - Missing items trigger AI lookup; results marked as AI-sourced.
  - “Open in Conversions” deep-links pre-selecting item and unit.
- Add light unit tests for utility functions (normalize names, sort, pagination) if testing infra exists.

## Security & Privacy
- No PII; cache AI results locally with a timestamp; allow clearing cache.
- Rate-limit AI lookups and respect offline state.

## Future Enhancements
- Import full IFCT dataset as a separate module or on-demand (lazy-load).
- Add micronutrients expansion (B-complex, vitamin C, sodium, potassium).
- Export table as CSV/JSON; print-friendly view.

## Request for Confirmation
- Confirm the plan and I will implement: types, dataset, service functions, page UI, navigation, and validation end-to-end.