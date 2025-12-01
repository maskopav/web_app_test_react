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
    onLogEvent = () => {},
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

    
    // --- Wrappers ---
    const handleStart = () => {
        onLogEvent("button_start");
        startRecording();
    };

    const handleRepeat = () => {
        onLogEvent("button_repeat");
        repeatRecording();
    };

    // We pass the logger to the example button so it can log clicks itself
    const handlePlayExample = () => {
        onLogEvent("button_illustration");
        playExample();
    };

    // Auto-request permission on mount if enabled
    React.useEffect(() => {
        if (autoPermission) {
            getMicrophonePermission();
        }
    }, [autoPermission]);

    const [exampleExists, setExampleExists] = React.useState(false);

    React.useEffect(() => {
        async function checkExample() {
          if (!audioExample) return;
          try {
            const res = await fetch(audioExample, { method: "HEAD" });
            const type = res.headers.get("content-type") || "";
            const ok = res.ok && type.includes("audio");
            console.log(`Checking example: ${audioExample} → ${res.status} ${type} ok=${ok}`);
            setExampleExists(ok);
          } catch {
            setExampleExists(false);
          }
        }
        checkExample();
      }, [audioExample]);
      


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
            {exampleExists && (
                <AudioExampleButton 
                recordingStatus={recordingStatus}
                audioExample={audioExample} 
                playExample={handlePlayExample} 
                />
            )}
            </RecordingTimer>
            
            <StatusIndicator status={recordingStatus} />

            <div className="bottom-controls">
            <RecordingControls
            recordingStatus={recordingStatus}
            disableControls={mode === 'countDown'}
            permission={permission}
            onStart={handleStart}
            onPause={pauseRecording}
            onResume={resumeRecording}
            onStop={stopRecording}
            onPermission={getMicrophonePermission}
            disableStop={mode === 'delayedStop' && !durationExpired}
            showPause={false}
            RECORDING_STATES={RECORDING_STATES}
            />

            <PlaybackSection
            audioURL={audioURL}
            recordingStatus={recordingStatus}
            onRepeat={handleRepeat}
            onNextTask={handleNextTask}
            showNextButton={showNextButton}
            />
            </div>
        </div>
    );
};
