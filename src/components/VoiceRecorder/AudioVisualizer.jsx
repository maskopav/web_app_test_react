import React from 'react';

// components/VoiceRecorder/AudioVisualizer.jsx - Reusable audio visualizer
export const AudioVisualizer = ({ audioLevels = [], isActive = false, className = "" }) => (
    <div className={`audio-visualizer ${className}`}>
        {audioLevels.map((level, index) => (
            <div
                key={index}
                className="visualizer-bar"
                style={{
                height: `${Math.max(2, level * 0.8)}px`,
                opacity: isActive ? 1 : 0.3
                }}
            />
        ))}
    </div>
);