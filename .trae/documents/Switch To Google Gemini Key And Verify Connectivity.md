## What I’ll Do
- Configure your provided Google API key securely via environment variables (not hardcoded) and select Gemini as the active provider.
- Ensure the DeepSeek fallback is disabled so calls route to Gemini.
- Verify AI Summary, AI Assistant chat, and IFCT AI actions end-to-end.

## Secure Configuration Steps
- Create or edit a local `.env` (never commit secrets):
  - `VITE_GENAI_API_KEY=AIzaSyCeXAOZqUHrHw8fj2-e0GNvEG3bZGutq-4`
  - Remove or comment out `VITE_DEEPSEEK_API_KEY` to force Gemini usage.
- Restart the dev server so `import.meta.env` picks up changes.

## Provider Selection
- The app auto-selects DeepSeek when `VITE_DEEPSEEK_API_KEY` exists, otherwise Gemini when `VITE_GENAI_API_KEY` exists.
- With DeepSeek removed, Gemini becomes the active provider for summaries and chat.

## Google Key Requirements
- Enable “Generative Language API” (Gemini) for your GCP project.
- If the key is restricted by HTTP referrers, add `http://localhost:4173/*` (and any deployed domains) to the allowed origins.
- If the key is IP‑restricted, switch to referrer restrictions for browser use or proxy via a backend.

## Verification
- 24‑hr Summary: Click “Generate AI Summary” in Step K; expect a JSON‑formatted response rendered.
- Stock Summary: Same flow in the stock AI step; confirm success.
- AI Assistant: Send a chat message; confirm the assistant replies.
- IFCT Library: Try “Search with AI”; verify result or a clear error if insufficient context.

## Fallback & Troubleshooting
- If calls fail: check browser console for “API key not configured” vs “403 forbidden” vs “network error”.
- Confirm the API is enabled and restrictions permit local preview.
- I can add a small provider indicator in the UI after confirmation (e.g., “AI Provider: Gemini”).

## Security
- Secrets remain only in your local `.env`. I will not hardcode or log them.

Confirm and I will apply the env changes, disable DeepSeek, restart, and validate in the preview.