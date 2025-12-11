// src/utils/emailService.js
import nodemailer from "nodemailer";
import QRCode from "qrcode"; 
import { logToFile } from "./logger.js";

// Create the transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Trusts self-signed certs (e.g., from Antivirus)
    tls: {
      rejectUnauthorized: false
    }
  });

  export async function sendCredentialsEmail(email, name, password, personalLink) {
    try {
      // 1. CHANGE: Generate QR Code as a Buffer instead of a Data URL string
      const qrCodeBuffer = await QRCode.toBuffer(personalLink);
  
      // 2. Construct HTML with CID reference
      const emailBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #3764df;">Welcome, ${name}!</h2>
          <p>Thank you for signing up. You have been assigned a new protocol.</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <p style="margin: 0 0 10px; font-weight: bold;">Access Link:</p>
            <a href="${personalLink}" style="background: #3764df; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">
              Open Protocol
            </a>
            
            <div style="margin-top: 20px;">
              <p style="margin-bottom: 5px; font-size: 0.9em; color: #666;">Scan to open on mobile:</p>
              
              <img src="cid:qrcode-image" alt="QR Code" style="width: 150px; height: 150px;" />
              
            </div>
          </div>
  
          <p>If you need to log in manually later:</p>
          <ul style="background: #eee; padding: 15px 30px; border-radius: 5px;">
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
        </div>
      `;
  
      const info = await transporter.sendMail({
        from: `"TaskProtocoller" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your Access Link & Credentials",
        html: emailBody,
        
        // 4. ADD: Attachments configuration
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeBuffer,
            cid: 'qrcode-image' // MUST match the img src above (without 'cid:')
          }
        ]
      });
  
      logToFile(`✅ EMAIL SENT to ${email} (MsgID: ${info.messageId})`);
      return true;
    } catch (error) {
      console.error("❌ Email Error:", error);
      logToFile(`❌ EMAIL FAILED to ${email}: ${error.message}`);
      return false;
    }
  }

  export async function sendPasswordResetEmail(email, resetLink) {
    try {
      const emailBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #3764df;">Password Reset Request</h2>
          <p>You requested to reset your password.</p>
          <p>Click the link below to set a new password. This link is valid for 1 hour.</p>
          
          <a href="${resetLink}" style="background: #3764df; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0;">
            Reset Password
          </a>
          
          <p style="font-size: 0.9em; color: #666;">If you did not request this, please ignore this email.</p>
        </div>
      `;
  
      await transporter.sendMail({
        from: `"TaskProtocoller" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: emailBody,
      });
  
      return true;
    } catch (error) {
      console.error("❌ Reset Email Error:", error);
      return false;
    }
  }