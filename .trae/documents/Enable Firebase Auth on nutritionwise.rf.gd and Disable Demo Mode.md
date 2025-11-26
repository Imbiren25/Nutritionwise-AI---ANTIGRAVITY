## Prereqs
- Firebase project with a Web app created; access to Console.
- InfinityFree hosting working at `https://nutritionwise.rf.gd/`.

## Firebase Console Setup
- Authentication → Sign-in method → enable Email/Password.
- Authentication → Settings → Authorized domains → add:
  - `nutritionwise.rf.gd`
  - `localhost:5173`, `localhost:4173` (for local testing)
- Firestore Database → Create database (start in test mode for dev). 
- Optional: Create `users` collection and confirm test document read/write.

## Environment Configuration
- Create `.env.production` in the project root with your Firebase web app config:
```
VITE_FIREBASE_API_KEY=YOUR_WEB_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```
- Optional for local dev: add the same keys to `.env.local`.
- The app reads these in `services/firebase.ts`, enabling `firebaseReady` when keys are valid.

## Build & Deploy
- Run `npm run build` to generate `dist/`.
- Upload `dist/` to `NUTRITIONWISEAPP.rf.gd/htdocs/` ensuring:
  - `htdocs/index.html`
  - `htdocs/assets/*`
  - `htdocs/.htaccess`
- Keep `.env.production` local; do not upload it. The build embeds public `VITE_*` values.

## Turn Off Demo Mode
- With valid env keys and successful initialization, `firebaseReady` becomes true and the app uses real Firebase Auth:
  - Sign-up: creates `users/{uid}` and sets display name.
  - Login: authenticates via Firebase.
- No code changes are needed beyond providing valid environment variables and Authorized domains.

## UI Behavior
- Login uses empty fields by default; enter real credentials.
- Sign-up captures name/email/password; on success, the app proceeds to profile setup (`App.tsx`).

## Verify on nutritionwise.rf.gd
- Navigate to `https://nutritionwise.rf.gd`.
- Sign up a new user → confirm in Firebase Console `Authentication` and `Firestore` (`users/{uid}`).
- Log out and log in with the same account.
- Complete an assessment; ensure app flows without demo-mode warnings.

## Troubleshooting
- If auth fails: confirm `nutritionwise.rf.gd` is in Authorized domains and env keys match the Firebase project.
- If `firebaseReady` is false: check console for initialization errors; verify all required keys exist.
- Firestore rule issues: start with test rules during setup, then enforce owner-only rules later.

## Next Actions
- I will add `.env.production` with your Firebase keys, rebuild, deploy to `nutritionwise.rf.gd`, and validate sign-up/login end-to-end. Confirm to proceed.