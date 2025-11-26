# Deployment Guide for NutritionWise AI

## Hosting on nutritionwiseai.rf.gd (InfinityFree)

Your application has been built and is ready for deployment. Follow these steps to host it:

### 1. Locate the Build Folder
The production-ready files are located in the **`dist`** folder in your project directory:
`/Users/dr.mihirpatel/Downloads/Biren /Anti gravity/nutritionwise-ai (4) (1)- anti gravity/dist`

### 2. Connect to FTP / File Manager
1. Log in to your InfinityFree account (or your hosting provider for `nutritionwiseai.rf.gd`).
2. Open the **File Manager** or connect via an FTP client (like FileZilla).
3. Navigate to the **`htdocs`** folder. This is the public root of your website.

### 3. Upload Files
1. **Delete** any existing files in `htdocs` (like the default `index2.html` or welcome files).
2. **Upload** all the contents **inside** the `dist` folder to `htdocs`.
   - Ensure you upload the **contents**, not the `dist` folder itself.
   - You should see `index.html`, `assets/`, `logo.png`, and `.htaccess` directly inside `htdocs`.

### 4. Verify .htaccess
The `.htaccess` file is critical for the app to work correctly (it handles the routing).
- Ensure `.htaccess` was uploaded. (Note: It might be hidden in some file managers. Look for "Show Hidden Files" settings).
- If it's missing, create a new file named `.htaccess` in `htdocs` and paste this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 5. Test the Site
Visit [http://nutritionwiseai.rf.gd](http://nutritionwiseai.rf.gd) (or https if SSL is enabled).
- The app should load.
- Try refreshing the page while on a sub-route (e.g., `/login`) to ensure the `.htaccess` rewrite is working.

## Troubleshooting
- **White Screen:** Check the browser console (F12) for errors. If you see 404s for assets, ensure all files from `assets/` were uploaded.
- **404 on Refresh:** This means `.htaccess` is missing or not working. Double-check step 4.
