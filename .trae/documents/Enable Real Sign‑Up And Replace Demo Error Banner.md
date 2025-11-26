## Root Cause
- The red banner text comes from `errors.server` set by `onSignUp(...)`.
- In demo mode (`firebaseReady === false`), `hooks/useAuth.ts:73-75` returns `{ success:false, message:'Sign up is disabled in demo mode.' }` which renders in `components/SignUp.tsx:126`.

## Fix Sign‑Up (Enable Firebase)
1) Configure `.env.local` with Firebase Web config (exact values):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET` (must be `*.appspot.com`)
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (only if Analytics enabled)
2) Restart dev server so envs load.
3) Firebase Console → Authentication:
- Sign‑in method: enable Email/Password
- Settings → Authorized domains: you already have `localhost`, `nutritionwise-ai.firebaseapp.com`, `nutritionwise-ai.web.app` (add `127.0.0.1` and your LAN IP if you use them)
4) Ensure TypeScript recognizes `import.meta.env` (Vite types or `src/env.d.ts`).
5) Verify: `services/firebase.ts` sets `firebaseReady = true`, app uses the real Firebase path in `hooks/useAuth.ts:89-185`, and sign‑up succeeds.

## UI Improvement For Clarity
- In `components/SignUp.tsx`, render a guidance banner when Firebase isn’t ready:
  - If `!firebaseReady`, show a neutral info message with steps (configure envs, enable provider, restart) instead of a red error.
  - Disable the submit button while Firebase isn’t ready to prevent confusing failures.
- Keep the red error banner for genuine backend errors (e.g., weak password, email already in use).

## Optional Fallback (Local Demo Sign‑Up)
- If you need sign‑up without Firebase temporarily, modify the demo branch in `hooks/useAuth.ts:33-87` to accept name/email/password, persist to `localStorage`, and return success; remove the disabled message.
- Note: This won’t create real accounts.

## Verification
- Attempt sign‑up → see new user under Console → Authentication → Users.
- Firestore → Data shows `users/{uid}` document created.

## Deliverables
- Real sign‑up works (error banner no longer shown).
- Better UX banner when Firebase isn’t configured, with submit disabled to avoid false failures.
- Optional: Local demo sign‑up if requested.