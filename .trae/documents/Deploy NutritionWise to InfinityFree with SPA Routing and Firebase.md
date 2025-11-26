## Build Artifacts
- Confirm production build exists in `dist/` with `index.html` and `assets/*`.
- Create `.env.production` with your Firebase web app keys (`VITE_FIREBASE_*`) so the build bakes in production config.
- Rebuild with `npm run build` to ensure the production env is embedded.

## Package Upload
- Open InfinityFree → your account → Manage → Control Panel → File Manager.
- Navigate to your domain’s `htdocs/` folder and remove placeholder files.
- Upload `dist/` contents so the final structure is:
  - `htdocs/index.html`
  - `htdocs/assets/...` (and any other static folders)
- If uploading a zip, extract inside `htdocs/` and move files from `dist/` up to the `htdocs/` root (no `htdocs/dist/index.html`).

## SPA Routing (.htaccess)
- In `htdocs/`, add `.htaccess` with:
```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```
- Ensures client-side routes like `/profile` or `/dashboard` resolve to `index.html`.

## Force HTTPS (Optional, Recommended)
- After SSL is issued (next section), add to `.htaccess` above SPA rules:
```
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```
- Redirects `http://` to `https://`.

## Firebase Configuration
- In Firebase Console → Project Settings → Your apps → copy web app config into `.env.production`:
  - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID` (optional).
- Authentication → Sign-in method: enable `Email/Password` (and others you need).
- Authentication → Settings → Authorized domains: add `NUTRITIONWISEAPP.rf.gd`.
- Firestore: create DB (start in test for dev), set rules appropriately before production.
- Rebuild with these envs so `services/firebase.ts` initializes (`app`, `auth`, `db`).

## SSL Certificates
- InfinityFree Dashboard → SSL Certificates → add `NUTRITIONWISEAPP.rf.gd`.
- Follow instructions to add required CNAME records; wait for issuance; activate SSL.
- Then enable HTTPS redirect via `.htaccess` as above.

## Verify Live App
- Open `https://NUTRITIONWISEAPP.rf.gd`.
- Check UI parity with local preview and inspect Console for errors.
- Validate routes (refresh on deep links like `/profile`) and ensure assets load without 404s.
- Common fixes: rebuild with correct envs; ensure assets are at `htdocs/*`; ensure `.htaccess` exists.

## DNS & Propagation Troubleshooting
- If the domain doesn’t resolve or shows a DNS resolution page:
  - Flush local DNS cache (macOS: `sudo dscacheutil -flushcache`).
  - Try public DNS (Google: `8.8.8.8`/`8.8.4.4`, Cloudflare: `1.1.1.1`/`1.0.0.1`).
  - Allow for propagation (often 2–48 hours; sometimes up to 72 hours).
  - Test resolution with `nslookup NUTRITIONWISEAPP.rf.gd`, `dig`, or `ping` from different networks.

## Next Actions
- I will prepare `.env.production`, rebuild, zip `dist/`, upload to `htdocs/`, add `.htaccess`, configure Firebase domains, issue SSL, and verify the live app end-to-end.

Please confirm, and I will execute these steps immediately.