# Bottin Consult – Permissions

This note reflects the **Expo / app configuration** in this repository and what typically appears on **Android** after dependencies are merged into the final manifest. Always review the **merged `AndroidManifest.xml`** from your release build (or the Play Console pre-launch report) before you tick boxes in Play Console.

---

## 1. Declared in `app.config.js` (`android.permissions`)

The project sets:

```json
"permissions": []
```

That means **no extra dangerous permissions are added through the Expo config** beyond what the build toolchain and libraries merge in.

---

## 2. What the app feature set implies

- **No** runtime prompts are implemented in app code for camera, microphone, contacts, calendar, SMS, location, or storage **for the core flows described in the store listing**.  
- **Optional profile and order data** are entered in standard text fields; they are not described here as requiring special Android permission groups beyond normal app operation.

---

## 3. Commonly merged permission (check your AAB)

Many React Native / Expo apps end up with **`INTERNET`** in the merged manifest because networking libraries are present, even if the app is mostly offline or uses bundled assets.  

**Action:** Open the release **merged manifest** (or use Android Studio’s manifest merger view) and list every `uses-permission` entry.

If **`INTERNET`** is present:

- **Purpose:** General connectivity where used by the platform or libraries (for example, loading non-bundled resources or system components).  
- **Play Console:** Declare only if Google’s form treats it as required for your build; many apps declare network access at a high level.

---

## 4. Permissions you should **not** expect from this project (unless you add plugins)

Unless you add new native modules or change config, you should **not** see app-driven requirements for:

- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`  
- `READ_CONTACTS` / `WRITE_CONTACTS`  
- `CAMERA` / `RECORD_AUDIO`  
- `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` (legacy scoped storage model)  
- `READ_PHONE_STATE` (unless introduced by a dependency)

---

## 5. iOS (reference)

iOS permission **usage description strings** (`NSPhotoLibraryUsageDescription`, etc.) are only required if you use APIs that trigger those prompts. This project’s documented scope does not add optional photo or location usage strings in the config reviewed for this file; confirm after any plugin change.

---

## Summary

| Source | Permissions |
|--------|-------------|
| Expo `android.permissions` | Empty array (no additional declares from config) |
| Merged manifest | Verify on build; often includes `INTERNET` from dependencies |

*Update this file whenever you add Expo config plugins, native modules, or change permissions in `app.config.js`.*
