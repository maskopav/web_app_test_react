import React from 'react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import './VoiceRecorder.css';

// components/VoiceRecorder/AudioVisualizer.jsx - Reusable audio visualizer
export const AudioVisualizer = ({ audioLevels = [], isActive = false, className = "" }) => (
  <div className={`audio-visualizer ${className}`}>
    {audioLevels.map((level, index) => (
      <div
        key={index}
        className="visualizer-bar"
        style={{
          height: `${Math.max(2, level * 0.6)}px`,
          opacity: isActive ? 1 : 0.3
        }}
      />
    ))}
  </div>
);

// components/VoiceRecorder/RecordingTimer.jsx - Timer circle component
export const RecordingTimer = ({ 
  time, 
  status, 
  audioLevels = [], 
  showVisualizer = true,
  className = "" 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer-container ${className}`}>
      <div className={`timer-circle ${status}`}>
        <div className={`timer-display ${status === 'recording' ? 'recording' : ''}`}>
          {formatTime(time)}
        </div>
        {showVisualizer && (status === 'recording' || status === 'paused') && (
          <AudioVisualizer 
            audioLevels={audioLevels} 
            isActive={status === 'recording'} 
          />
        )}
      </div>
    </div>
  );
};

// components/VoiceRecorder/RecordingControls.jsx - Control buttons component
export const RecordingControls = ({
  recordingStatus,
  permission,
  onStart,
  onPause,
  onResume,
  onStop,
  onPermission,
  className = ""
}) => {
  const { IDLE, RECORDING, PAUSED } = useVoiceRecorder().RECORDING_STATES;

  return (
    <div className={`controls ${className}`}>
      {/* Permission Button */}
      {!permission && (
        <button 
          onClick={onPermission}
          className="btn-permission"
        >
          🎤 Get Microphone Permission
        </button>
      )}

      {/* Recording Controls */}
      {permission && (
        <>
          {recordingStatus === IDLE && (
            <button onClick={onStart} className="btn-start">
              🔴 Start Recording
            </button>
          )}

          {recordingStatus === RECORDING && (
            <div className="button-group">
              <button onClick={onPause} className="btn-pause">
                ⏸️ Pause
              </button>
              <button onClick={onStop} className="btn-stop">
                ⏹️ Stop
              </button>
            </div>
          )}

          {recordingStatus === PAUSED && (
            <div className="button-group">
              <button onClick={onResume} className="btn-resume">
                ▶️ Resume
              </button>
              <button onClick={onStop} className="btn-stop">
                ⏹️ Stop
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// components/VoiceRecorder/PlaybackSection.jsx - Audio playback component
export const PlaybackSection = ({ 
  audioURL, 
  onSave, 
  onNewRecording,
  className = "" 
}) => {
  if (!audioURL) return null;

  return (
    <div className={`playback-section ${className}`}>
      <audio src={audioURL} controls />
      
      <div className="button-group">
        <button onClick={onSave} className="btn-save">
          💾 Save Recording
        </button>
        <button onClick={onNewRecording} className="btn-new">
          🔄 New Recording
        </button>
      </div>
    </div>
  );
};

// components/VoiceRecorder/StatusIndicator.jsx - Status display component
export const StatusIndicator = ({ status, className = "" }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 'recording':
        return '🔴 Recording...';
      case 'paused':
        return '⏸️ Paused';
      case 'recorded':
        return '✅ Recorded';
      default:
        return '⚪ Ready';
    }
  };

  return (
    <div className={`status ${status} ${className}`}>
      Status: {getStatusText(status)}
    </div>
  );
};

// components/VoiceRecorder/VoiceRecorder.jsx - Main component
export const VoiceRecorder = ({ 
  title = "🎙️ Voice Recorder",
  subtitle = "Record, pause, resume, and save your audio with real-time visualization",
  onRecordingComplete = () => {},
  onError = (err) => console.error(err),
  showVisualizer = true,
  autoPermission = true,
  className = ""
}) => {
  const voiceRecorder = useVoiceRecorder({
    onRecordingComplete,
    onError
  });

  const {
    recordingStatus,
    permission,
    audioURL,
    recordingTime,
    audioLevels,
    getMicrophonePermission,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording
  } = voiceRecorder;

  // Auto-request permission on mount if enabled
  React.useEffect(() => {
    if (autoPermission) {
      getMicrophonePermission();
    }
  }, [autoPermission]);

  const handleSaveRecording = () => {
    if (audioURL) {
      const link = document.createElement('a');
      link.href = audioURL;
      link.download = `recording-${Date.now()}.webm`;
      link.click();
    }
  };

  return (
    <div className={`app-container ${className}`}>
      <div className="card">
        <h1>{title}</h1>
        <p>{subtitle}</p>

        <RecordingTimer
          time={recordingTime}
          status={recordingStatus}
          audioLevels={audioLevels}
          showVisualizer={showVisualizer}
        />

        <StatusIndicator status={recordingStatus} />

        <RecordingControls
          recordingStatus={recordingStatus}
          permission={permission}
          onStart={startRecording}
          onPause={pauseRecording}
          onResume={resumeRecording}
          onStop={stopRecording}
          onPermission={getMicrophonePermission}
        />

        <PlaybackSection
          audioURL={audioURL}
          onSave={handleSaveRecording}
          onNewRecording={resetRecording}
        />
      </div>
    </div>
  );
};

