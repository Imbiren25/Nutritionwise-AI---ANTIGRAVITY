## Status
- Authorized domains are correctly set: `nutritionwise-ai.firebaseapp.com`, `nutritionwise-ai.web.app`, `NUTRITIONWISEAPP.rf.gd`, `nutritionwise.rf.gd`.

## Configure Environment
- Create `.env.production` with Firebase Web App keys:
```
VITE_FIREBASE_API_KEY=YOUR_WEB_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=nutritionwise-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nutritionwise-ai
VITE_FIREBASE_STORAGE_BUCKET=nutritionwise-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```
- Optionally add same keys to `.env.local` for dev.

## Build & Deploy
- Run `npm run build` locally to embed `VITE_*` keys.
- Upload `dist/` to `NUTRITIONWISEAPP.rf.gd/htdocs/`:
  - `index.html`, `assets/*`, `.htaccess`

## Authentication Enablement
- In Firebase Console → Authentication → Sign-in method → enable Email/Password.
- SignUp → creates `users/{uid}` with profile fields.
- Login → authenticates and navigates beyond landing.

## Demo Mode Off
- With valid env keys, `services/firebase.ts` sets `firebaseReady=true` and the app uses real Firebase Auth (no demo credentials).

## Verify On Live Site
- Visit `https://nutritionwise.rf.gd/`.
- Sign up a new account; confirm it appears in Authentication and in Firestore `users/{uid}`.
- Log out and log in; session persists.

## Troubleshooting
- `auth/domain-not-allowed`: recheck Authorized domains include `nutritionwise.rf.gd`.
- `auth/invalid-api-key`: verify `VITE_FIREBASE_API_KEY`.
- `permission-denied` on Firestore: start with test rules, later tighten.

## Next Actions
- I will add `.env.production` with your keys, rebuild, deploy, and verify sign-up/login end-to-end on `nutritionwise.rf.gd`. Confirm to proceed.