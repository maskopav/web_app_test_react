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
                🔴 START
                </button>
            )}

            {recordingStatus === RECORDING && (
                <div className="button-group">
                <button onClick={onPause} className="btn-pause">
                    ⏸️ PAUSE
                </button>
                <button onClick={onStop} className="btn-stop">
                    ⏹️ STOP
                </button>
                </div>
            )}

            {recordingStatus === PAUSED && (
                <div className="button-group">
                <button onClick={onResume} className="btn-resume">
                    ▶️ RESUME
                </button>
                <button onClick={onStop} className="btn-stop">
                    ⏹️ STOP
                </button>
                </div>
            )}
            </>
        )}
    </div>
);
};
