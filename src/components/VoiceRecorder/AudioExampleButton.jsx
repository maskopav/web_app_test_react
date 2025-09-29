// components/VoiceRecorder/AudioExampleButton.jsx
import React from "react";

export const AudioExampleButton = ({ audioExample }) => {
  if (!audioExample) return null;

  const handlePlay = () => {
    try {
      const audio = new Audio(audioExample);
      audio.play().catch(err => {
        console.error("Failed to play example:", err);
      });
    } catch (err) {
      console.error("Audio error:", err);
    }
  };

  return (
    <button className="btn-example" onClick={handlePlay}>
      ▶️ Play Example
    </button>
  );
};
