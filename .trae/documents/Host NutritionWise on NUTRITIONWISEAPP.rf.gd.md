## Build
- Run `npm run build` to generate production artifacts in `dist/`.
- Confirm `dist/index.html`, `dist/assets/*`, and `.htaccess` exist.

## Package
- Optionally zip the contents of `dist/` to `nutritionwise_build.zip`.
- Ensure `index.html` is at the root of the archive (not nested under another folder).

## InfinityFree Control Panel
- Open your account → Manage → Control Panel → File Manager.
- Navigate to your domain’s `htdocs/` folder.
- Remove placeholder files like `index2.html` to avoid conflicts.

## Upload
- Upload the contents of `dist/` into `htdocs/`:
  - Final structure must be:
    - `htdocs/index.html`
    - `htdocs/assets/...`
    - `htdocs/.htaccess`
- If you upload a zip, extract inside `htdocs/`, then move files out of any `dist/` folder so `index.html` sits directly in `htdocs/`.

## SPA Routing
- Ensure `htdocs/.htaccess` contains:
```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```
- This serves `index.html` for client-side routes like `/profile` or `/reports`.

## Firebase Configuration
- In Firebase Console → Authentication → Settings → Authorized domains:
  - Add `NUTRITIONWISEAPP.rf.gd`, plus local dev domains (`localhost:5173`, `localhost:4173`).
- Verify `.env.production` includes your Firebase web app keys (`VITE_FIREBASE_*`) and rebuild.
- After upload, sign-in should work and saving reports should write to `Firestore` (`users`, `reports`).

## SSL (HTTPS)
- InfinityFree Dashboard → SSL Certificates → add domain.
- Create required CNAME records; wait issuance; activate SSL.
- To force HTTPS, add above SPA rules in `.htaccess`:
```
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Verify Live Site
- Open `https://NUTRITIONWISEAPP.rf.gd`.
- Check UI parity with local preview; inspect Console for errors.
- Deep-link to a route (e.g., `/profile`) and refresh to confirm SPA rewrite works.
- Test sign-up/login; complete an assessment; finish to save a report.

## Troubleshooting
- DNS resolution errors: flush local DNS cache, try public DNS (Google 8.8.8.8/8.8.4.4; Cloudflare 1.1.1.1/1.0.0.1), allow 2–48 hours for propagation.
- 404s on routes: ensure `.htaccess` exists in `htdocs` with the SPA rules.
- Firebase errors: confirm Authorized domains and correct `VITE_FIREBASE_*` values; check Firestore rules allow owner access.

## Next Actions
- I will build, zip `dist/`, upload to `htdocs/`, place `.htaccess`, whitelist the domain in Firebase, enable SSL, and validate the live app end-to-end. Confirm to proceed.