#!/bin/bash

# Script to generate Android signing keystore for AmbuCheck
# Run this script to create your release keystore

echo "Generating Android release keystore for AmbuCheck..."
echo ""

# Prompt for keystore password
read -sp "Enter keystore password (min 6 characters): " KEYSTORE_PASSWORD
echo ""
read -sp "Confirm keystore password: " KEYSTORE_PASSWORD_CONFIRM
echo ""

if [ "$KEYSTORE_PASSWORD" != "$KEYSTORE_PASSWORD_CONFIRM" ]; then
    echo "Error: Passwords do not match!"
    exit 1
fi

if [ ${#KEYSTORE_PASSWORD} -lt 6 ]; then
    echo "Error: Password must be at least 6 characters!"
    exit 1
fi

# Prompt for key password (can be same as keystore password)
read -sp "Enter key password (press Enter to use same as keystore): " KEY_PASSWORD
echo ""

if [ -z "$KEY_PASSWORD" ]; then
    KEY_PASSWORD="$KEYSTORE_PASSWORD"
fi

# Generate keystore
keytool -genkey -v \
    -keystore app/ambucheck-release.keystore \
    -alias ambucheck \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "CN=AmbuCheck, OU=Development, O=AmbuCheck, L=City, ST=State, C=IE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Keystore created successfully at: app/ambucheck-release.keystore"
    echo ""
    
    # Create keystore.properties file
    cat > keystore.properties << EOF
storeFile=app/ambucheck-release.keystore
storePassword=$KEYSTORE_PASSWORD
keyAlias=ambucheck
keyPassword=$KEY_PASSWORD
EOF
    
    echo "✓ keystore.properties created"
    echo ""
    echo "IMPORTANT: Keep these credentials safe! You'll need them to update your app."
    echo "The keystore file and keystore.properties are in .gitignore and won't be committed."
else
    echo ""
    echo "Error: Failed to create keystore"
    exit 1
fi
