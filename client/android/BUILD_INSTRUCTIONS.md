# Building Android App Bundle (.aab) for Google Play Store

This guide will help you build a signed Android App Bundle (.aab) file for publishing to the Google Play Store.

## Prerequisites

1. **Java JDK 17 or higher** - Check with `java -version` (you have this ✓)
2. **Android SDK Command Line Tools** - We'll install this (~200MB, much smaller than Android Studio)
3. **Internet connection** - For downloading SDK components

**Note:** This guide uses command-line tools only - no Android Studio required!

## Step 1: Set Up Android SDK (One-time setup)

Run the setup script to install Android SDK Command Line Tools (~200MB):

```bash
cd client/android
./setup-android-sdk.sh
```

This will:
- Download Android SDK Command Line Tools
- Install required SDK components
- Set up environment variables

**After running, add to your `~/.zshrc` or `~/.bash_profile`:**
```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
```

Then reload: `source ~/.zshrc` (or `source ~/.bash_profile`)

## Step 2: Generate Signing Keystore

The keystore is required to sign your app for release. **Keep this file and password safe - you'll need it for all future updates!**

### Option A: Using the Script (Recommended)

```bash
cd android
./generate-keystore.sh
```

Follow the prompts to:
- Enter a keystore password (min 6 characters)
- Enter key password (or press Enter to use same as keystore)
- Enter your details (or use defaults)

This will create:
- `app/ambucheck-release.keystore` - Your signing key
- `keystore.properties` - Configuration file (already in .gitignore)

### Option B: Manual Generation

```bash
cd android/app
keytool -genkey -v \
    -keystore ambucheck-release.keystore \
    -alias ambucheck \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass YOUR_KEYSTORE_PASSWORD \
    -keypass YOUR_KEY_PASSWORD \
    -dname "CN=AmbuCheck, OU=Development, O=AmbuCheck, L=City, ST=State, C=IE"
```

Then create `android/keystore.properties`:
```properties
storeFile=app/ambucheck-release.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=ambucheck
keyPassword=YOUR_KEY_PASSWORD
```

## Step 3: Build the .aab File (Easy Method)

Use the automated build script:

```bash
cd client/android
./build-aab.sh
```

This script will:
1. Build your React app
2. Sync Capacitor
3. Generate the signed .aab file

The .aab file will be at:
`android/app/build/outputs/bundle/release/app-release.aab`

---

## Alternative: Manual Build Steps

### Step 3a: Build the React App

First, build your React app:

```bash
cd client
npm run build
```

This creates the `build/` folder with your web assets.

### Step 3b: Sync Capacitor

Sync the web assets to Android:

```bash
cd client
npx cap sync
```

### Step 3c: Build the .aab File

```bash
cd client/android
./gradlew bundleRelease
```

The .aab file will be created at:
`android/app/build/outputs/bundle/release/app-release.aab`

## Step 4: Upload to Google Play Console

1. Go to https://play.google.com/console
2. Create a new app or select existing app
3. Go to "Production" → "Create new release"
4. Upload the `.aab` file from:
   `android/app/build/outputs/bundle/release/app-release.aab`
5. Fill in release notes
6. Review and publish

## Important Notes

- **Keep your keystore safe!** If you lose it, you cannot update your app on Google Play.
- The keystore file and `keystore.properties` are in `.gitignore` and will NOT be committed to git.
- For production, update `capacitor.config.ts` with your production API URL.
- Test the app on a device or emulator before publishing.

## Troubleshooting

### "Gradle sync failed"
- Make sure Android Studio has downloaded all SDK components
- Check that Java JDK is properly configured

### "Keystore file not found"
- Make sure you've generated the keystore first (Step 1)
- Check that `keystore.properties` exists and paths are correct

### "Build failed"
- Make sure you've run `npm run build` first
- Run `npx cap sync` to update Android assets
- Check Android Studio's Build output for specific errors

## Updating the App

For future updates:
1. Update version in `android/app/build.gradle`:
   - `versionCode` - Increment by 1 (e.g., 1 → 2)
   - `versionName` - Update version string (e.g., "1.0" → "1.1")
2. Build and sync: `npm run build && npx cap sync`
3. Build .aab: `cd android && ./gradlew bundleRelease`
4. Upload new .aab to Google Play Console
