# Bottin Consult – Google Play Console Help form (draft answers)

Based on this repository (`package.json`, `app.config.js`, app source). Descriptive answers are **700 characters or fewer** where applicable. You must still answer **yes/no** and **multiple-choice** fields yourself in the Console. **This is not legal advice.**

---

## Your app’s core functionality

### 1. Does your app function differently based on a user’s geolocation or language? If yes, why? *

**Suggested answer (also use for question 9):**

```
No. The app does not use GPS, coarse location, or region APIs. All users see the same English UI and catalogue. The only system-driven variation is light or dark appearance, which follows the device theme (userInterfaceStyle: automatic), not country or language selection.
```

**Character count:** 249

---

### 2. Have you uploaded all Proof of Permission for any intellectual property that appears in your app? *

**You must answer Yes/No in the form.** If you use third-party fonts and icons as below, attach or link proof as Google requests.

**Suggested supporting note (if a text box allows):**

```
We use Google Fonts distributed via @expo-google-fonts (Cormorant Garamond, DM Sans) under their font licenses, and Ionicons via @expo/vector-icons (Expo). Brand logo and in-app photos are our firm’s assets or created for this app. We will upload or attach license or permission evidence as required.
```

**Character count:** 268

**(Also use for question 10.)**

---

## User data, third-party code, and SDKs

### 3. What SDKs does your app use and why? *

**Suggested answer:**

```
Expo SDK 54 + React Native: core. expo-router + @react-navigation (native, drawer, bottom-tabs, elements): navigation. react-native-screens, gesture-handler, reanimated, safe-area-context, worklets: UI motion. expo-font + @expo-google-fonts (Cormorant Garamond, DM Sans): fonts. @expo/vector-icons: icons. expo-image, expo-linear-gradient: visuals. expo-print, expo-sharing: PDF + share sheet. expo-linking, expo-web-browser: links. expo-haptics, splash-screen, status-bar, system-ui, constants, symbols: UX. expo-build-properties: Android build. AsyncStorage: onboarding flag only. react / react-dom / react-native-web: runtime.
```

**Character count:** 629

---

### 4. Explain how you ensure that any 3rd party code and SDKs used in your app comply with our policies. *

**Suggested answer:**

```
We depend on maintained, public packages from Expo and React Navigation with documented licenses. We install versions aligned with Expo SDK, run dependency updates deliberately, and do not add advertising or analytics SDKs beyond this stack. Fonts and icons come from official Expo/Google Fonts channels with published license terms. We review Play policies and SDK disclosures when publishing. If Google flags a library, we update or replace it per guidance.
```

**Character count:** 399

---

## Content and demo

### 5. Intellectual property

**Facts for your own notes (not a single Console field):**

- **Typography:** Cormorant Garamond and DM Sans via `@expo-google-fonts/*` (check each package’s license file in `node_modules`, typically SIL OFL).
- **Icons:** Ionicons bundled with Expo (`@expo/vector-icons`).
- **Images and logo:** Files under `assets/` (ensure your organisation owns or has licensed them).
- **Text:** Service catalogue, blog copy, and company strings in `constants/` (your content).

---

### 6. Please select the statement that applies to you: *

**You must pick the option that matches your situation in the form.** Typical mappings:

- If **BOTTIN CREEK CONSULTING LTD** owns the app, branding, and commissioned assets: choose the option that states you **own** or **have all necessary rights** to the content.
- If any asset is licensed from a third party: choose the option about **permission / license** and ensure question 2 evidence is complete.

---

### 7. Please upload a video demo of your app *

**This cannot be generated from the repo.** Record a short screen capture (e.g. Android emulator or device) showing:

1. Onboarding (skip or complete).  
2. Home and Services tabs; open one service detail.  
3. Add to order; open Order tab.  
4. Optional: Profile fields; generate PDF and cancel or share to a safe destination.  
5. Blog and Contact (mailto if acceptable on device).

Keep the video within any length limit Google states. No sensitive real client data in the recording.

---

## Developer account and core functionality (repeat)

### 8. Did somebody register this developer account on your behalf? If so, please explain why. *

**Only you can answer accurately.**

- If **no:** “No. I registered the account myself.”  
- If **yes:** Explain briefly (e.g. agency or colleague name and role) in **under 700 characters**, for example:

```
Yes. [Name/organisation] created the Play Console account on my behalf as [role]. I am the authorised representative for BOTTIN CREEK CONSULTING LTD / Bottin Consult and control releases and signing keys.
```

(Customise; keep factual.)

---

### 9. Does your app function differently based on a user’s geolocation or language? If yes, why? *

**Same as question 1** (copy the block above).

---

### 10. Have you uploaded all Proof of Permission for any intellectual property that appears in your app? *

**Same as question 2** (your Yes/No plus evidence; reuse the supporting note if needed).

---

## Quick reference summary

| Topic | Finding in codebase |
|-------|---------------------|
| **Core purpose** | Legal consultancy companion: services catalogue, cart/order flow, optional profile, on-device PDF, blog-style content, contact. |
| **Geolocation** | Not used. |
| **Language** | Single English UI; no i18n routing. |
| **Login wall** | No accounts or auth flows in `app/`. |
| **SDKs** | Expo + React Native + React Navigation + listed Expo modules + AsyncStorage. |
| **Third-party IP** | Google Fonts (Expo packages), Ionicons (Expo), plus your assets under `assets/`. |

---

*Update this document if you add location, analytics, auth, or new native modules.*
