# Quick Start: Build Android .aab File (No Android Studio Required)

## One-Time Setup (5-10 minutes)

### 1. Install Android SDK Command Line Tools (~200MB)

```bash
cd client/android
./setup-android-sdk.sh
```

This downloads and installs the Android SDK (much smaller than Android Studio's 1GB+).

### 2. Add to Your Shell Profile

Add these lines to `~/.zshrc` (or `~/.bash_profile` if using bash):

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
```

Then reload:
```bash
source ~/.zshrc
```

### 3. Generate Signing Keystore (One-time)

```bash
cd client/android
./generate-keystore.sh
```

**IMPORTANT:** Save your keystore password! You'll need it for all future app updates.

---

## Building the .aab File

After the one-time setup above, building is simple:

```bash
cd client/android
./build-aab.sh
```

That's it! The script will:
1. Build your React app
2. Sync with Android
3. Generate the signed .aab file

The .aab file will be at:
`android/app/build/outputs/bundle/release/app-release.aab`

---

## Upload to Google Play Store

1. Go to https://play.google.com/console
2. Create a new app (or select existing)
3. Go to "Production" → "Create new release"
4. Upload the `.aab` file
5. Fill in release notes and publish

---

## Troubleshooting

**"ANDROID_HOME not set"**
- Make sure you added the export lines to your shell profile
- Run `source ~/.zshrc` (or `source ~/.bash_profile`)

**"Keystore not found"**
- Run `./generate-keystore.sh` first

**"Gradle build failed"**
- Make sure you ran `./setup-android-sdk.sh` first
- Check that `local.properties` exists in the android folder

For more details, see `BUILD_INSTRUCTIONS.md`
