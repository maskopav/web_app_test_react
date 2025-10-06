import React from "react";
import "./AdminTaskEditor.css";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        {children}
        <button className="modal-close" onClick={onClose}>✖</button>
      </div>
    </div>
  );
}
