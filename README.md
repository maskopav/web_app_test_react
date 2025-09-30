# 🎙️ React Voice Recorder Component

A voice recording component built with **React**.  
A **React component** for guided voice recording tasks.  
Built with a custom recording hook, multilingual support, configurable tasks, and full i18n support for multilingual apps.


## Features
- **Custom Hook** – all recording logic encapsulated in `useVoiceRecorder.js`.
- **Full Recording Flow** – supports *idle*, *recording*, *paused*, and *recorded* states.
- **Task System** – define tasks in `App.jsx` with title, instructions, and optional audio example.
- **Internationalization (i18n)** – translations handled via `react-i18next`, with JSON files in `src/i18n/`.
- **Automatic Cleanup** – closes streams, revokes URLs, and resets audio context.
- **Mobile Ready** – test directly on your phone over LAN.

## Quick Start
```bash
git clone https://github.com/yourusername/react-voice-recorder.git
cd react-voice-recorder
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.
For testing on mobile, use the Network URL shown in your terminal (same Wi-Fi required).


## Configurable Tasks

All tasks are defined in `App.jsx` inside the `TASKS` array. 

| Argument         | Type      | Required  | Description                                                                 |
|------------------|-----------|-----------|-----------------------------------------------------------------------------|
| `type`           | string    | ✅        | Type of task (e.g. `"voice"`, `"camera"`).                                  |
| `title`          | string    | ✅        | Title of the task shown at the top of the card.                             |
| `subtitle`       | string    | ✅        | Instruction text shown before recording starts.                             |
| `subtitleActive` | string    | ❌        | Alternative subtitle shown *after pressing START*. Useful for reading tasks.|
| `audioExample`   | string    | ❌        | Path to an audio file (from `/public/audio/`) with an example to play.      |
| `showNextButton` | boolean   | ❌        | Show or hide the "Next" button (default: `true`).                           |

### Example
```js
{
  type: 'voice',
  title: 'PA-TA-KA #2',
  subtitle: 'Press START and repeat the syllables /pa/-/ta/-/ka/...',
  subtitleActive: 'Repeat quickly and accurately until the timer ends.',
  audioExample: '/audio/pataka.mp3'
}
```

## Internationalization (i18n)
This project uses react-i18next to support multiple languages.
Translations are stored in src/i18n/ as JSON files, one per language. Config lives in `src/i18n.js` and is loaded in `main.jsx` with `import "./i18n"`;.
```
src/
└── i18n/
    ├── en.json
    ├── cs.json
    ├── de.json
    └── # add a new language with the same components and keys as in other language files

```

## Project Architecture & File Structure
The project follows a **Container / Presentation pattern**, separating **logic** from **UI components**.  
Below is the file structure with inline notes describing each file’s role:
```bash
src/
├── components/
│ └── VoiceRecorder/         # UI layer for recording feature
│ ├── VoiceRecorder.jsx      # Container: wires hook state/actions to subcomponents
│ ├── VoiceRecorder.css      # Scoped styles for VoiceRecorder
│ ├── AudioExampleButton.jsx # Button for playing example audio clip (if defined in task)
│ ├── AudioVisualizer.jsx    # Renders real-time animated bars from audio levels
│ ├── NextTaskButton.jsx     # Navigation button to move to the next task
│ ├── PlaybackSection.jsx    # Playback UI + Save / Reset controls
│ ├── RecordingControls.jsx  # Start / Pause / Resume / Stop buttons
│ ├── RecordingTimer.jsx     # Displays elapsed time + contains AudioVisualizer
│ ├── StatusIndicator.jsx    # Shows current state (Idle, Recording, Paused, etc.)
│ └── index.js               # Barrel file for clean imports
│
├── hooks/
│ └── useVoiceRecorder.js    # Logic layer: manages state, MediaRecorder, AudioContext
│                            # Exposes API: startRecording, pauseRecording, resumeRecording, stopRecording, resetRecording
│
├── i18n/                    # Internationalization setup
│ ├── en.json                # English translations
│ ├── cs.json                # Czech translations
│ └── index.js               # i18n configuration (react-i18next setup)
│
├── App.jsx                  # Entry UI: task definitions + main flow
├── App.css                  # Global styles
├── main.jsx                 # App bootstrap (ReactDOM + i18n import)
└── i18n.js                  # (optional) alternate entry for i18n if not inside src/i18n/
```

### Summary
- **Logic lives in `hooks/useVoiceRecorder.js`**: manages browser APIs, timers, state, and cleanup.  
- **Presentation lives in `components/VoiceRecorder/`**: small, focused UI components that consume the hook.  
- **Tasks live in `App.jsx`**: configurable set of exercises with titles, subtitles, and audio examples.  
- **i18n lives in `src/i18n/`**: JSON files per language + `index.js` setup with `react-i18next`.  

### Styling
- **Global styles**: `App.css`
- **Component-specific styles**: colocated `.css` files inside each folder


## Installation & Usage

1. Install dependencies (React project setup assumed):
```bash
npm install
# or
yarn install
```
2. Start the server (LAN-enabled):
```bash
npm start
# or
npm run dev # For auto-reload during development (server restarts on file changes)
```
3. The terminal will display two URLs, e.g.:
   - Local: `http://localhost:3000`
   - Network: `http://192.168.1.25:3000`

Open the Network URL on your phone (connected to the same Wi‑Fi) to test on mobile. If it doesn't load:
- Ensure your phone and PC are on the same network
- Temporarily allow Node.js through Windows Defender Firewall
- Avoid corporate/VPN networks that isolate devices



