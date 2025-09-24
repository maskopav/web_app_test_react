import VoiceRecorder from './components/VoiceRecorder';
import './App.css'

function App() {
  const handleRecordingComplete = (audioBlob, audioURL) => {
    console.log('Recording completed:', { audioBlob, audioURL });
    // Send to server, save to database, etc.
  };

  const handleError = (error) => {
    console.error('Recording error:', error);
    // Show error message to user
  };

  return (
    <div className="app-container">
      <VoiceRecorder
        title="TASK 1: PATAKA"
        subtitle="Record your first assignment."
        onRecordingComplete={handleRecordingComplete}
        onError={handleError}
        showVisualizer={true}
        autoPermission={true}
      />

      <VoiceRecorder
        title="TASK 2: MONOLOGUE"
        subtitle="Practice your speaking skills."
        onRecordingComplete={handleRecordingComplete}
        onError={handleError}
        showVisualizer={true}
        autoPermission={true}
      />
    </div>
  );
}

export { App as default };
