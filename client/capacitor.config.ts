import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ambucheck.app',
  appName: 'AmbuCheck',
  webDir: 'build',
  server: {
    // Use your Render backend URL for production
    url: process.env.REACT_APP_API_URL || 'https://ambucheck-compliance-system.onrender.com',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'android/app/ambucheck-release.keystore',
      keystoreAlias: 'ambucheck'
    }
  },
  ios: {
    // iOS-specific configuration
    contentInset: 'automatic'
  }
};

export default config;
