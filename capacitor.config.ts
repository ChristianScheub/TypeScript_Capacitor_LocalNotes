import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.scheub.localNotes',
  appName: 'Local-Notes',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'never',
    scrollEnabled: true,
    overrideUserAgent: undefined,
    preferredContentMode: 'mobile'
  },
  plugins: {
    Filesystem: {
      androidPermissions: [
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE'
      ]
    }
  }
  
};

export default config;
