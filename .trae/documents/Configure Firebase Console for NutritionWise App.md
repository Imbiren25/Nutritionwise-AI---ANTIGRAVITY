## Prerequisites
- Node.js ≥ 18 and npm installed
- Firebase project already created in Firebase Console (Project ID: `nutritionwise-ai`)
- Correct Storage bucket in Console → Storage (ends with `appspot.com`)

## Install Firebase CLI
- Global install: `npm install -g firebase-tools`
- If you get EACCES/permission errors on macOS:
  - Use `npx firebase-tools` (no global install), or
  - Install via Homebrew: `brew install firebase-cli`

## Log In And Select Project
- Log in: `firebase login`
- Verify projects: `firebase projects:list`
- Set default project locally: `firebase use nutritionwise-ai`

## Initialize Hosting (Single-Page App)
- From the app root, run: `firebase init hosting`
- Choose “Use an existing project” → select `nutritionwise-ai`
- Public directory: `dist` (Vite build output)
- Configure as SPA: Yes (rewrite all to `index.html`)

## Build And Deploy
- Build app: `npm run build`
- Deploy hosting: `firebase deploy --only hosting`
- Copy the Hosting URL shown in the output

## Authorize Domains For Auth
- Firebase Console → Authentication → Settings → Authorized domains
- Add your Hosting domain (e.g., `nutritionwise-ai.web.app` or custom domain)
- Ensure `localhost` and any dev domains are present

## Environment Variables (Vite)
- In `.env.local` add:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET` (e.g., `nutritionwise-ai.appspot.com`)
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
  - `VITE_FIREBASE_MEASUREMENT_ID` (only if Analytics enabled)
- Restart dev server after changes

## TypeScript Support For `import.meta.env`
- Ensure Vite types are loaded:
  - In `tsconfig.json` → `compilerOptions.types: ["vite/client"]`, or
  - Create `src/env.d.ts` with `/// <reference types="vite/client" />`

## Optional: Firestore/Storage Rules
- Initialize: `firebase init firestore` and/or `firebase init storage`
- Start with restricted rules (authenticated only):
  - Firestore: `allow read, write: if request.auth != null;`
  - Storage: restrict uploads/reads to signed-in users per your needs
- Deploy rules: `firebase deploy --only firestore` (or `--only storage`)

## Local Emulators (Recommended For Testing)
- Initialize: `firebase init emulators`
- Select Authentication, Firestore, Storage (as needed)
- Start: `firebase emulators:start`
- Point your app to emulators in dev using SDK settings (Auth, Firestore, Storage)

## Verify
- Authentication → Users: sign up/login from the app
- Firestore → Data: confirm reads/writes
- Hosting: open your `web.app`/`firebaseapp.com` URL and test end-to-end

## Troubleshooting
- `auth/invalid-api-key`: env values don’t match console; restart server
- `auth/domain-not-authorized`: add domain in Authorized domains
- Firestore permission denied: confirm signed-in user and rules
- Analytics errors: enable Analytics and provide `measurementId`, or guard initialization to browser only

## Security/Basics
- Do not commit `.env.local`
- Do not create/commit service account keys in frontend; use server-side only if needed
- Prefer least-privilege Firestore/Storage rules and review regularly