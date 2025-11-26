## Critical Functional Fixes
- AI summary errors: Replace `process.env.API_KEY` with `import.meta.env.VITE_GENAI_API_KEY`, guard missing key and offline state, and show actionable UI messages.
  - Update services: `services/geminiService.ts:1–12,96–156,209–269` and `services/aiAssistantService.ts:6–13,55–63` to use `VITE_GENAI_API_KEY`; if missing, disable buttons and show "Configure API key in environment".
- AI Assistant chat: Initialize chat only when key present and online; show friendly prompt when unavailable.
  - References: `components/AiAssistant.tsx:1–20` and `services/aiAssistantService.ts:55–78`.

## Validation & Calculations
- Age validation bug: Set sensible defaults and UX.
  - Initialize age to blank or 1; change validation to show errors only after user interaction; set `NumericStepper` `min=1`.
  - References: `hooks/useAssessment.ts:6–21` (initial data), `components/steps/StepA.tsx:16–35,63–75` and `components/NumericStepper.tsx:45–69`.
- SES classification stuck: Computation already exists but may re-trigger constantly.
  - Add guard to only set `isCalculating` when input changes and debounce income changes; show last computed SES fallback when loading.
  - References: `components/steps/StepE.tsx:46–106`.
- Stock CU calculation stuck: Ensure `updateTotalCU` isn’t cancelled prematurely and runs when members change.
  - Replace setTimeout with immediate calculation + small debounce; show `0.00` when no members.
  - References: `components/stock_steps/StockStep_Family.tsx:38–73,94–120`.

## Accessibility & UI Polish
- Add-food buttons accessibility: Ensure all plus buttons are real `<button>` with visible focus and larger hit target; avoid nested interactive elements in scroll list.
  - References: `components/steps/StepI.tsx:120–129`.
- Next button visibility: Make stepper controls sticky and auto-scroll the form to top on step change.
  - References: `components/AssessmentStepper.tsx:1–44,117–155`.
- Notification panel overlay: Anchor to layout container, add backdrop click-to-close, and ensure content is loaded before render.
  - References: `components/NotificationCenter.tsx:21–43` and `components/Layout.tsx:42–81`.
- Update banner: Add dismiss (persist in localStorage) and show only once per version.
  - References: `components/Layout.tsx:42–81` and `services/appConfigService.ts:40–52`.

## IFCT Library Navigation
- Button not responding: Verify `setActivePage('ifct-library')` wiring and suspense import.
  - References: `components/Home.tsx:115–128` and `App.tsx:305–310`.
  - Add a route test and feature flag gate if needed; display helpful message when offline or AI key missing for IFCT AI features.

## AI Usage Limits & Consent
- Clarify AI limits UI and consent flow.
  - Show remaining quota (`useAiUsage`) and disable generate when exhausted; improve consent and rewarded modal flow.
  - References: `components/steps/StepK.tsx:112–200,268–300` and `components/stock_steps/StockStep_AI_Summary.tsx:103–177,215–260`.

## Data & Privacy Safeguards
- Delete-all confirmation: Add double-confirm, typed confirmation, and success toast.
  - References: `App.tsx:150–157` and `components/Profile.tsx:1–40,120–170`.
- Analytics toggles: Default off, with clear descriptions; add link to policy; persist in localStorage.
  - References: `components/Profile.tsx:120–170,230–280`.
- Sync Now: Add confirmation modal, status messages, and results toast.
  - References: `hooks/useSync.ts` (init) and `components/Layout.tsx:42–81`.

## Robust Error Handling
- AI failures: Display human-readable cause (offline, key missing, quota exceeded) and recovery action.
  - References: `services/geminiService.ts:145–156,266–269`, `components/steps/StepK.tsx:140–200,270–300`, `components/stock_steps/StockStep_AI_Summary.tsx:134–177,232–260`.
- Form errors: Show inline hints and only after field is touched; auto-focus first error.
  - References: `components/AssessmentStepper.tsx:117–155` and `components/steps/StepA.tsx:16–35,50–75`.

## UX Enhancements
- Sticky step header with progress indicator and step count; add keyboard navigation between steps.
  - References: `components/AssessmentStepper.tsx:1–44`.
- Success toasts on report generation and save; already present—make consistent across flows.
  - References: `App.tsx:141–147,324–343`.
- Localisation readiness: Externalise strings into a simple dictionary for future Hindi/regional support.

## IFCT & Conversions Integration
- IFCT AI lookup & compare should fail gracefully when API key is absent.
  - References: `components/IFCTLibrary.tsx:38–57`.
- Conversions tool: Keep type-safe `Object.entries` casts; align styles with theme variables.
  - References: `components/ConversionTool.tsx:437–460`.

## Testing & Verification Plan
- Unit/UI tests: Age validation, SES calc transitions, CU compute with members add/remove, sticky stepper rendering, notification panel behaviour.
- Integration tests: AI summary disabled without `VITE_GENAI_API_KEY`; success path with a mock key.
- Manual verification: 
  - 24‑hr flow end-to-end with valid age, SES updates, food add buttons keyboard-accessible.
  - Stock flow CU computes and Adequacy Summary updates.
  - IFCT Library navigation and offline behaviour.

## Rollout & Config
- Introduce `.env` with `VITE_GENAI_API_KEY` and document setup; never log or expose the key.
- Add feature flags for `enable_ai_chat` and optionally `enable_ifct_ai` to gate AI features when key missing.
- Provide a dismissible update banner tied to `appConfigService.getCurrentVersion()` and localStorage.

Please confirm this plan. Once approved, I will implement the changes, run type checks, and validate in the preview.