## Create Project And Register Web App
- Sign in to Firebase Console → Add project → Name it (e.g., "NutritionWise")
- (Optional) Enable Analytics; otherwise skip
- On the project overview, click the Web (</>) icon → Register the web app → copy the config values

## Fix And Use The Config Safely
- storageBucket must end with `appspot.com` (e.g., `nutritionwise-ai.appspot.com`)
- Create `.env.local` and add:
  - `VITE_FIREBASE_API_KEY=`
  - `VITE_FIREBASE_AUTH_DOMAIN=`
  - `VITE_FIREBASE_PROJECT_ID=`
  - `VITE_FIREBASE_STORAGE_BUCKET=`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID=`
  - `VITE_FIREBASE_APP_ID=`
  - `VITE_FIREBASE_MEASUREMENT_ID=` (only if Analytics is enabled)
- In code, initialize using envs and guard Analytics:
```
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  getAnalytics(app)
}
```

## Enable Authentication
- Build → Authentication → Get started
- Sign-in method: enable Email/Password; optionally enable Google
- Settings → Authorized domains: add `localhost`, your dev host, and your production domain (e.g., `nutritionwise-ai.web.app`)

## Set Up Firestore
- Build → Firestore Database → Create database → Production mode
- Location: choose `asia-south1 (Mumbai)` or nearest to users
- Start with rules allowing only authenticated access; tighten later

## Configure Storage (If Needed)
- Build → Storage → Get started → confirm bucket name and region family
- Restrict access to signed-in users with appropriate rules

## App Check (Recommended)
- Build → App Check → Get started → select your web app → reCAPTCHA v3
- Enforce after verifying local development works

## Analytics (Optional)
- Project Settings → Integrations → enable Google Analytics
- Ensure `measurementId` is present in your envs

## TypeScript Env Support
- Add Vite client types so `import.meta.env` compiles:
  - tsconfig `compilerOptions.types` includes `vite/client`, or create `src/env.d.ts` with `/// <reference types="vite/client" />`

## Firebase CLI And Hosting
- `npm install -g firebase-tools` (or use `npx firebase-tools`)
- `firebase login` → `firebase projects:list` → `firebase use nutritionwise-ai`
- `firebase init hosting` → use existing project → public directory `dist` → SPA rewrites: Yes
- `npm run build` → `firebase deploy --only hosting`
- Add the Hosting domain to Authorized domains if using Auth in production

## Verify
- Authentication → Users should list accounts after you sign up/login via the app
- Firestore → Data shows created documents
- Hosting URL loads the app and Auth works (no domain errors)

## Troubleshooting
- `auth/invalid-api-key`: envs don’t match console or dev server needs restart
- `auth/domain-not-authorized`: add your domain in Authorized domains
- Firestore permission denied: confirm signed-in user and rules
- Analytics issues: only initialize when `measurementId` exists and you’re in a browser