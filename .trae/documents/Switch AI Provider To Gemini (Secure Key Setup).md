## Goal
Use Gemini as the active AI provider with your Google API key, while keeping DeepSeek/Puter disabled. No secrets hardcoded; environment variables only.

## Secure Configuration
- Create or update `.env` in the project root (do not commit secrets):
  - `VITE_AI_PROVIDER=gemini`
  - `VITE_GENAI_API_KEY=<your Google Gemini key>`
  - Ensure `VITE_DEEPSEEK_API_KEY` is unset or removed.
- For production builds, set the same variables in the deployment environment (e.g., `.env.production` or host env vars).

## Requirements & Restrictions
- Enable “Generative Language API (Gemini)” for the GCP project bound to your key.
- If key is referrer‑restricted, add `http://localhost:4173/*` and any deployed domains to allowed origins.
- Avoid IP-based restrictions for browser apps; use referrer restrictions or route via a backend.

## App Provider Selection Logic
- When `VITE_AI_PROVIDER=gemini`, the app routes:
  - Diet summaries and stock summaries through Gemini (`services/geminiService.ts`).
  - AI chat via Gemini (`services/aiAssistantService.ts`).
- DeepSeek and Puter are bypassed unless their provider is selected.

## Verification
- Restart the dev server after changing `.env` so `import.meta.env` updates.
- 24‑Hour Recall → Step K → “Generate AI Summary” should return JSON rendered without failure.
- Stock Inventory → AI Summary step should succeed similarly.
- AI Assistant → send a message; the assistant should reply.
- IFCT Library → “Search with AI” should respond or show a clear message if the query is too ambiguous.

## Troubleshooting
- If you see “API key not configured”: confirm `.env` is loaded and restart the server.
- If you see “403/permission denied”: verify API enablement and domain restrictions.
- If responses are slow or fail intermittently, check quota and network status.

## Optional UX Enhancements
- Add a small indicator (e.g., footer text) showing “AI Provider: Gemini” for transparency.
- Add a settings toggle to switch providers at runtime (reads from env + local setting, with safe defaults).

Once you confirm, I will apply the environment changes (without hardcoding the key), restart the preview, and validate all AI flows end‑to‑end. 