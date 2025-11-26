## Objectives
- Add more glossary entries following the existing `{ term, definition }` format.
- Improve Glossary styling with CSS variables for light/dark theme readability.

## Target File
- `components/Glossary.tsx`

## Content Additions (examples)
- Anthropometry & status: `Stunting`, `Wasting`, `Underweight`, `Overweight`, `Obesity`, `MUAC thresholds`, `BMI classification`
- Energy & metabolism: `BMR (Basal Metabolic Rate)`, `TEE (Total Energy Expenditure)`, `PAL (Physical Activity Level)`
- Dietary standards: `EAR (Estimated Average Requirement)`, `UL (Upper Limit)`, `AI (Adequate Intake)`, `DRI`
- Diet & feeding: `IYCF (Infant and Young Child Feeding)`, `Balanced Diet`, `Vegetarian`, `Vegan`, `Lactating`
- Nutrients & food science: `Macronutrients`, `Micronutrients`, `Bioavailability`, `Fortification`, `Glycemic Index`, `Satiety`, `Fiber`, `Sodium`, `Trans fats`
- Household & SES: `Kuppuswamy Scale`, `FIES (Food Insecurity Experience Scale)`, `Dietary Diversity Score (DDS)`
- Indian staples: `Millets`, `Pulses`, `Jowar`, `Bajra`, `Ragi`

All entries will be concise, neutral, and educational, matching the style of current definitions.

## Styling Fixes
- Replace `text-neutral-*` and `text-primary-green` with:
  - Header: `text-[var(--text-primary)]`, subtitle: `text-[var(--text-secondary)]`
  - Card title: `text-[var(--text-accent)]`, body: `text-[var(--text-primary)]`
  - Borders/backgrounds: `border-[var(--border-primary)]`, `bg-[var(--bg-secondary)]`
- Keep the search input and icon, but adjust colors to variables for contrast in both themes.

## Optional (AI-assisted expansion)
- If desired, add a small helper to generate suggested definitions for new terms using `geminiService`, then store them statically once reviewed. Not used at runtime to avoid API dependency.

## Verification
- Build and preview in light/dark themes; search works; entries readable and consistent.

## Deliverables
- Expanded `glossaryTerms` array with ~25–35 new terms.
- Theme-safe styling updates in `Glossary.tsx`.