// frontend/src/components/Icons/AssignIcon.jsx
import React from "react";

export default function AssignIcon({ size = 18, title = "Assign", className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      title={title}
      className={className}
      style={{ display: "block", overflow: "visible" }} // Added overflow visible
    >
      <g 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </g>
    </svg>
  );
}