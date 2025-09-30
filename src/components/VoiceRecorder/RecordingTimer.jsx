import React from 'react';
import { AudioVisualizer } from './AudioVisualizer';

// components/VoiceRecorder/RecordingTimer.jsx - Timer circle component
export const RecordingTimer = ({ 
    time, 
    remainingTime,
    status, 
    audioLevels = [], 
    showVisualizer = true,
    className = "",
    children
}) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`timer-wrapper`}>
            {/* Timer circle */}
            <div className={`timer-circle ${status}`}>
                <div className={`timer-display ${status === 'recording' ? 'recording' : ''}`}>
                {remainingTime !== null ? formatTime(remainingTime) : formatTime(time)}
                </div>
                {showVisualizer && (status === 'recording' || status === 'paused') && (
                    <AudioVisualizer 
                        audioLevels={audioLevels} 
                        isActive={status === 'recording'} 
                    />
                )}
            </div>

            {/* Extra control (e.g. play example button) */}
            {children && <div className="extra-control">{children}</div>}
        </div>
    );
};
