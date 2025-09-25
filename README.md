# 🎙️ React Voice Recorder Component

A voice recording component built with **React**.  
It leverages a **custom hook** for clean logic separation, **real-time audio visualization** using the Web Audio API, and robust control handling (record, pause, resume, stop).

---

## Features
- **Custom Hook Architecture** – encapsulated recording logic in `useVoiceRecorder.js`.
- **Real-time Audio Visualization** – powered by Web Audio API’s `AnalyserNode`.
- **Full Control Flow** – supports `idle`, `recording`, `paused`, and `recorded` states.
- **Clean Component Separation** – modular UI (timer, controls, status, playback).
- **Automatic Cleanup** – stops streams, revokes URLs, and closes `AudioContext` on unmount.
- **Output Handling** – provides both an `audioBlob` and a temporary `audioURL` via callback.

---

## Project Architecture

The project follows a **Container/Presentation pattern**, separating **logic** from **UI**:

### 1. Logic Layer (`hooks/useVoiceRecorder.js`)
Handles:
- Recording state (`recordingStatus`, `audioURL`, `recordingTime`, `audioLevels`, etc.)
- Browser APIs:
  - `navigator.mediaDevices.getUserMedia` – microphone access
  - `MediaRecorder` – recording
  - `AudioContext` + `AnalyserNode` – visualization
- Timers, cleanup, and side effects
- Exposes a clean API: `startRecording`, `pauseRecording`, `resumeRecording`, `stopRecording`, `resetRecording`, etc.

### 2. Presentation Layer (`components/VoiceRecorder/`)
A set of modular components that consume the hook’s state and actions:

| Component              | Purpose                                                                 |
|-------------------------|-------------------------------------------------------------------------|
| **VoiceRecorder.jsx**   | Container. Uses the hook and orchestrates all sub-components.           |
| **RecordingControls.jsx** | Renders buttons (`Start`, `Pause`, `Resume`, `Stop`) based on state.   |
| **RecordingTimer.jsx**  | Displays elapsed time and includes the `AudioVisualizer`.               |
| **AudioVisualizer.jsx** | Animated bars based on real-time `audioLevels`.                         |
| **StatusIndicator.jsx** | Displays the current recording status (Ready, Recording, Paused, etc.). |
| **PlaybackSection.jsx** | Provides playback UI and controls to Save or Reset the recording.       |

---

## File Structure
```
src/
├── components/
│   └── VoiceRecorder/
│       ├── VoiceRecorder.jsx
│       ├── VoiceRecorder.css (voice recording styles)
│       ├──AudioVisualizer.jsx
│       ├──PlaybackSection.jsx
│       ├──RecordingControls.jsx
│       ├──RecordingTimer.jsx
│       ├──StatusIndicator.jsx
│       └── index.js
├── hooks/
│   └── useVoiceRecorder.js
├── App.css
└── App.jsx
```

---

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



