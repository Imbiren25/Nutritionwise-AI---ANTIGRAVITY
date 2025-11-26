## Overview
Add Puter.js as a third AI provider alongside Gemini and DeepSeek, selectable via environment/feature flag. Use a dynamic script loader to avoid bundling external scripts and to keep the integration opt‑in. No backend or API keys required.

## Provider Selection
- Env variable: `VITE_AI_PROVIDER` values: `gemini | deepseek | puter`.
- Default: if not set, use DeepSeek when `VITE_DEEPSEEK_API_KEY` exists; else Gemini when `VITE_GENAI_API_KEY` exists; else Puter if feature flag is enabled and script loads.
- Optional UI indicator: “AI Provider: Puter” for transparency.

## Script Loading
- Create `utils/loadPuter.ts`: load `https://js.puter.com/v2/` via `<script>` tag injection and return a promise that resolves when `window.puter` is available; cache the promise to prevent re‑loads.
- Do not add the script to `index.html` by default to keep it opt‑in.

## Adapter Implementation
- New module `services/puterProvider.ts` implementing minimal adapter:
  - `generateJSON(prompt: string): Promise<any>` → uses `puter.ai.chat(prompt, { model: "gpt-5-nano" })`, expects strict JSON; if text, attempt `JSON.parse`; on failure, add a pre‑prompt “Return only strict JSON matching schema” and retry once.
  - `chatStart(systemInstruction: string)` + `sendMessageStream(message: string)` → uses `puter.ai.chat({ stream: true, model: "gpt-5-nano" })`; yield chunks `{ text }` to match current streaming expectations.
  - `generateImage(prompt: string)` → `puter.ai.txt2img(prompt, { model: "dall-e-3" })`, convert returned DOM element to data URL if needed.
- Update `services/geminiService.ts` and `services/aiAssistantService.ts` provider selection to route calls to Puter when `VITE_AI_PROVIDER=puter`.

## Integration Points
- 24‑Hour Summary: `generateDietSummary(data)` → when provider=puter, build the existing prompt and call `generateJSON`. Validate required keys; surface user‑friendly errors on parse failure.
- Stock Summary: `generateStockSummary(data)` → same as above.
- AI Assistant Chat: `startChat(data)` → when provider=puter, load script and set up streaming; `sendMessageStream(message)` uses Puter’s streamed parts.
- IFCT Library: 
  - `lookupIFCT(name)` and `compareIFCT(names)` → when provider=puter, attempt chat with strict JSON; guard with helpful error if the model cannot conform.
- Meal image: `generateMealImage(prompt)` → when provider=puter, call `txt2img` with `dall-e-3` and return `data:image/*;base64,...` or append element directly.

## Safety & Privacy
- Do not auto‑load Puter.js unless provider=puter (or feature flag enabled).
- Show short disclaimer when Puter is active: “Responses are fetched from Puter’s user‑pays models; no personal assessment data is sent beyond prompts.”
- No secrets stored/logged; Puter requires none.

## Error Handling
- Standardize messages: missing script (network), parse errors (model returned text), offline conditions.
- Fallback path: if Puter fails to return valid JSON, show friendly guidance and allow retry; do not crash.

## Testing & Verification
- Typecheck build.
- Manual tests:
  - With `VITE_AI_PROVIDER=puter`: generate summaries and chat; confirm streaming and JSON parse.
  - Without env: verify existing Gemini/DeepSeek logic unaffected.
  - IFCT Library AI actions behave with Puter (or show clear message).
- Preview validation across 24‑hr and stock flows.

## Rollout
- Provide README snippet (optional) describing provider selection, but keep documentation changes deferred unless requested.
- Feature flag hook available to toggle Puter in UI later.

Confirm to proceed and I’ll implement the adapter, wire selection, load the script safely, and validate in preview.