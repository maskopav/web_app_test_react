import React from 'react';
import { AudioVisualizer } from './AudioVisualizer';

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