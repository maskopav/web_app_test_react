import React from 'react';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';

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
