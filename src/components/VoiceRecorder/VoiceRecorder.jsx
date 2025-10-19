import React from 'react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import './VoiceRecorder.css';
import { RecordingTimer } from './RecordingTimer';
import { StatusIndicator } from './StatusIndicator';
import { RecordingControls } from './RecordingControls';
import { PlaybackSection } from './PlaybackSection';
import { AudioExampleButton } from './AudioExampleButton';


// components/VoiceRecorder/VoiceRecorder.jsx - Main component
export const VoiceRecorder = ({ 
    title = "🎙️ Voice Recorder",
    instructions = "Record, pause, resume, and save your audio with real-time visualization",
    instructionsActive,
    audioExample,
    mode,
    duration,
    onNextTask,
    onRecordingComplete = () => {},
    onError = (err) => console.error(err),
    showVisualizer = true,
    autoPermission = true,
    showNextButton = true,
    className = ""
}) => {
    const voiceRecorder = useVoiceRecorder({
        onRecordingComplete,
        onError,
        instructions,
        instructionsActive,
        audioExample,
        mode,
        duration
    });

    const {
        recordingStatus,
        permission,
        audioURL,
        recordingTime,
        audioLevels,
        activeInstructions,
        durationExpired,
        getMicrophonePermission,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        repeatRecording,
        playExample,
        stopExample,
        RECORDING_STATES
    } = voiceRecorder;

    // Auto-request permission on mount if enabled
    React.useEffect(() => {
        if (autoPermission) {
            getMicrophonePermission();
        }
    }, [autoPermission]);

    const handleNextTask = () => {
        if (!onNextTask) return;

        // Prepare task data to be saved
        const taskData = {
            audioURL: audioURL,
            recordingTime: recordingTime,
            timestamp: new Date().toISOString(),
            taskTitle: title,
            taskType: 'voice'
        };
        
        // Call the parent's provided function
        onNextTask(taskData);
    };

    return (
        <div className={`task-container ${className}`}>
            <h1>{title}</h1>
            <p>{activeInstructions}</p>

            <RecordingTimer
            time={recordingTime}
            remainingTime={voiceRecorder.remainingTime}
            status={recordingStatus}
            audioLevels={audioLevels}
            showVisualizer={showVisualizer}
            >
                <AudioExampleButton 
                recordingStatus={recordingStatus}
                audioExample={audioExample} 
                playExample={playExample} 
                />
            </RecordingTimer>
            
            <StatusIndicator status={recordingStatus} />

            <RecordingControls
            recordingStatus={recordingStatus}
            disableControls={!!duration}
            permission={permission}
            onStart={startRecording}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
            onPermission={getMicrophonePermission}
            disableStop={mode === 'delayedStop' && !durationExpired}
            showPause={false}
            />

            <PlaybackSection
            audioURL={audioURL}
            recordingStatus={recordingStatus}
            onRepeat={repeatRecording}
            onNextTask={handleNextTask}
            showNextButton={showNextButton}
            />
        </div>
    );
};
