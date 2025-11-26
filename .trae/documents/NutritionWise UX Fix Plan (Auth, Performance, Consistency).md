## Scope & Goals
- Replace simulated auth with Firebase for real sign-up/login and profile persistence.
- Remove risky external import maps; rely on bundled dependencies.
- Fix Reports print UX (accessible, consistent).
- Reduce bundle size via route/component code-splitting and skeletons.
- Complete theme token sweep for consistent colors/borders in light/dark.
- Minor UX/accessibility polish in AI chat and long policy modal.

## Fix Items & Steps
### 1) Real Authentication (Firebase)
- Add `.env.local` keys: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
- Create `services/firebase.ts` to init app; export `auth`, `db`.
- Refactor `hooks/useAuth.ts`:
  - Subscribe to `onAuthStateChanged(auth, setUser)`.
  - `login(email, pass)`: `signInWithEmailAndPassword`.
  - `signUp(name, email, pass)`: `createUserWithEmailAndPassword` then `setDoc(users/{uid}, profile)`.
  - `logout()`: `signOut`.
  - `updateUser(partial)`: `updateDoc(users/{uid}, partial)` and merge local state.
- Update `Login.tsx`, `SignUp.tsx`, `Profile.tsx` to use new hook; show loading/errors.
- Firestore rules: only owner can read/write their `users/{uid}` and `reports` docs.

### 2) Remove External Import Maps
- Delete `index.html` importmap block (lines ~243–253) to avoid ORB/CDN issues.
- Confirm local `node_modules` bundling via Vite (already in use).

### 3) Reports Print UX
- Ensure Print button triggers `window.print()` and has `aria-label`.
- Verify “Back to Reports” navigates correctly.

### 4) Performance & Code-Splitting
- Lazy-load heavy routes/components: `PDFViewer.tsx`, `Reports.tsx`, `AiAssistant.tsx`.
- Add route-level skeletons; keep existing component skeletons.
- Optionally configure `manualChunks` for vendor splitting.

### 5) Theme Consistency Sweep
- Replace any remaining `text-neutral-*`, `text-gray-*`, `text-primary-green`, `bg-secondary-blue` with tokens: `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, `text-[var(--text-accent)]`, `bg-[var(--bg-secondary)]`, `border-[var(--border-primary)]`.
- Preserve print overrides in `@media print`, ensure on-screen uses tokens.

### 6) UX/Accessibility Polish
- AI chat: add timestamps; support Enter to send, Shift+Enter newline.
- Privacy modal: add mini TOC links for section navigation.
- Optional header: add page title/global search (non-blocking).

## Deliverables
- Firebase auth integration (service, refactored hook, component wiring, Firestore rules).
- Removed import maps; build relies on local dependencies.
- Reports print and navigation polish.
- Code-splitting and skeletons reducing initial bundle.
- Theme token sweep for consistent colors/borders.
- Minor UX/accessibility enhancements.

## Acceptance Tests
- Sign up, login, logout, refresh persists session; profile updates saved to Firestore.
- Print button opens system dialog; back navigation works.
- Bundle shrinks and loads faster; skeletons visible during lazy-load.
- All pages readable in light/dark; focus rings and aria labels present.

## Execution Order
1) Firebase auth
2) Import map removal
3) Reports print UX
4) Code-splitting & skeletons
5) Theme sweep
6) UX/accessibility polish

Please approve, and I’ll start executing these steps immediately.