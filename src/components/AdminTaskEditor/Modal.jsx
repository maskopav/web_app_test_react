// components/AdminTaskEditor/Modal.jsx
import React from "react";
import "./AdminTaskEditor.css";
import { useTranslation } from "react-i18next";

export default function Modal({ open, onClose, onSave, children }) {
  const { t } = useTranslation("admin");
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose}>✖</button>
        <div className="modal-content">
          {children}
        </div>
        <div className="modal-actions">
          <button className="btn-save" onClick={onSave}>{t("buttons.save")}</button>
        </div>
      </div>
    </div>
  );
}
