## Phase 1 Objectives
- Implement real authentication with Firebase (Email/Password) and user profile persistence.
- Remove external import maps to rely on bundled dependencies.
- Fix Reports print UX to be accessible and reliable.

## Detailed Steps
### A. Firebase Authentication Integration
1. Console Setup:
   - Create Firebase project → add Web App
   - Enable Email/Password (optional: Google) under Authentication → Sign‑in method
   - Copy config: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
2. Environment Variables:
   - Add to `.env.local`: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
3. New Service:
   - Create `services/firebase.ts` to initialize Firebase using `import.meta.env`
   - Export `auth` (getAuth) and `db` (getFirestore)
4. Refactor `hooks/useAuth.ts`:
   - Subscribe to `onAuthStateChanged(auth, setUser)`
   - Implement `login(email, password)` via `signInWithEmailAndPassword`
   - Implement `signUp(name, email, password)` via `createUserWithEmailAndPassword` then `setDoc(doc(db, 'users', uid), profile)`
   - Implement `logout()` via `signOut`
   - Implement `updateUser(partial)` via `updateDoc(doc(db, 'users', uid), partial)` and merge local state
   - Remove simulated DB/localStorage persistence
5. Components Wiring:
   - Update `Login.tsx`, `SignUp.tsx`, `Profile.tsx` to use the new hook; add loading and error states
   - After sign up, route to `ProfileSetup` to complete profile fields
6. Firestore Rules:
   - `match /databases/{database}/documents { match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid } }`

### B. Remove External Import Maps
1. Edit `index.html` and remove the `importmap` block referencing CDN packages
2. Verify the app builds using local `node_modules` via Vite

### C. Reports Print UX
1. Ensure the print control calls `window.print()` and has `aria-label="Print / Save as PDF"`
2. Verify “Back to Reports” navigates correctly and has `aria-label`

## Deliverables (Phase 1)
- `services/firebase.ts` with initialized `auth` and `db`
- Refactored `hooks/useAuth.ts` using Firebase
- Updated `Login.tsx`, `SignUp.tsx`, `Profile.tsx` for new flow
- Firestore security rules snippet
- Removed external import maps from `index.html`
- Reports print button wired with proper accessibility labels

## Acceptance Tests (Phase 1)
- Sign up, login, logout, refresh persists session; profile updates saved to Firestore
- Print button opens system dialog; back navigation returns to Reports
- App builds successfully without external import maps; no ORB/blocked resources

## Next (Phase 2 Preview)
- Code-splitting for heavy routes (PDFViewer, Reports, AiAssistant) with skeletons
- Theme token sweep for any residual hardcoded colors
- Minor UX/accessibility: chat timestamps, Enter/Shift+Enter handling, privacy TOC