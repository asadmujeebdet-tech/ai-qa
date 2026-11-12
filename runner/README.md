# ProbeQA cloud Android runner

This runner is the same Express API in `server/index.js`, deployed on a Linux VM that has hardware virtualization/KVM and a Google Play-enabled Android Virtual Device (AVD). Render's standard web service is for the dashboard only; it does not provide the emulator.

## VM prerequisites

- Ubuntu 22.04/24.04 x86_64 bare-metal host, or a cloud host explicitly supporting nested virtualization and exposing usable KVM (`/dev/kvm` readable by the service user). An ordinary VPS/Render web service is not sufficient.
- Node.js 20+
- Android SDK command-line tools, platform-tools and emulator
- A Google Play system image AVD (not a plain AOSP image)
- A dedicated Google test account signed into Play Store in that AVD
- A configured OpenAI-compatible vision model key

## Prepare the Android runner

1. Install Android SDK command-line tools, platform-tools and emulator.
2. Create an AVD using a system image marked **Google Play** in Android Studio's Device Manager or the equivalent avdmanager package.
3. Boot the AVD and complete the one-time Play Store sign-in manually with a dedicated test account. Complete any first-run prompts and verify the Play Store can install a free public app.
4. Start the emulator headlessly after the initial setup, for example:

```bash
emulator -avd ProbeQA_Play -no-window -no-audio -no-boot-anim
```

5. Wait until `adb devices` shows the emulator as `device`, then verify `adb shell pm path com.android.vending` returns a package path.
6. Clone this repository on the VM, run `npm install`, and configure the environment below.
7. Start the API with `npm start` under a process manager such as systemd.

## Runner environment

```env
PORT=4100
CLIENT_ORIGIN=https://YOUR-PROBEQA-RENDER-DOMAIN
ADB_PATH=adb
ANDROID_SERIAL=emulator-5554
OPENAI_API_KEY=YOUR_KEY
OPENAI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o
```

Set `VITE_API_URL=https://YOUR-SECURE-RUNNER-API-DOMAIN` in the Render dashboard's **build-time environment variables**, then redeploy the dashboard. The browser calls the runner API directly; the runner's `CLIENT_ORIGIN` must allow the Render origin.

## Security and operations

Do not expose this API directly to the public internet without an authentication layer and rate limiting. Put it behind Cloudflare Access, an authenticated reverse proxy, or an equivalent access gateway. Restrict outbound traffic, cap test duration and concurrent sessions, and use a dedicated emulator/account with no personal data or payment method. The current MVP has in-memory sessions and local artifacts; restarting the runner clears session metadata.

## What package-only means after setup

The user enters only a package name. The runner opens `market://details?id=<package>` in the Play Store on the cloud emulator. The AI agent may tap **Install** for a free public listing, waits for Package Manager to confirm installation, launches the app, and explores it. If the app is paid, unavailable, incompatible, or Play Store requires account action, the test stops rather than attempting payment.

## Monetization QA scope

The agent inspects visible ad placements, ad labels, paywalls, product prices, billing periods, trial terms, subscribe/upgrade controls and restore-purchase paths. It records visible UI evidence and screenshots. It never clicks live ads or confirms a purchase. This is not proof of ad serving, mediation fill, revenue, billing settlement or entitlement delivery.

For Google Play Billing test transactions, the app owner must configure license testers and publish the relevant products/test track. See [Google Play Billing testing](https://developer.android.com/google/play/billing/test). For AdMob, use Google's demo ad units or properly configured test devices and mediation test settings; do not click live ads. See [AdMob test ads](https://developers.google.com/admob/android/test-ads).
