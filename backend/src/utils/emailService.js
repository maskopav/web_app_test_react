// src/utils/emailService.js
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { fileURLToPath } from "url";
import { logToFile } from "./logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesPath = path.join(__dirname, "../../../frontend/src/i18n/{{lng}}/{{ns}}.json");

// 1. Initialize i18next to use your FRONTEND translation files
// This points to: frontend/src/i18n/{{lng}}/common.json (or admin.json)
await i18next.use(Backend).init({
  initImmediate: false,
  fallbackLng: "en",
  preload: ["en", "cs", "de"],
  ns: ["common"],
  backend: {
    loadPath: localesPath,
  },
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false }
});

/**
 * CORE ENGINE: Unified Send Function
 */
async function sendEmail({ to, subject, html, attachments = [], lang = "en" }) {
  try {
    const info = await transporter.sendMail({
      from: `"TaskProtocoller" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    logToFile(`✅ EMAIL SENT to ${to} (ID: ${info.messageId})`);
    return true;
  } catch (error) {
    logToFile(`❌ EMAIL FAILED to ${to}: ${error.message}`);
    return false;
  }
}

/**
 * HELPER: Participant Credentials (with QR)
 */
export async function sendParticipantCredentials(email, data, lang = "en") {
  const t = i18next.getFixedT(lang, "common");
  const qrCodeBuffer = await QRCode.toBuffer(data.personalLink);

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #3764df;">${t("email.welcome", { name: data.name })}</h2>
      <p>${t("email.assignedProtocol")}</p>
      <div style="text-align: center; background: #f9f9f9; padding: 20px; margin: 20px 0;">
        <a href="${data.personalLink}" style="background:#3764df; color:white; padding:12px 25px; text-decoration:none; border-radius:5px;">
           ${t("email.openProtocol")}
        </a>
        <br/><br/>
        <img src="cid:qrcode" width="150" />
      </div>
      <p>${t("email.manualLogin")}:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>${t("email.password")}:</strong> ${data.password}</li>
      </ul>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: t("email.subjectCredentials"),
    html,
    attachments: [{ filename: "qrcode.png", content: qrCodeBuffer, cid: "qrcode" }],
    lang
  });
}

/**
 * HELPER: Admin Password Reset
 */
export async function sendPasswordResetEmail(email, resetLink, protocolToken, lang = "en") {
  const t = i18next.getFixedT(lang, "common");
  
  // If a protocol token exists, append it to the reset link
  const finalResetLink = `${resetLink}?returnToken=${protocolToken}`;

  const html = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2 style="color: #3764df;">${t("auth.resetPasswordTitle")}</h2>
      <p>${t("email.resetRequested")}</p>
      <a href="${finalResetLink}" style="background:#3764df; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
        ${t("email.btnSetNewPassword")}
      </a>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: t("email.subjectReset"),
    html,
    lang
  });
}