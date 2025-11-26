## Authorized Domains
- Already correct: `localhost`, `nutritionwise-ai.firebaseapp.com`, `nutritionwise-ai.web.app`
- Optionally add if you use them: `127.0.0.1` and your local network IP (e.g., `10.53.237.174`)
- Add any custom production domains you plan to use

## Enable Providers
- Authentication → Sign‑in method → enable `Email/Password`
- Optionally enable `Google` and complete OAuth consent

## Fix Config And Env
- Storage bucket must be `nutritionwise-ai.appspot.com` (verify on Console → Storage header)
- Create `.env.local` with:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID` (only if Analytics enabled)
- Restart the dev server so envs load
- Ensure TypeScript recognizes Vite envs (`tsconfig` types include `vite/client`, or add `src/env.d.ts`)

## Verify Real Auth Path
- With envs set, `services/firebase.ts` should set `firebaseReady = true`
- App uses the Firebase‑backed branch in `hooks/useAuth.ts` rather than demo mode

## End‑to‑End Test
- Sign up from the app
- Console → Authentication → Users: confirm the new user appears
- Firestore → Data: confirm `users/{uid}` document is created

## If Issues Persist
- `auth/invalid-api-key`: recheck `.env.local` values, restart dev server
- `auth/domain-not-authorized`: ensure your current host is listed in Authorized domains
- Firestore “permission denied”: confirm you are signed in and rules allow access