#!/bin/bash

# Simplified keystore generation - prompts for password once and uses it for both

echo "Generating Android release keystore for AmbuCheck..."
echo ""
echo "You'll be asked for a password. Use a simple password you can type consistently."
echo "Example: AmbuCheck2026"
echo ""

# Prompt for password once
read -sp "Enter keystore password (min 6 characters): " PASSWORD
echo ""

if [ ${#PASSWORD} -lt 6 ]; then
    echo "Error: Password must be at least 6 characters!"
    exit 1
fi

# Generate keystore using the same password for both store and key
keytool -genkey -v \
    -keystore app/ambucheck-release.keystore \
    -alias ambucheck \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$PASSWORD" \
    -keypass "$PASSWORD" \
    -dname "CN=AmbuCheck, OU=Development, O=AmbuCheck, L=City, ST=State, C=IE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Keystore created successfully at: app/ambucheck-release.keystore"
    echo ""
    
    # Create keystore.properties file
    cat > keystore.properties << EOF
storeFile=app/ambucheck-release.keystore
storePassword=$PASSWORD
keyAlias=ambucheck
keyPassword=$PASSWORD
EOF
    
    echo "✓ keystore.properties created"
    echo ""
    echo "Your password is: $PASSWORD"
    echo "IMPORTANT: Save this password! You'll need it to update your app."
    echo ""
else
    echo ""
    echo "Error: Failed to create keystore"
    exit 1
fi
