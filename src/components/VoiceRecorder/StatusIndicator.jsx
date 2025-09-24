import React from "react";

// components/VoiceRecorder/StatusIndicator.jsx - Status display component
export const StatusIndicator = ({ status, className = "" }) => {
    const getStatusText = (status) => {
        switch (status) {
        case 'recording':
            return '🔴 Recording...';
        case 'paused':
            return '⏸️ Paused';
        case 'recorded':
            return '✅ Recorded';
        default:
            return '⚪ Ready';
        }
    };
    
        return (
            <div className={`status ${status} ${className}`}>
            Status: {getStatusText(status)}
            </div>
        );
    };
    