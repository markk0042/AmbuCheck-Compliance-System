#!/bin/bash

# Script to set up Android SDK Command Line Tools (without Android Studio)
# This is much smaller than full Android Studio

set -e

ANDROID_HOME="$HOME/Android/Sdk"
SDK_DIR="$ANDROID_HOME"
CMD_TOOLS_DIR="$SDK_DIR/cmdline-tools"

echo "Setting up Android SDK Command Line Tools..."
echo "This will download ~200MB (much smaller than Android Studio's ~1GB+)"
echo ""

# Create Android SDK directory
mkdir -p "$SDK_DIR"

# Check if command line tools already exist
if [ -d "$CMD_TOOLS_DIR/latest" ]; then
    echo "✓ Android SDK Command Line Tools already installed"
else
    echo "Downloading Android SDK Command Line Tools..."
    echo ""
    
    # Download command line tools for Mac
    CMD_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip"
    TEMP_ZIP="/tmp/android-cmdline-tools.zip"
    
    echo "Downloading from: $CMD_TOOLS_URL"
    curl -L -o "$TEMP_ZIP" "$CMD_TOOLS_URL"
    
    echo "Extracting..."
    unzip -q "$TEMP_ZIP" -d "$CMD_TOOLS_DIR"
    mv "$CMD_TOOLS_DIR/cmdline-tools" "$CMD_TOOLS_DIR/latest"
    
    rm "$TEMP_ZIP"
    echo "✓ Command Line Tools installed"
fi

# Add to PATH
export ANDROID_HOME
export PATH="$PATH:$CMD_TOOLS_DIR/latest/bin:$SDK_DIR/platform-tools"

# Accept licenses
echo ""
echo "Accepting Android SDK licenses..."
yes | "$CMD_TOOLS_DIR/latest/bin/sdkmanager" --licenses > /dev/null 2>&1 || true

# Install required SDK components
echo ""
echo "Installing required SDK components (this may take a few minutes)..."
"$CMD_TOOLS_DIR/latest/bin/sdkmanager" \
    "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0" \
    "cmdline-tools;latest"

# Create local.properties for Android build
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
LOCAL_PROPERTIES="$SCRIPT_DIR/local.properties"

if [ ! -f "$LOCAL_PROPERTIES" ]; then
    echo "sdk.dir=$ANDROID_HOME" > "$LOCAL_PROPERTIES"
    echo "✓ Created local.properties"
fi

echo ""
echo "✓ Android SDK setup complete!"
echo ""
echo "Add these to your ~/.zshrc or ~/.bash_profile:"
echo "export ANDROID_HOME=\"$ANDROID_HOME\""
echo "export PATH=\"\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin:\$ANDROID_HOME/platform-tools\""
echo ""
echo "Or run: source ~/.zshrc (or source ~/.bash_profile)"
