// components/VoiceRecorder/index.js - Barrel export
export { VoiceRecorder as default } from './VoiceRecorder';
export { AudioVisualizer } from './AudioVisualizer';
export { RecordingTimer } from './RecordingTimer';
export { RecordingControls } from './RecordingControls';
export { PlaybackSection } from './PlaybackSection';
export { StatusIndicator } from './StatusIndicator';
// Re-export the hook
export { useVoiceRecorder } from '../../hooks/useVoiceRecorder';