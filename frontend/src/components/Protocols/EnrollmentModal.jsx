// frontend/src/components/Protocols/EnrollmentModal/EnrollmentModal.jsx
import React, {useRef} from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useTranslation, Trans } from "react-i18next";
import { useConfirm } from "../ConfirmDialog/ConfirmDialogContext";
import "./EnrollmentModal.css";

export default function EnrollmentModal({ protocol, onClose }) {
  const { t } = useTranslation(["admin","common"]);
  const qrRef = useRef(null);
  const confirm = useConfirm();

  // Generates the link: everything before the hash + the protocol route
  const getEnrollmentLink = () => {
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#/protocol/${protocol.access_token}`;
  };

  const link = getEnrollmentLink();

  // Download QR Code as PNG
  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const image = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = image;
    anchor.download = `qr-enrollment-${protocol.name}.png`;
    anchor.click();
  };

  // Copy QR Code Image to Clipboard
  const copyQRCodeImage = async () => {
    try {
      const canvas = qrRef.current.querySelector("canvas");
      canvas.toBlob(async (blob) => {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        await confirm({
            title: t("confirmModal.info", { ns: "common" }),
            message: t("protocolDashboard.enrollmentModal.qrCopied"),
            confirmText: t("buttons.ok", { ns: "common" }),
            cancelText: "" // Setting this to empty might hide it depending on your CSS
          });
      });
    } catch (err) {
      console.error("Failed to copy image: ", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>✖</button>
        
        <h2>{t("protocolDashboard.enrollmentModal.title")}</h2>

        <div className="assignment-warning">
            <Trans
              i18nKey="protocolDashboard.enrollmentModal.description"
              ns="admin"
              components={{ 
                strong: <strong />, 
                br: <br /> 
              }}
            />
        </div>

        <p className="assignment-descr">{t("protocolDashboard.enrollmentModal.linkInstruction")}</p>

        <div className="link-box">
          <code className="link-text">{link}</code>
          <button
            className="btn-copy"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            {t("protocolDashboard.enrollmentModal.copyLink")}
          </button>
        </div>

        <p className="assignment-descr">{t("protocolDashboard.enrollmentModal.qrTitle")}</p>
        <div className="qr-wrapper" ref={qrRef}>
          <QRCodeCanvas value={link} size={180} includeMargin={true} />
        </div>

        <div className="qr-actions">
          <button className="btn-qr-action" onClick={downloadQRCode}>
            💾 {t("protocolDashboard.enrollmentModal.downloadQR")}
          </button>
          <button className="btn-qr-action" onClick={copyQRCodeImage}>
            📋 {t("protocolDashboard.enrollmentModal.copyQR")}
          </button>
        </div>
      </div>
    </div>
  );
}