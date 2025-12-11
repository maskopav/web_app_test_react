import bcrypt from "bcrypt";
import crypto from "crypto";
import { executeQuery, executeTransaction } from "../db/queryHelper.js";
import { assignProtocolToParticipant } from "../utils/assignmentHelper.js";
import { sendCredentialsEmail } from "../utils/emailService.js";
import { logToFile } from "../utils/logger.js";

const SALT_ROUNDS = 10;

// Helper to check if participant exists
async function findParticipantByEmail(email) {
  const rows = await executeQuery(
    `SELECT * FROM participants WHERE login_email = ? OR contact_email = ?`,
    [email, email]
  );
  return rows[0];
}

// POST /api/auth/signup
export const participantSignup = async (req, res) => {
  const { projectToken, full_name, birth_date, sex, email } = req.body;
  logToFile(`📝 Signup Request: ${email} with token: ${projectToken}`);

  try {
    // 1. Resolve Project Protocol from Public Token
    const ppRows = await executeQuery(
      `SELECT id, project_id, protocol_id FROM project_protocols WHERE access_token = ?`,
      [projectToken]
    );

    if (ppRows.length === 0) {
      return res.status(404).json({ error: "Invalid Project Link" });
    }
    const { id: projectProtocolId, project_id, protocol_id } = ppRows[0];

    // 2. Check if participant exists
    let participant = await findParticipantByEmail(email);

    await executeTransaction(async (conn) => {
      // 3. Create Participant if needed
      if (!participant) {
        // Generate random secure password
        const rawPassword = crypto.randomBytes(4).toString("hex"); // e.g. "a1b2c3d4"
        const hash = await bcrypt.hash(rawPassword, SALT_ROUNDS);

        const [res] = await conn.query(
          `INSERT INTO participants (full_name, birth_date, sex, contact_email, login_email, login_password_hash)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [full_name, birth_date, sex, email, email, hash]
        );
        
        participant = { id: res.insertId, full_name, rawPassword }; // Attach raw password to send in email
      }

      // 4. Assign Protocol (Idempotent check handled inside logic or we check here)
      // Check if already assigned
      const [existing] = await conn.query(
        `SELECT access_token FROM participant_protocols 
         WHERE participant_id = ? AND project_protocol_id = ?`,
        [participant.id, projectProtocolId]
      );

      let uniqueToken;

      if (existing.length > 0) {
        uniqueToken = existing[0].access_token;
        // Reactivate if inactive
        await conn.query(`UPDATE participant_protocols SET is_active=1 WHERE participant_id=? AND project_protocol_id=?`, [participant.id, projectProtocolId]);
      } else {
        // Use existing helper
        const assignment = await assignProtocolToParticipant(conn, participant.id, project_id, protocol_id);
        uniqueToken = assignment.unique_token;
        // Activate immediately
        await conn.query(`UPDATE participant_protocols SET is_active=1 WHERE id=?`, [assignment.participant_protocol_id]);
      }

      // 5. Send Email (Only if we generated a password, or always send the link)
      const link = `${req.headers.origin}/#/participant/${uniqueToken}`;
      if (participant.rawPassword) {
        await sendCredentialsEmail(email, full_name, participant.rawPassword, link);
      } else {
        // Just send the link reminder if they already existed
        await sendCredentialsEmail(email, full_name, "(Existing Account)", link);
      }

      // 6. Return the specific token for immediate redirect
      return uniqueToken;
    }).then((token) => {
      res.json({ success: true, token });
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed." });
  }
};

// POST /api/auth/login
export const participantLogin = async (req, res) => {
  const { email, password, projectToken } = req.body;
  logToFile(`🔑 Login Request: ${email} with token: '${projectToken}'`);

  try {
    // 1. Find Participant
    const participant = await findParticipantByEmail(email);
    if (!participant || !participant.login_password_hash) {
      logToFile(`❌ Login Failed: User not found or no password set for ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Verify Password
    const match = await bcrypt.compare(password, participant.login_password_hash);
    if (!match) {
      logToFile(`❌ Login Failed: Wrong password for ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Resolve Project Context
    // We trim the token just in case whitespace crept in
    const cleanToken = (projectToken || '').trim();
    
    const ppRows = await executeQuery(
      `SELECT id FROM project_protocols WHERE access_token = ?`,
      [cleanToken]
    );
    
    if (ppRows.length === 0) {
      logToFile(`❌ Login Failed: Project Context not found for token '${cleanToken}'`);
      return res.status(404).json({ error: "Invalid Project Context" });
    }
    const projectProtocolId = ppRows[0].id;

    // 4. Find their personal token for this protocol
    const assignRows = await executeQuery(
      `SELECT access_token FROM participant_protocols 
       WHERE participant_id = ? AND project_protocol_id = ?`,
      [participant.id, projectProtocolId]
    );

    if (assignRows.length === 0) {
      return res.status(403).json({ error: "You are not enrolled in this protocol yet." });
    }

    logToFile(`✅ Login Success: ${email} -> ${assignRows[0].access_token}`);
    res.json({ success: true, token: assignRows[0].access_token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};