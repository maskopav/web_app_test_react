// components/VoiceRecorder/NextTaskButton.jsx
import React from "react";

export const NextTaskButton = ({ onClick, disabled = false }) => {
    return (
        <button 
        onClick={onClick} 
        disabled={disabled} 
        className="btn-next"
        >
        ➡️ Next
        </button>
    );
};
