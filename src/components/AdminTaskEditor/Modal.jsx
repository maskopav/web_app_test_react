// components/AdminTaskEditor/Modal.jsx
import React from "react";
import "./AdminTaskEditor.css";

export default function Modal({ open, onClose, onSave, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✖</button>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={onSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}
