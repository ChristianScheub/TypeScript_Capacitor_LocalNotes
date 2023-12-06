import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'de.scheub.localNotes',
  appName: 'Local-Notes',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
