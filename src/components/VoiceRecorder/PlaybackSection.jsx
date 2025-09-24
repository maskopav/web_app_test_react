import React from "react";

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
  

  