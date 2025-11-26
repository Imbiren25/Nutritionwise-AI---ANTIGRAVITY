## Objectives
- Add more nutrition-related conversions to the existing tool using the same data structure.
- Update the Conversion Tool’s UI to use theme-safe CSS variables for light/dark readability.

## Current Format
- `foodConversionData: { [food]: { [unit]: number } }` where values are grams per unit
- Units: `['gram', 'cup', 'ml']`
- Result: quantity × grams(fromUnit) ÷ grams(toUnit)

## Additions (examples, approximate household measures)
- Cereals/flours:
  - `Rice (cooked)`: `{ cup: 160, gram: 1, ml: 0 }`
  - `Poha (cooked)`: `{ cup: 150, gram: 1, ml: 0 }`
  - `Semolina (Suji)`: `{ cup: 160, gram: 1, ml: 0 }`
  - `Oats (rolled)`: `{ cup: 90, gram: 1, ml: 0 }`
  - `Rice Flour`: `{ cup: 120, gram: 1, ml: 0 }`
  - `Ragi Flour`: `{ cup: 120, gram: 1, ml: 0 }`
  - `Jowar Flour`: `{ cup: 120, gram: 1, ml: 0 }`
  - `Bajra Flour`: `{ cup: 125, gram: 1, ml: 0 }`
- Pulses (raw):
  - `Chana (raw)`: `{ cup: 200, gram: 1, ml: 0 }`
  - `Moong (raw)`: `{ cup: 180, gram: 1, ml: 0 }`
  - `Masoor (raw)`: `{ cup: 180, gram: 1, ml: 0 }`
  - `Urad (raw)`: `{ cup: 200, gram: 1, ml: 0 }`
- Dal (cooked):
  - `Dal (cooked)`: `{ cup: 200, gram: 1, ml: 0 }`
- Nuts/oil/fats:
  - `Groundnut (raw)`: `{ cup: 150, gram: 1, ml: 0 }`
  - `Ghee`: `{ cup: 225, gram: 225, ml: 1 }`
  - `Butter`: `{ cup: 227, gram: 227, ml: 0 }`
- Dairy/liquids:
  - `Curd`: `{ cup: 245, gram: 245, ml: 1 }`
  - `Buttermilk`: `{ cup: 240, gram: 240, ml: 1 }`
  - `Yogurt`: `{ cup: 245, gram: 245, ml: 1 }`
- Vegetables (chopped):
  - `Spinach (chopped)`: `{ cup: 30, gram: 1, ml: 0 }`
  - `Tomato (chopped)`: `{ cup: 180, gram: 1, ml: 0 }`
  - `Onion (chopped)`: `{ cup: 160, gram: 1, ml: 0 }`
- Pantry:
  - `Salt`: `{ cup: 288, gram: 1, ml: 0 }`

Notes: Values are approximate household measures; we’ll keep units unchanged to match format.

## UI/Theme Updates
- Replace `text-neutral-*`, `text-gray-*`, `text-primary-green`, `bg-card-white`, and `border-neutral-*` with variables:
  - Title: `text-[var(--text-primary)]`
  - Subtitle: `text-[var(--text-secondary)]`
  - Card: `bg-[var(--bg-secondary)]` and `border-[var(--border-primary)]`
  - Labels: `text-[var(--text-secondary)]`
  - Result value: `text-[var(--text-accent)]`

## Optional (later)
- Extend units (`tbsp`, `tsp`) with typical grams; keep current units for this pass to maintain format.
- Add simple info notes for liquids vs solids.

## Verification
- Build and preview; test several conversions (solid ↔ gram, liquid ↔ ml) and ensure readability in light and dark themes.

## Deliverables
- Expanded `foodConversionData` with ~20 new items.
- Theme-safe UI in Conversion Tool aligned with the rest of the app.