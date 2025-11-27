// src/controllers/sessionController.js
import pool from "../db/connection.js";
import { executeQuery } from "../db/queryHelper.js";
import { logToFile } from '../utils/logger.js';

// POST /api/sessions/init
export const initSession = async (req, res) => {
  const { token, deviceMetadata } = req.body;
  const userAgent = req.headers["user-agent"];
  // Get IP (handles proxies like Nginx/Cloudflare if configured, or direct)
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    // 1. Resolve Token to Participant Protocol ID
    const [ppRow] = await executeQuery(
      `SELECT id FROM participant_protocols WHERE access_token = ?`,
      [token]
    );

    if (!ppRow) {
      return res.status(404).json({ error: "Invalid token" });
    }
    const participantProtocolId = ppRow.id;

    // 2. Check for an existing incomplete session for today (Optional Logic)
    // If you want to resume sessions, keep this. If every link click = new session, remove this block.
    // Here we create a NEW session every time the app is loaded to ensure we capture the specific environment.
    
    // 3. Insert New Session
    const [insertResult] = await pool.query(
      `INSERT INTO sessions 
      (participant_protocol_id, session_date, user_agent, ip_address, device_metadata) 
      VALUES (?, NOW(), ?, ?, ?)`,
      [
        participantProtocolId, 
        userAgent, 
        ipAddress, 
        JSON.stringify(deviceMetadata || {})
      ]
    );

    const newSessionId = insertResult.insertId;
    logToFile(`✅ Session initialized: ID ${newSessionId} for PP_ID ${participantProtocolId}`);

    res.json({ success: true, sessionId: newSessionId });

  } catch (err) {
    logToFile("❌ Session Init Error:", err);
    res.status(500).json({ error: "Failed to initialize session" });
  }
};