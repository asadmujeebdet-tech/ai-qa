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

**Android device requirement:** Render cannot automatically access an Android emulator or a USB-connected phone on your computer. The dashboard/API can be hosted on Render, but a test device and ADB connection must be available to the machine running the test agent. For actual device testing, run the service locally with ADB connected, or deploy a separately secured device-runner/agent in an environment with an emulator attached. A package name alone does not make a remote Android device available.

## Requirements for device testing

- Node.js 20+
- Android SDK Platform Tools (ADB) on PATH
- Running Android emulator or USB-debugging-enabled device
- Optional OpenAI-compatible vision model API key

Copy `.env.example` to `.env`. Set `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `AI_MODEL`, and optionally `ANDROID_SERIAL`.

## Running a test

1. Start an Android emulator or connect a test device to the machine running the agent.
2. Upload an APK, or ensure the package is already installed on the device.
3. Enter the exact Android package name and select the device.
4. Start AI testing and inspect the session report.

A package name alone does not download an APK from Google Play. This MVP tests an already-installed package or installs an uploaded APK. Play Store region, account, licensing and Play Integrity restrictions require a separate supported distribution workflow.

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
- No direct Google Play download from package name.
- No automated purchase completion or ad-network verification in this MVP.
- AI findings are observations, not guaranteed defects. Verify findings manually.
- Memory is a point-in-time snapshot, not a controlled benchmark.
- The agent is instructed not to perform irreversible actions; prompts are not a security boundary. Use a dedicated test device and test accounts.
- Do not expose the API publicly without authentication, emulator isolation, stronger APK validation and resource limits.
