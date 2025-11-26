## Root Cause
- The Gemini backend returns `API_KEY_INVALID` (400) for the Generative Language API, causing two error logs:
  - Low-level service error from `sendMessageStream` in `services/aiAssistantService.ts`.
  - Propagated UI error in `components/AiAssistant.tsx` when the throw is re-caught.
- Common reasons: invalid key value, Generative Language API not enabled for the key’s GCP project, referrer/IP restrictions blocking requests from `http://localhost:4173/`, or env variables not loaded (dev server not restarted).

## Fix Strategy
- Validate provider readiness at app start and gate AI features when keys are missing/invalid.
- Map API errors to friendly, actionable messages and avoid duplicate console logs.
- Update UI to disable chat/generation when provider is not configured, with inline guidance.

## Implementation Steps
### Provider Readiness & Gating
- Add a provider readiness check utility (env + simple ping) used by:
  - `App.tsx` (sets a global `aiReady` flag)
  - `components/steps/StepK.tsx` (Diet AI summary generation)
  - `components/stock_steps/StockStep_AI_Summary.tsx` (Stock AI summary)
  - `components/AiAssistant.tsx` (chat init and send)
- When not ready:
  - Disable AI buttons/inputs and show a concise message: “AI provider not configured or key invalid. Check API key, domain restrictions, and restart.”

### Error Mapping & Messaging
- In `services/aiAssistantService.ts:70–78`, catch and parse API errors to map:
  - `API_KEY_INVALID` → “API key invalid. Use `VITE_GENAI_API_KEY` for Gemini. Ensure Generative Language API is enabled and domain `http://localhost:4173/*` is permitted.”
  - `PERMISSION_DENIED`/`QUOTA_EXCEEDED`/network → specific messages.
- Return a typed error object; the UI shows a single friendly message and avoids duplicate `console.error`.

### UI Updates
- `components/AiAssistant.tsx:39–47` wrap `startChat` in `try/catch`, set a non-blocking banner when provider unavailable.
- `components/AiAssistant.tsx:54–92` handle send failures by replacing the generic error with the mapped message, and avoid adding a second console log.
- `components/steps/StepK.tsx` and `components/stock_steps/StockStep_AI_Summary.tsx`: gate the “Generate AI Summary” button when not ready; show inline guidance.
- Optional: small footer indicator “AI Provider: Gemini” when active, aiding troubleshooting.

### Environment Guidance (no code change)
- Ensure `.env` has:
  - `VITE_AI_PROVIDER=gemini`
  - `VITE_GENAI_API_KEY=<your key>`
- Restart dev server after changes.
- In GCP: enable Generative Language API; allow `http://localhost:4173/*` if referrer-restricted.

## Verification
- With valid Gemini key:
  - Start AI Assistant; send a message → should respond without errors.
  - 24‑hr and Stock AI summaries generate JSON successfully.
- With invalid/missing key:
  - Chat and generation controls disabled; single clear guidance appears; no duplicate error logs.

## Safety
- No secrets logged or stored; env-only configuration.
- All user-facing errors are sanitized and actionable.

Confirm and I’ll implement the gating, error mapping, and UI updates, then validate in the preview.