import React from 'react';
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    const { IDLE, RECORDING, PAUSED } = useVoiceRecorder().RECORDING_STATES;

    return (
    <div className={`controls ${className}`}>
        {/* Permission Button */}
        {!permission && (
            <button 
            onClick={onPermission}
            className="btn-permission"
            >
            {t("buttons.permission")}
            </button>
        )}

        {/* Recording Controls */}
        {permission && (
            <>
            {recordingStatus === IDLE && (
                <button onClick={onStart} className="btn-start">
                {t("buttons.start")}
                </button>
            )}

            {recordingStatus === RECORDING && (
                <div className="button-group">
                <button onClick={onPause} className="btn-pause">
                {t("buttons.pause")}
                </button>
                <button onClick={onStop} className="btn-stop">
                {t("buttons.stop")}
                </button>
                </div>
            )}

            {recordingStatus === PAUSED && (
                <div className="button-group">
                <button onClick={onResume} className="btn-resume">
                {t("buttons.resume")}
                </button>
                <button onClick={onStop} className="btn-stop">
                {t("buttons.stop")}
                </button>
                </div>
            )}
            </>
        )}
    </div>
    );
};
