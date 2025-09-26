import React from "react";
import { NextTaskButton } from "./NextTaskButton";

// components/VoiceRecorder/PlaybackSection.jsx - Audio playback component
export const PlaybackSection = ({ 
    audioURL, 
    recordingStatus, 
    onRepeat,
    onNextTask,
    showNextButton = true
}) => {
    // Only show playback section if recording is complete
    if (!audioURL) return null;

    const isRecorded = recordingStatus === 'recorded';

    return (
        <div className="playback-section">
        <audio src={audioURL} controls />
        
        <div className="button-group">
            <button onClick={onRepeat} className="btn-repeat">
            🔄 Repeat
            </button>

            {showNextButton && (
            <NextTaskButton 
                onClick={onNextTask} 
                disabled={!isRecorded} 
            />
            )}
        </div>
        </div>
    );
};
  

  