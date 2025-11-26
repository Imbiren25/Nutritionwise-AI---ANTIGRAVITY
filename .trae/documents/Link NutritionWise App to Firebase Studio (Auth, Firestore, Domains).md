## Prereqs
- Firebase Console access with Owner/Editor role
- Installed Firebase CLI (optional for hosting): `npm i -g firebase-tools`

## Create Project & Web App
- In Firebase Console → Add project → name it (e.g., NutritionWise)
- Project Settings → Your apps → Create Web app → copy config values

## Environment Setup
- Create `.env.local` for development and `.env.production` for production containing:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```
- The app reads these in `services/firebase.ts:5–22`; ensure `apiKey`, `authDomain`, `projectId`, `appId` are set.

## Enable Services
- Authentication → Sign-in method → enable `Email/Password` (and others as needed)
- Firestore Database → Create database → start in test mode for dev (tighten later)

## Authorized Domains
- Authentication → Settings → Authorized domains:
  - `localhost`
  - `localhost:5173`, `localhost:4173`
  - `NUTRITIONWISEAPP.rf.gd` (your InfinityFree domain)

## Firestore Collections
- Create `users` collection (document id = Firebase UID):
  - Fields: `name`, `email`, `college`, `course`, `batch`, `avatarUrl`
  - App reads/writes these in `hooks/useAuth.ts:12`, `:107–118`, `:157–174`
- Create `reports` collection (auto-id documents):
  - Fields:
    - `userId` (string)
    - `type` (`24-Hour Recall` | `Stock Inventory`)
    - `respondentName` (string)
    - `completionDate` (timestamp/string)
    - `data` (map) — `AssessmentData` or `StockInventoryData` from `types.ts`
    - `aiResponse` (map) — schema in `types.ts:190–208`
    - `createdAt` (timestamp, server)
    - `updatedAt` (timestamp, server)

## Security Rules
- Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }

    match /reports/{reportId} {
      allow read, write: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
  }
}
```
- Add composite index if prompted for queries like `where userId == X orderBy completionDate desc`

## Local Verification
- Set `.env.local` → `npm run dev`
- `services/firebase.ts` initializes when keys are present (`firebaseReady` true)
- Test auth:
  - Sign up → creates `users/{uid}` (`hooks/useAuth.ts:107–118`)
  - Update profile → merges into `users/{uid}` (`hooks/useAuth.ts:157–174`)
- Test data flow:
  - Generate AI summary; later add “Save Report” to write `reports/{autoId}` with `userId`, `type`, `data`, `aiResponse`

## Production Verification
- Set `.env.production` → rebuild: `npm run build`
- Upload `dist/` to InfinityFree `htdocs/` and ensure `index.html`, `assets/*`, `.htaccess`
- Confirm domain is in Authorized domains; sign-in works; Firestore reads/writes succeed

## Troubleshooting
- If auth fails: ensure domain whitelisted and API key restrictions allow your origins
- If Firestore fails: check rules and console errors; verify project ID/env values
- If domain shows DNS page: flush DNS cache; try public DNS; wait propagation; retest

## Next Actions
- I will add `.env.production`, validate `firebaseReady`, create collections in Firestore Studio, apply rules, and implement a “Save Report” write to `reports` with proper schema. Confirm to proceed.