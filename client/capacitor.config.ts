import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ambucheck.app',
  appName: 'AmbuCheck',
  webDir: 'build',
  // server.url removed - axios.js handles API URL directly for production
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
