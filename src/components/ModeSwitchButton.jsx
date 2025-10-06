import React from "react";

function ModeSwitchButton({ onToggle }) {
  return (
    <div className="mode-switch-container">
      <button className="switch-button" onClick={onToggle}>
        {"Switch to Recorder Mode"}
      </button>
    </div>
  );
}

export default ModeSwitchButton;
