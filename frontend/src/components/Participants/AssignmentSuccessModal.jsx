// src/components/Participants/AssignmentSuccessModal.jsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation, Trans } from "react-i18next";
import "./AssignmentSuccessModal.css";

export default function AssignmentSuccessModal({ link, emailText, onClose }) {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>✖</button>
        
        <h2>{t("assignmentModal.title")}</h2>

        <div className="assignment-warning">
            <Trans
              i18nKey="assignmentModal.warning"
              ns="admin"
              components={{ 
                strong: <strong />, 
                br: <br /> 
              }}
            />
        </div>

        <p className="assignment-descr">{t("assignmentModal.description")}</p>

        <div className="link-box">
          <code className="link-text">{link}</code>
          <button
            className="btn-copy"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            {t("assignmentModal.copyLink")}
          </button>
        </div>

        <h3>{t("assignmentModal.qrTitle")}</h3>
        <div className="qr-wrapper">
          <QRCodeSVG value={link} size={180} />
        </div>

        <h3>{t("assignmentModal.emailMessage")}</h3>
        <textarea
          className="email-box"
          rows={6}
          readOnly
          value={emailText}
        />

        <button
          className="btn-copy"
          onClick={() => navigator.clipboard.writeText(emailText)}
        >
          {t("assignmentModal.copyEmail")}
        </button>

      </div>
    </div>
  );
}
