# ProbeQA — Autonomous Android QA

Database-free MVP for AI-assisted Android app exploration, diagnostics and evidence-based QA reporting.

## Local development

`npm install`

`npm run dev`

Open http://localhost:5173. The API runs on http://localhost:4100.

## Render deployment

Create a **Web Service** connected to this repository and branch `main`.

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- **Environment:** Node.js 20 or newer
- Add the required environment variables from `.env.example`; set `OPENAI_API_KEY` and the model/base URL if AI exploration is required.

The production build compiles the React/Vite dashboard into `dist/`. Express serves that dashboard and the API from the same Render service.

**Android device requirement:** Render cannot automatically access an Android emulator or a USB-connected phone on your computer. Render can host the dashboard, but it cannot host the Android emulator required for execution. Deploy this Node API on a separate cloud VM with KVM/Android Emulator support and a Google Play-enabled AVD, then set VITE_API_URL in the Render build environment to that API URL. Set CLIENT_ORIGIN on the runner to your Render domain. The cloud emulator must be signed in to a dedicated Google test account before unattended Play Store installs can work. The API automatically opens the Play Store listing for a package name and uses the vision agent to tap Install for free apps only.

See [`runner/README.md`](runner/README.md) for the cloud VM, Play-enabled emulator, one-time Google test-account setup and secure runner deployment steps.

## Requirements for device testing

- Node.js 20+
- Android SDK Platform Tools (ADB) on PATH
- Running Android emulator or USB-debugging-enabled device
- Optional OpenAI-compatible vision model API key

Copy `.env.example` to `.env`. Set `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `AI_MODEL`, and optionally `ANDROID_SERIAL`.

## Running a test

1. Start a Google Play-enabled Android emulator on the cloud runner and sign it into a dedicated test Google account.
2. Configure the runner's `OPENAI_API_KEY`, `CLIENT_ORIGIN`, and ADB access.
3. Enter only the public Play Store package name in the dashboard.
4. The runner opens the Play Store listing, taps Install for a free app, launches it and explores it.
5. Inspect functional findings, monetization UI observations, screenshots and crash evidence.

Package-name acquisition is performed through the Play Store app running inside the cloud emulator, not by scraping or downloading APKs from third-party sites. The emulator must already have Play Store and a signed-in authorized account. Paid apps, region restrictions, account verification, Play Integrity and unavailable listings can block installation.

## Architecture

- `src/`: React dashboard.
- `server/index.js`: Express API, static dashboard hosting and in-memory session manager.
- `server/adb.js`: Android device, interaction and diagnostics adapter.
- `server/agent.js`: vision model action planner.

## No database

No database, ORM, Redis or cloud storage is used. Sessions are held in process memory and disappear on server restart. Screenshots, UI hierarchy and reports are stored locally under `artifacts/<session-id>/`; uploaded APKs are temporary under `uploads/`. Both folders are excluded from Git.

## Implemented scope

APK install, package launch, screenshot capture, UI hierarchy extraction, AI-directed tap/swipe/text/back/wait, logcat crash signatures, memory snapshots, session polling, stop request and HTML/JSON report export.

## Limitations and safety

- One Android device/session at a time; no iOS support yet.
- Google Play acquisition requires a Play-enabled emulator, an authorized signed-in Google account, and app availability in that account's Play region.
- Monetization QA currently records visible ad/paywall/subscription UI signals; it does not verify ad serving, complete purchases, validate entitlements, or measure revenue. Google Play billing scenarios require license testers and published test products; AdMob testing must use test ads/test devices.
- AI findings are observations, not guaranteed defects. Verify findings manually.
- Memory is a point-in-time snapshot, not a controlled benchmark.
- The agent is instructed not to perform irreversible actions; prompts are not a security boundary. Use a dedicated test device and test accounts.
- Do not expose the API publicly without authentication, emulator isolation, stronger APK validation and resource limits.
