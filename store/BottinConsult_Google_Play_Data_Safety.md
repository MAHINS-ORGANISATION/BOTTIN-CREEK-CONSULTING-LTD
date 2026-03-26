# Bottin Consult – Google Play Data Safety Form (Guidance)

Use this as a reference when completing the Play Console **Data safety** section. Adjust answers if you change the app. This reflects the current design: minimal persistence, no developer-operated backend for user content, no third-party analytics SDKs in the default build.

---

## 1. Does your app collect or share any of the required user data types?

**Answer:** Yes, limited types may be **collected on the device** as described below. The app does **not** transmit that content to BOTTIN CREEK CONSULTING LTD’s servers as part of normal app operation. Users may **share** a generated PDF themselves using the system share sheet; that is outside the app’s automatic data flow.

---

## 2. Data types to declare (typical selections)

### Personal info

Declare only if you treat optional profile fields as “collected” when the user enters them (they exist in memory for the session and may appear in a user-initiated PDF):

| Field (if user provides it) | Suggested handling in the form |
|------------------------------|--------------------------------|
| Name                         | Collected, **On device** / processed for **app functionality** (order summary PDF). **Not shared** with the developer automatically. **Optional**. |
| Email address                | Same as name. |
| Phone number                 | Same as name. |
| Other (e.g. organisation, notes) | Same as name, optional. |

If Google’s form offers **“Processed only on device”** or **ephemeral** options for data that never leaves the device except via the user’s own share action, use those where accurate.

### App activity

| Data                         | Suggested handling |
|------------------------------|--------------------|
| Onboarding completion flag   | A small value may be **stored on device** (e.g. so the intro is not shown again). **App functionality**. **Not shared** with the developer automatically. |

---

## 3. Data you should **not** declare as collected by the app (for this project)

Unless you add them later:

- Precise or approximate **location**
- **Photos or videos** (no gallery access in the declared configuration)
- **Contacts**
- **SMS / call logs**
- **Files and docs** outside what the user explicitly exports via share
- **Financial info** (no in-app payments in this description)
- **Health / fitness**
- **Messages** (no in-app messaging to the firm’s servers)

---

## 4. Sharing

- **Is data shared with third parties?** For the app’s own network calls to your servers: **No** (as currently described).  
- **Play services / OS:** Standard device and Google Play processing may still apply under Google’s policies; that is separate from your in-app declaration.  
- **User-initiated share:** When the user shares a PDF to another app, that recipient is chosen by the user; declare according to Google’s guidance for user-directed disclosure.

---

## 5. Security practices (high level)

- Declare practices that match reality: e.g. if user data is not sent to your backend, **encryption in transit** for that path may be **not applicable**; data at rest on device follows the OS sandbox.  
- Do **not** claim encryption or practices you do not implement.

---

## 6. Data deletion

- Explain that users can **clear app data** or **uninstall** to remove locally stored items (including the onboarding flag).  
- Session-only fields clear when the **app process** ends.

---

## 7. Children

- The experience is intended for **adults**. State that you do not knowingly collect children’s data for targeted purposes, consistent with your policy.

---

## 8. Optional: Account-based features

- If the app has **no accounts** and no login to your servers, state that **no account is required**.

---

*This document is guidance only and is not legal advice. Review Google’s current Data safety definitions and your final implementation before publishing.*
