## Root Cause
- Sign up is blocked because the app is in demo mode. This is triggered when Firebase isn’t configured: see `services/firebase.ts:24-45` (env keys check and `firebaseReady` flag) and `hooks/useAuth.ts:33-87` (demo-mode auth, signUp returns disabled at `hooks/useAuth.ts:73-75`).

## Option A (Recommended): Enable Real Firebase Auth
1) Configure Firebase envs
- Create `.env.local` with exact values from Firebase Web config:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET` (must end with `appspot.com`)
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID` (only if Analytics enabled)
- Restart dev server

2) Enable Email/Password provider and domains
- Firebase Console: Authentication → Get started → Sign-in method → enable Email/Password
- Authentication → Settings → Authorized domains → add `localhost` and your production domain (e.g., `*.web.app`)

3) Ensure TypeScript recognizes `import.meta.env`
- Add Vite types (either `tsconfig.json` types: `"vite/client"` or a `src/env.d.ts` with `/// <reference types="vite/client" />`) to fix compile errors

4) Verify
- The app should now set `firebaseReady = true` (`services/firebase.ts:24-45`), so the Firebase-backed path in `hooks/useAuth.ts:89-185` is used
- Try sign-up; a user should be created and written to Firestore at `users/{uid}`

## Option B (Fallback): Allow Local Sign‑Up In Demo Mode
- If you want sign-up without Firebase, update the demo branch in `hooks/useAuth.ts:33-87` to accept `name/email/password`, persist a local user in `localStorage`, and return success instead of the disabled message (`hooks/useAuth.ts:73-75`).
- Note: This is local-only and won’t create real accounts.

## Safeguards / Edge Cases
- `auth/invalid-api-key`: env values wrong or dev server not restarted
- Wrong `storageBucket`: must be `*.appspot.com`, not `firebasestorage.app`
- Domain auth errors: add your host to Authorized domains
- Analytics: only init when `measurementId` exists and you’re in a browser

## Deliverables
- Update envs and console settings (Option A) OR enable local sign-up (Option B)
- Confirm sign-up works end-to-end (user visible in Firebase Console → Authentication → Users)
