import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { useTranslation } from "react-i18next";
import "./AssignmentSuccessModal.css";

export default function AssignmentSuccessModal({ link, emailText, onClose }) {
  const { t } = useTranslation(["admin"]);

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2>{t("assignmentModal.title")}</h2>

        <p>{t("assignmentModal.description")}</p>

        <div className="link-box">
          <code>{link}</code>
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

        <button className="btn-close" onClick={onClose}>
          {t("assignmentModal.close")}
        </button>

      </div>
    </div>
  );
}
