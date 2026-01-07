// backend/src/controllers/authController.js
import bcrypt from "bcrypt";
import crypto from "crypto";
import { executeQuery, executeTransaction } from "../db/queryHelper.js";
import { assignProtocolToParticipant } from "../utils/assignmentHelper.js";
import { sendCredentialsEmail, sendPasswordResetEmail } from "../utils/emailService.js"; // Added import
import { logToFile } from "../utils/logger.js";

const SALT_ROUNDS = 10;

async function findParticipantByEmail(email) {
  const rows = await executeQuery(
    `SELECT * FROM participants WHERE login_email = ? OR contact_email = ?`,
    [email, email]
  );
  return rows[0];
}

// POST /api/auth/signup
export const participantSignup = async (req, res) => {
  const { projectToken, full_name, birth_date, sex, email, contact_phone } = req.body;
  logToFile(`📝 Signup Request: ${email}`);

  try {
    // 1. Resolve Project Protocol
    const ppRows = await executeQuery(
      `SELECT id, project_id, protocol_id FROM project_protocols WHERE access_token = ?`,
      [projectToken]
    );

    if (ppRows.length === 0) return res.status(404).json({ error: "Invalid Project Link" });
    const { id: projectProtocolId, project_id, protocol_id } = ppRows[0];

    // 2. Check duplicate (PREVENT EXISTING EMAIL)
    const existingUser = await findParticipantByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Account with this email already exists. Please log in." });
    }

    // 3. Create New Participant & Assign
    await executeTransaction(async (conn) => {
      // Generate password
      const rawPassword = crypto.randomBytes(4).toString("hex");
      const hash = await bcrypt.hash(rawPassword, SALT_ROUNDS);

      // Create unique externalId
      let externalId;
      let isUnique = false;
      
      while (!isUnique) {
        externalId = `S-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
        
        // Check if this specific ID already exists
        const [existingId] = await conn.query(
          `SELECT id FROM participants WHERE external_id = ?`, 
          [externalId]
        );
        
        if (existingId.length === 0) isUnique = true;
      }

      const [resIns] = await conn.query(
        `INSERT INTO participants (external_id, full_name, birth_date, sex, contact_email, contact_phone, login_email, login_password_hash, creation_source)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [externalId, full_name, birth_date, sex, email, contact_phone, email, hash, 'signup']
      );
      
      const participantId = resIns.insertId;

      // Assign Protocol
      const assignment = await assignProtocolToParticipant(conn, participantId, project_id, protocol_id);
      
      // Activate
      await conn.query(`UPDATE participant_protocols SET is_active=1, start_date = NOW() WHERE id=?`, [assignment.participant_protocol_id]);

      // Send Email
      // Use Referer to get the full path before the hash (e.g., /test/dist/)
      // Fallback to origin if Referer is missing
      const baseUrl = req.headers.referer || req.headers.origin;
      const link = `${baseUrl}#/participant/${assignment.unique_token}`;
      await sendCredentialsEmail(email, full_name, rawPassword, link);

      return assignment.unique_token;
    }).then((token) => {
      res.json({ success: true, token });
    });

  } catch (err) {
    console.error("Signup error:", err);
    logToFile(`❌ EMAIL FAILED to ${email}: ${err.message}`);
    res.status(500).json({ error: "Signup failed." });
  }
};

// POST /api/auth/login
export const participantLogin = async (req, res) => {
  const { email, password, projectToken } = req.body;
  logToFile(`🔑 Login Request: ${email}`);

  try {
    const participant = await findParticipantByEmail(email);
    if (!participant || !participant.login_password_hash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, participant.login_password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Resolve Context
    const cleanToken = (projectToken || '').trim();
    const ppRows = await executeQuery(
      `SELECT id, project_id, protocol_id FROM project_protocols WHERE access_token = ?`,
      [cleanToken]
    );
    
    if (ppRows.length === 0) return res.status(404).json({ error: "Invalid Project Context" });
    const { id: projectProtocolId, project_id, protocol_id } = ppRows[0];

    // Check Assignment
    const assignRows = await executeQuery(
      `SELECT access_token FROM participant_protocols 
       WHERE participant_id = ? AND project_protocol_id = ?`,
      [participant.id, projectProtocolId]
    );

    // LOGIC CHANGE: If not assigned, assign them now (Enroll via Login)
    if (assignRows.length === 0) {
      logToFile(`➕ Auto-assigning user ${participant.id} to protocol ${protocol_id}`);
      
      const token = await executeTransaction(async (conn) => {
        const assignment = await assignProtocolToParticipant(conn, participant.id, project_id, protocol_id);
        await conn.query(`UPDATE participant_protocols SET is_active=1, start_date = NOW() WHERE id=?`, [assignment.participant_protocol_id]);
        return assignment.unique_token;
      });
      
      return res.json({ success: true, token });
    }

    res.json({ success: true, token: assignRows[0].access_token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const participant = await findParticipantByEmail(email);
    if (!participant) {
      // Return success even if not found to prevent email scraping
      return res.json({ success: true, message: "If account exists, email sent." });
    }

    // Generate Token
    const token = crypto.randomBytes(32).toString('hex');
    const expireTime = new Date(Date.now() + 3600000); // 1 hour

    // Save to DB
    await executeQuery(
      `UPDATE participants SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?`,
      [token, expireTime, participant.id]
    );

    // Send Email
    // Use Referer to get the full path before the hash (e.g., /test/dist/)
    // Fallback to origin if Referer is missing
    const baseUrl = req.headers.referer || req.headers.origin;
    const resetLink = `${baseUrl}/#/reset-password/${token}`;
    await sendPasswordResetEmail(email, resetLink);

    res.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Request failed" });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Verify Token
    const rows = await executeQuery(
      `SELECT * FROM participants WHERE reset_password_token = ? AND reset_password_expires > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    const participant = rows[0];

    // Update Password
    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await executeQuery(
      `UPDATE participants SET login_password_hash = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?`,
      [hash, participant.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Reset failed" });
  }
};

// POST /api/auth/admin/login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  logToFile(`👤 Admin Login Request: ${email}`);

  try {
    // 1. Find user in the 'users' table
    const rows = await executeQuery(
      `SELECT id, email, password_hash, full_name, role_id FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const user = rows[0];

    // 2. Verify Password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    // 3. Return user data
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id, // 1 = Master, 2 = Project Admin
      }
    });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};