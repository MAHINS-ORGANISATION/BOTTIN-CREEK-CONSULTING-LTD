# Bottin Consult

Mobile app for **BOTTIN CREEK CONSULTING LTD** — legal consultancy companion built with [Expo](https://expo.dev) (SDK 54) and [Expo Router](https://docs.expo.dev/router/introduction/).

**Repository:** [MAHINS-ORGANISATION/BOTTIN-CREEK-CONSULTING-LTD](https://github.com/MAHINS-ORGANISATION/BOTTIN-CREEK-CONSULTING-LTD)

## Requirements

- Node.js (LTS recommended)
- npm
- For native builds: [EAS Build](https://docs.expo.dev/build/introduction/) and Expo account

## Setup

```bash
npm install
npx expo start
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm start` | Start Expo dev server |
| `npm run lint` | Run ESLint |
| `npm run eas:android:aab` | EAS production Android App Bundle |
| `npm run store:docx` | Regenerate store listing `.docx` files from `store/*.md` (requires Pandoc and `python-docx`) |

## Configuration

- App config: `app.config.js` (Android package `com.bottincreekconsultingltd.bottinconsult`)
- EAS: `eas.json`
- Store copy and Play Console drafts: `store/`

## Security and signing

**Do not commit** Android keystores (`.jks`, `.keystore`), passwords, or `credentials.json`. Store signing keys in [EAS credentials](https://docs.expo.dev/app-signing/app-credentials/) or Google Play App Signing, and keep backups in an encrypted, non-public location.

## License

Proprietary — BOTTIN CREEK CONSULTING LTD. All rights reserved unless otherwise stated.
