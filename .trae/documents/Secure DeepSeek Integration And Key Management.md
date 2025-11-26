## Overview
Add DeepSeek as a first-class AI provider with secure key handling and provider selection. Never hardcode or commit secrets. Use environment variables and a provider adapter to switch between DeepSeek and Gemini.

## Secure Key Handling
- Create a local `.env` (not committed) and add `VITE_DEEPSEEK_API_KEY=YOUR_KEY`.
- Keep `.env` in gitignore; never log or expose the key in UI or console.
- Mask errors: show human-friendly messages (missing key, offline, rate limit) without printing secrets.

## Provider Adapter
- Add `services/aiProvider.ts` with a minimal interface:
  - `TextProvider.generateJSON({ prompt, schema })` for summaries.
  - `ChatProvider.start(systemInstruction)` and `sendMessageStream(message)` for chat.
- Implement two clients:
  - `DeepSeekProvider` (uses `import.meta.env.VITE_DEEPSEEK_API_KEY`) against DeepSeek’s OpenAI-compatible chat completions API; enable streaming for chat.
  - `GeminiProvider` (uses `import.meta.env.VITE_GENAI_API_KEY`) via existing `@google/genai` code.

## Selection Logic
- In `services/geminiService.ts` and `services/aiAssistantService.ts`, replace direct calls with adapter calls.
- Selection rule:
  - If `VITE_DEEPSEEK_API_KEY` is present, use `DeepSeekProvider`.
  - Else if `VITE_GENAI_API_KEY` is present, use `GeminiProvider`.
  - Else, disable AI features and surface a clear configuration message.

## Usage Points To Update
- 24‑hr diet summary: `generateDietSummary` → provider `generateJSON` with the existing response schema.
- Stock summary: `generateStockSummary` → provider `generateJSON` with stock schema.
- AI Assistant chat: `startChat` and `sendMessageStream` → provider-backed chat with streaming when available.
- IFCT Library AI lookups/compare: guard on provider availability; show friendly fallback when key missing.

## Error & UX Handling
- Standardize error messages: missing key, offline, quota/rate limit, generic error.
- Keep loader states and success toasts consistent across 24‑hr and stock flows.
- Maintain accessibility (buttons disabled states, aria labels) and theme consistency.

## Testing & Verification
- Type check after refactor.
- Manual tests:
  - With `VITE_DEEPSEEK_API_KEY` set: AI summary and chat work; faster responses via DeepSeek.
  - Without keys: Generate buttons disabled; clear configuration messages.
- Preview validation of end-to-end flows (24‑hr and stock) and IFCT Library AI actions.

## Important Security Note
- I will not store or echo the provided secret in code or logs. Please place it locally in `.env` as `VITE_DEEPSEEK_API_KEY=sk-********************`.

Confirm to proceed and I’ll implement the adapter, update services, and validate in the running preview.