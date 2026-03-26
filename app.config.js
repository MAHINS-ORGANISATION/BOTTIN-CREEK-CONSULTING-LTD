/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const proguardPath = path.join(__dirname, 'proguard-rules.pro');
const extraProguardRules = fs.existsSync(proguardPath) ? fs.readFileSync(proguardPath, 'utf8') : '';

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Bottin Consult',
  slug: 'bottin-consult',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo.png',
  scheme: 'bottinconsult',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.bottincreekconsultingltd.bottinconsult',
  },
  android: {
    package: 'com.bottincreekconsultingltd.bottinconsult',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#0a1628',
      foregroundImage: './assets/images/logo.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [],
  },
  web: {
    output: 'static',
    favicon: './assets/images/logo.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/logo.png',
        imageWidth: 220,
        resizeMode: 'contain',
        backgroundColor: '#fdfcfa',
        dark: {
          backgroundColor: '#0a1628',
        },
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          buildToolsVersion: '35.0.0',
          enableMinifyInReleaseBuilds: true,
          enableShrinkResourcesInReleaseBuilds: true,
          extraProguardRules,
          networkInspector: false,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    router: {},
    eas: {
      /**
       * Set by `eas init` or when building:
       *   EAS_PROJECT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx eas build ...
       */
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
};

module.exports = { expo: config };
