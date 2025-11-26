# Hosting Guide: NUTRITIONWISEAPP.rf.gd (InfinityFree)

This guide explains how to host your React application on InfinityFree (or any other shared hosting with cPanel/FTP).

## Prerequisites

1.  **InfinityFree Account**: You should have access to the control panel for `NUTRITIONWISEAPP.rf.gd`.
2.  **FTP Client (Optional)**: FileZilla is recommended, but you can also use the "Online File Manager" provided by InfinityFree.

## Step 1: Prepare the Build

I have already prepared the project for you. The key addition is the `.htaccess` file, which ensures that when users refresh a page (like `/assessment`), they don't get a 404 error.

1.  Run the build command in your terminal (I will do this for you):
    ```bash
    npm run build
    ```
2.  This creates a `dist` folder in your project directory. **This folder contains everything you need to upload.**

## Step 2: Upload to Server

### Option A: Using Online File Manager (Easiest)
1.  Log in to your InfinityFree Client Area.
2.  Click on "Manage" for your account (`NUTRITIONWISEAPP.rf.gd`).
3.  Click on **"File Manager"**.
4.  Navigate to the `htdocs` folder.
    *   *Note: If there are default files like `index2.html` or `default.php`, delete them.*
5.  **Upload the CONTENTS of the `dist` folder**:
    *   Open your local `dist` folder.
    *   Select ALL files (`index.html`, `logo.png`, `.htaccess`, `assets/` folder, etc.).
    *   Drag and drop them into the `htdocs` folder in the File Manager.
    *   **Important**: Ensure `.htaccess` is uploaded. If you don't see it, check "Show Hidden Files" settings.

### Option B: Using FileZilla (Faster for many files)
1.  Get your FTP details from the InfinityFree dashboard (Host, Username, Password, Port 21).
2.  Connect using FileZilla.
3.  Open `htdocs` on the remote site (right side).
4.  Open `dist` on your local site (left side).
5.  Select all files in `dist` and drag them to `htdocs`.

## Step 3: Verify

1.  Open `http://NUTRITIONWISEAPP.rf.gd` in your browser.
2.  The app should load.
3.  **Test Routing**: Navigate to a page (e.g., Start Assessment), then **Refresh** the browser. If the page reloads correctly without a 404 error, the `.htaccess` file is working.

## Troubleshooting

*   **White Screen**: Check the "Console" tab in your browser's Developer Tools (F12) for errors.
*   **404 on Refresh**: Ensure the `.htaccess` file is present in `htdocs`.
