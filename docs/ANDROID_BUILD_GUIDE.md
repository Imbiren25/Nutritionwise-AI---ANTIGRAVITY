# Android Build Guide

This guide explains how to build the NutritionWise AI application for Android using Capacitor and Android Studio.

## Prerequisites

1.  **Android Studio**: Download and install the latest version from [developer.android.com](https://developer.android.com/studio).
2.  **Java Development Kit (JDK)**: Ensure you have a compatible JDK installed (JDK 17 is recommended for recent Android builds).
    *   *Note: If you see "Unsupported class file major version" errors, check your Java version.*

## Step 1: Sync the Project

Before opening Android Studio, ensure your web assets are built and synced to the Android project.

Run the following command in your terminal:

```bash
npm run android
```

This command will:
1.  Build the React web app (`npm run build`).
2.  Copy the build assets to the `android/` folder (`npx cap sync`).
3.  Open the project in **Android Studio** (`npx cap open android`).

## Step 2: Configure in Android Studio

Once Android Studio opens:

1.  **Wait for Gradle Sync**: Android Studio will attempt to sync the project. If it asks to update Gradle or the Android Gradle Plugin, you can usually accept.
2.  **App Icons**:
    *   Right-click on the `app` folder in the project view (left sidebar).
    *   Go to **New** -> **Image Asset**.
    *   Select "Launcher Icons (Adaptive and Legacy)".
    *   In "Path", select the `public/logo.png` file from your project.
    *   Adjust the scaling to fit.
    *   Click **Next** -> **Finish**.

## Step 3: Run on Emulator or Device

1.  Select a device from the top toolbar (e.g., "Pixel 3a API 34" or your connected physical device).
2.  Click the green **Run** (Play) button.
3.  The app should launch on the emulator/device.

## Step 4: Build for Play Store (Release)

To publish to the Google Play Store, you need a Signed App Bundle (.aab).

1.  In Android Studio, go to **Build** -> **Generate Signed Bundle / APK**.
2.  Select **Android App Bundle** and click **Next**.
3.  **Key Store Path**: Click "Create new..." to create a keystore file (keep this safe! You need it to update the app later).
    *   Fill in the details (Password, Alias, etc.).
4.  Select the key you just created.
5.  Click **Next**.
6.  Select **release** build variant.
7.  Click **Create**.

Android Studio will generate a `.aab` file. You can upload this file to the [Google Play Console](https://play.google.com/console).

## Troubleshooting

*   **Gradle Errors**: If you encounter Gradle errors, try "File" -> "Invalidate Caches / Restart".
*   **Java Version**: Ensure your `JAVA_HOME` environment variable points to a valid JDK (e.g., JDK 17).
