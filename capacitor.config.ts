import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rajputritravels.tripsheet',
  appName: 'Rajputri Tripsheet',
  webDir: 'public',
  server: {
    url: 'https://www.rajputritravels.com/tripsheet',
    cleartext: false
  }
};

export default config;
