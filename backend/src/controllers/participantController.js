/* backend/src/controllers/participantController.js */
import { executeQuery, executeTransaction } from "../db/queryHelper.js";
import { generateAccessToken } from "../utils/tokenGenerator.js";
import { logToFile } from "../utils/logger.js";

// GET /api/participants?project_id=X
export const getParticipants = async (req, res) => {
  const { project_id } = req.query;
  try {
    // Use the new view if available, or fallback to raw query
    // Here we use the logic to fetch distinct participants for a project
    const sql = `
      SELECT * FROM v_participant_protocols
      WHERE project_id = ?
      ORDER BY full_name ASC
    `;
    const rows = await executeQuery(sql, [project_id]);
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