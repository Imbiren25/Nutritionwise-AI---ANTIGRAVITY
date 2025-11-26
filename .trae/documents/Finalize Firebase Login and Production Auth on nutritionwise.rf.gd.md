## Confirm CLI Login
- Run: `firebase login --no-localhost`
- Verify: `firebase projects:list` shows your projects.
- Set default: `firebase use --add` → choose `nutritionwise-ai`.
- Optional: Get SDK config: `firebase apps:sdkconfig web` to cross-check `VITE_FIREBASE_*`.

## Enable Auth in Console
- Authentication → Sign-in method → enable Email/Password.
- Authentication → Settings → Authorized domains (already set):
  - `nutritionwise-ai.firebaseapp.com`, `nutritionwise-ai.web.app`
  - `NUTRITIONWISEAPP.rf.gd`, `nutritionwise.rf.gd`

## Environment Keys
- Create `.env.production` with your Web app config:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=nutritionwise-ai.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nutritionwise-ai
VITE_FIREBASE_STORAGE_BUCKET=nutritionwise-ai.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```
- Optional: mirror into `.env.local` for dev.

## Build & Deploy (InfinityFree)
- `npm run build` → upload `dist/` to `htdocs/`:
  - `index.html`, `assets/*`, `.htaccess`
- InfinityFree serves `https://nutritionwise.rf.gd/`; Firebase CLI hosting is not required.

## Turn Off Demo Mode
- With valid env keys, `services/firebase.ts` sets `firebaseReady=true`.
- App uses real Firebase Auth (sign-up/login) automatically; no demo credentials.

## Firestore Rules (Owner-only)
- Start test rules for setup; then enforce:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
    match /users/{userId} { allow read, write: if isOwner(userId); }
    match /reports/{reportId} { allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid; }
  }
}
```
- Deploy rules via CLI: `firebase deploy --only firestore:rules`.

## Verify On Live Site
- Visit `https://nutritionwise.rf.gd/?i=1` (InfinityFree adds query on first load).
- Sign up a new user; confirm in Firebase Authentication and `users/{uid}` in Firestore.
- Log out and log in; session persists.
- Complete an assessment and finish; confirm report save and normal app flow.

## Troubleshooting
- `auth/domain-not-allowed`: recheck Authorized domains include both RF.gd variants.
- `auth/invalid-api-key`: confirm `VITE_FIREBASE_API_KEY` matches Web app.
- Firestore permission issues: ensure rules and `userId` population on writes.

## Next Actions
- I will add `.env.production` with your keys, rebuild, upload the new `dist/` to `htdocs/`, deploy Firestore rules via CLI, and validate sign-up/login end-to-end on `nutritionwise.rf.gd`. Confirm to proceed.