// src/components/ParticipantProtocol/AssignmentSuccessModal.jsx
import React from "react";
import {QRCodeSVG} from 'qrcode.react';
import "./AssignmentSuccessModal.css";

export default function AssignmentSuccessModal({ link, emailText, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <h2>Protocol Assigned</h2>

        <p>Your participant can access their protocol via:</p>

        <div className="link-box">
          <code>{link}</code>
          <button
            className="btn-copy"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy Link
          </button>
        </div>

        <h3>QR Code</h3>
        <div className="qr-wrapper">
          <QRCodeSVG value={link} size={180} />
        </div>

        <h3>Email Message</h3>
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
          Copy Email Text
        </button>

        <button className="btn-close" onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}
