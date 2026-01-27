# Testing AmbuCheck on iPhone

## Prerequisites

1. **Xcode** - Download from Mac App Store (free, but ~10GB)
   - Search "Xcode" in App Store
   - Install (this may take 30+ minutes)

2. **Apple ID** - Free account works for testing on your own device

## Method 1: Test on Your iPhone (Physical Device)

### Step 1: Build and Sync

```bash
cd client
npm run build
npx cap sync ios
```

### Step 2: Open in Xcode

```bash
npx cap open ios
```

This opens Xcode with your project.

### Step 3: Connect Your iPhone

1. Connect your iPhone to your Mac via USB
2. Unlock your iPhone
3. Trust this computer if prompted

### Step 4: Configure Signing in Xcode

1. In Xcode, click on "App" in the left sidebar (under "TARGETS")
2. Go to "Signing & Capabilities" tab
3. Check "Automatically manage signing"
4. Select your **Team** (your Apple ID)
5. Xcode will automatically create a signing certificate

### Step 5: Select Your iPhone and Run

1. At the top of Xcode, next to the play button, click the device selector
2. Choose your connected iPhone
3. Click the **Play button** (▶️) or press `Cmd + R`
4. Xcode will build and install the app on your iPhone

**Note:** First time, you may need to:
- Go to iPhone Settings → General → VPN & Device Management
- Trust your developer certificate
- Then open the AmbuCheck app on your iPhone

---

## Method 2: Test on iPhone Simulator (No Physical Device Needed)

### Step 1: Build and Sync

```bash
cd client
npm run build
npx cap sync ios
```

### Step 2: Open in Xcode

```bash
npx cap open ios
```

### Step 3: Select Simulator

1. At the top of Xcode, click the device selector
2. Choose an iPhone simulator (e.g., "iPhone 15 Pro")
3. Click the **Play button** (▶️) or press `Cmd + R`
4. The simulator will open and run your app

---

## Quick Commands

**Build, sync, and open:**
```bash
cd client
npm run build && npx cap sync ios && npx cap open ios
```

**Just sync (after code changes):**
```bash
cd client
npm run build && npx cap sync ios
```

Then in Xcode, click the play button again to see changes.

---

## Troubleshooting

**"No signing certificate found"**
- Make sure you're signed in to Xcode with your Apple ID
- Xcode → Settings → Accounts → Add your Apple ID

**"App won't install on iPhone"**
- Check iPhone Settings → General → VPN & Device Management
- Trust your developer certificate

**"Build failed"**
- Make sure Xcode is fully installed and updated
- Try: Xcode → Settings → Locations → Command Line Tools → Select Xcode version

---

## Notes

- The app will connect to your Render backend automatically
- First build may take 5-10 minutes (Xcode downloads dependencies)
- Subsequent builds are much faster
