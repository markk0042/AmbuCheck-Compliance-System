#!/bin/bash

# Script to build Android App Bundle (.aab) using command line only
# No Android Studio required!

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building Android App Bundle (.aab) for AmbuCheck${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CLIENT_DIR="$(dirname "$SCRIPT_DIR")"
ANDROID_DIR="$SCRIPT_DIR"

# Check if Android SDK is set up
if [ -z "$ANDROID_HOME" ]; then
    ANDROID_HOME="$HOME/Android/Sdk"
    export ANDROID_HOME
    export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
fi

# Set Java 17 for Gradle (required for Android builds)
if [ -d "/usr/local/opt/openjdk@17" ]; then
    export JAVA_HOME="/usr/local/opt/openjdk@17"
    export PATH="$JAVA_HOME/bin:$PATH"
    echo "Using Java 17 for build"
elif [ -d "/opt/homebrew/opt/openjdk@17" ]; then
    export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
    export PATH="$JAVA_HOME/bin:$PATH"
    echo "Using Java 17 for build"
fi

# Update gradle.properties with correct Java path
if [ ! -z "$JAVA_HOME" ]; then
    # Remove old org.gradle.java.home line if exists
    sed -i '' '/^org.gradle.java.home=/d' "$ANDROID_DIR/gradle.properties"
    # Add new Java home path
    echo "org.gradle.java.home=$JAVA_HOME" >> "$ANDROID_DIR/gradle.properties"
fi

# Check if keystore exists
if [ ! -f "$ANDROID_DIR/app/ambucheck-release.keystore" ]; then
    echo -e "${YELLOW}⚠ Keystore not found!${NC}"
    echo "Generating keystore..."
    cd "$ANDROID_DIR"
    ./generate-keystore.sh
    echo ""
fi

# Check if keystore.properties exists
if [ ! -f "$ANDROID_DIR/keystore.properties" ]; then
    echo -e "${RED}✗ keystore.properties not found!${NC}"
    echo "Please run: cd android && ./generate-keystore.sh"
    exit 1
fi

# Step 1: Build React app
echo -e "${GREEN}Step 1: Building React app...${NC}"
cd "$CLIENT_DIR"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ React build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ React build complete${NC}"
echo ""

# Step 2: Sync Capacitor
echo -e "${GREEN}Step 2: Syncing Capacitor...${NC}"
npx cap sync

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Capacitor sync failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Capacitor sync complete${NC}"
echo ""

# Step 3: Build .aab
echo -e "${GREEN}Step 3: Building Android App Bundle...${NC}"
cd "$ANDROID_DIR"

# Make gradlew executable
chmod +x gradlew

# Build the bundle
./gradlew bundleRelease

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi

# Find the .aab file
AAB_FILE="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"

if [ -f "$AAB_FILE" ]; then
    AAB_SIZE=$(du -h "$AAB_FILE" | cut -f1)
    echo ""
    echo -e "${GREEN}✓ Build successful!${NC}"
    echo ""
    echo "Your .aab file is ready:"
    echo -e "${GREEN}$AAB_FILE${NC}"
    echo "Size: $AAB_SIZE"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://play.google.com/console"
    echo "2. Create a new app or select existing app"
    echo "3. Upload this .aab file to Google Play Console"
    echo ""
else
    echo -e "${RED}✗ .aab file not found at expected location!${NC}"
    exit 1
fi
