import React from 'react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import './VoiceRecorder.css';
import { RecordingTimer } from './RecordingTimer';
import { StatusIndicator } from './StatusIndicator';
import { RecordingControls } from './RecordingControls';
import { PlaybackSection } from './PlaybackSection';


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

