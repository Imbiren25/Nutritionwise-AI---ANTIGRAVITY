## Objectives
- Replace simulated auth with Firebase Authentication for secure sign up/login.
- Persist user sessions and store profile fields (name, college, course, batch, avatarUrl).
- Keep UI/UX consistent with the app’s design system and current flow.

## Firebase Setup (Console)
1) Create a Firebase project and add a Web App.
2) Enable Authentication → Sign-in method → Email/Password (optionally Google).
3) Copy Web App config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
4) Add these to `.env.local` as:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## Code Changes
- Install: `firebase` (runtime)
- Add `services/firebase.ts`:
  - Initialize app using `import.meta.env.VITE_FIREBASE_*`
  - Export `auth` (getAuth) and `db` (getFirestore)

- Refactor `hooks/useAuth.ts`:
  - Replace local `usersDB` with Firebase auth state via `onAuthStateChanged`
  - `login(email, pass)`: `signInWithEmailAndPassword`
  - `signUp(name, email, pass)`: `createUserWithEmailAndPassword`, then write a user profile doc to `Firestore` (e.g., `users/{uid}`) with `{ name, email, college, course, batch, avatarUrl }`
  - `logout()`: `signOut`
  - `updateUser(partial)`: update Firestore doc and local state
  - Persist auth automatically; remove localStorage manual persistence (Firebase manages session)

- Update components:
  - `components/Login.tsx`: call `useAuth().login`, show error messages, loading states, and success navigation
  - `components/SignUp.tsx`: call `useAuth().signUp`, then navigate to `ProfileSetup` to complete optional fields
  - `components/Profile.tsx`: reading/writing profile via `updateUser` (writes to Firestore)

- App wiring (`App.tsx`):
  - Keep current page flow; `useAuth` exposes `user` from Firebase state
  - Gate features based on `user !== null`

## Firestore Rules (Security)
- `match /users/{uid}`: allow read/write only if `request.auth.uid == uid`
- Optional: `reports` collection — restrict to owner UID

## Env/Config
- Use `import.meta.env.VITE_FIREBASE_*` directly in `services/firebase.ts`
- Keep `.env.local` git-ignored; never commit real keys

## UI/UX
- Preserve existing styling and inputs; show inline validation (email format, min password length)
- Add loading spinners to Login/SignUp buttons; show friendly error text from Firebase

## Error Handling
- Map Firebase error codes (e.g., `auth/user-not-found`, `auth/wrong-password`, `auth/email-already-in-use`) to concise messages

## Verification
- Run locally; sign up a new user; confirm session persists across refresh
- Update profile fields; verify changes saved in Firestore
- Logout and login again

## Deliverables
- New `services/firebase.ts`
- Refactored `useAuth.ts` using Firebase
- Updated `Login.tsx` and `SignUp.tsx` for Firebase flow
- Optional Firestore rules snippet for deployment

## Confirmation
If approved, I will implement the integration, add the service and hook refactor, update login/signup components, and provide a short test checklist to verify functionality end-to-end.