/* backend/src/controllers/participantController.js */
import { executeQuery, executeTransaction } from "../db/queryHelper.js";
import { generateAccessToken } from "../utils/tokenGenerator.js";
import { logToFile } from "../utils/logger.js";

// GET /api/participants?project_id=X
export const getParticipants = async (req, res) => {
  const { project_id } = req.query;
  try {
    let sql = `SELECT * FROM v_participant_protocols`;
    const params = [];

    // Only filter if project_id is provided
    if (project_id) {
      sql += ` WHERE project_id = ?`;
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

  logToFile(`👤 Creating participant: ${full_name} for project ${project_id}`);

  try {
    await executeTransaction(async (conn) => {
      // 1. Insert Participant
      const [pResult] = await conn.query(
        `INSERT INTO participants (full_name, external_id, birth_date, sex, contact_email, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [full_name, external_id || null, birth_date, sex, contact_email, notes]
      );
      const newParticipantId = pResult.insertId;

      // 2. Lookup Project Protocol ID
      // We need the link between the project and the selected protocol version
      const [ppRows] = await conn.query(
        `SELECT id FROM project_protocols WHERE project_id = ? AND protocol_id = ?`,
        [project_id, protocol_id]
      );

      if (ppRows.length === 0) {
        throw new Error(`Protocol ${protocol_id} is not assigned to project ${project_id}`);
      }
      const projectProtocolId = ppRows[0].id;

      // 3. Assign Protocol (Create participant_protocol record)
      const token = generateAccessToken();
      await conn.query(
        `INSERT INTO participant_protocols 
         (participant_id, project_protocol_id)
         VALUES (?, ?)`,
        [newParticipantId, projectProtocolId]
      );
      
      logToFile(`✅ Created participant ${newParticipantId} and assigned protocol ${projectProtocolId}`);
    });

    res.json({ success: true });
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
      SET full_name=?, external_id=?, birth_date=?, sex=?, contact_email=?, contact_phone=?, notes=?
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