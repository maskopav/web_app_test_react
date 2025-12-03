/* backend/src/controllers/participantController.js */
import { executeQuery, executeTransaction } from "../db/queryHelper.js";
import { logToFile } from "../utils/logger.js";
import { assignProtocolToParticipant } from "../utils/assignmentHelper.js";

// GET /api/participants?project_id=X
export const getParticipants = async (req, res) => {
  const { project_id } = req.query;
  try {
    let sql = `SELECT * FROM v_participant_protocols WHERE is_current_protocol = 1`;
    const params = [];

    // Only filter if project_id is provided
    if (project_id) {
      sql += ` AND project_id = ?`;
      params.push(project_id);
    }

    sql += ` ORDER BY full_name ASC`;

    const rows = await executeQuery(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch participants" });
  }
};

// POST /api/participants/create
export const createParticipant = async (req, res) => {
  const { 
    full_name, 
    external_id, 
    birth_date, 
    sex, 
    contact_email, 
    notes, 
    project_id, 
    protocol_id // The selected protocol to assign immediately
  } = req.body;

  logToFile(`👤 Creating participant: ${full_name},${external_id} for project ${project_id}`);

  try {
    await executeTransaction(async (conn) => {
      // 1. Insert Participant
      const [pResult] = await conn.query(
        `INSERT INTO participants (full_name, external_id, birth_date, sex, contact_email, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [full_name, external_id || null, birth_date, sex, contact_email, notes]
      );
      const newParticipantId = pResult.insertId;

      // 2. Use the shared Helper for protocol assignment
      const assignment = await assignProtocolToParticipant(conn, newParticipantId, project_id, protocol_id);
      
      res.json({ 
        success: true,
        participant_id: newParticipantId,
        ...assignment
      });
      
      logToFile(`✅ Created participant ${newParticipantId} & assigned protocol.`);
    });
  } catch (err) {
    console.error("Create participant error:", err);
    res.status(500).json({ error: err.message || "Failed to create participant" });
  }
};

// PUT /api/participants/:id
export const updateParticipant = async (req, res) => {
  const { id } = req.params;
  const { 
    full_name, 
    external_id, 
    birth_date, 
    sex, 
    contact_email, 
    contact_phone, 
    notes 
  } = req.body;

  try {
    // 1. Validation: Check for duplicates (excluding the current participant)
    const duplicateCheckSql = `
      SELECT id FROM participants 
      WHERE id != ? AND (
        (external_id = ? AND external_id IS NOT NULL AND external_id != '')
        OR (full_name = ? AND birth_date = ? AND sex = ?)
      )
      LIMIT 1
    `;
    
    // Ensure empty strings are treated as NULL for date/external_id
    const existing = await executeQuery(duplicateCheckSql, [
      id,
      external_id || null,
      full_name,
      birth_date || null, 
      sex
    ]);

    if (existing.length > 0) {
      return res.status(409).json({ 
        error: "Another participant with these details already exists." 
      });
    }

    // 2. Update
    const updateSql = `
      UPDATE participants 
      SET full_name=?, external_id=?, birth_date=?, sex=?, contact_email=?, contact_phone=?, notes=?, updated_at=NOW()
      WHERE id=?
    `;

    await executeQuery(updateSql, [
      full_name, 
      external_id || null, 
      birth_date || null, 
      sex, 
      contact_email, 
      contact_phone, 
      notes, 
      id
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error("Update participant error:", err);
    res.status(500).json({ error: err.message || "Failed to update participant" });
  }
};