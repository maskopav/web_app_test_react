import express from "express";
import pool from "../db/connection.js";
import { createParticipantProtocol } from "../controllers/participantProtocolController.js";

const router = express.Router();

// POST /api/participant-protocols/create
router.post("/create", createParticipantProtocol);

// GET /api/participant-protocol/:token
/// Resolve unique token and load participant, project_protocol, protocol (full, including tasks)
router.get("/:token", async (req, res) => {
    const { token } = req.params;
  
    try {
      // 1. Find participant_protocol entry
      const [ppRows] = await pool.query(
        `
        SELECT * FROM participant_protocols
        WHERE unique_token = ?
        `,
        [token]
      );
  
      if (ppRows.length === 0) {
        return res.status(404).json({ error: "Invalid or expired token" });
      }
  
      const participantProtocol = ppRows[0];
  
      // 2. Load participant
      const [participantRows] = await pool.query(
        `SELECT id, full_name, birth_date, sex, contact_email 
         FROM participants WHERE id = ?`,
        [participantProtocol.participant_id]
      );
  
      if (participantRows.length === 0) {
        return res.status(500).json({ error: "Participant not found" });
      }
  
      const participant = participantRows[0];
  
      // 3. Load project_protocol
      const [projectProtocolRows] = await pool.query(
        `
        SELECT * FROM project_protocols
        WHERE id = ?
        `,
        [participantProtocol.project_protocol_id]
      );
  
      if (projectProtocolRows.length === 0) {
        return res.status(500).json({ error: "Project-protocol not found" });
      }
  
      const projectProtocol = projectProtocolRows[0];
  
      // 4. Load protocol
      const [protocolRows] = await pool.query(
        `
        SELECT * FROM protocols
        WHERE id = ?
        `,
        [projectProtocol.protocol_id]
      );
  
      if (protocolRows.length === 0) {
        return res.status(500).json({ error: "Protocol not found" });
      }
  
      const protocol = protocolRows[0];
  
      // 5. Load protocol tasks
      const [taskRows] = await pool.query(
        `
        SELECT pt.task_id, pt.task_order, pt.params
        FROM protocol_tasks pt
        WHERE pt.protocol_id = ?
        ORDER BY pt.task_order ASC
        `,
        [protocol.id]
      );
  
      // attach tasks
      protocol.tasks = taskRows.map(row => ({
        task_id: row.task_id,
        task_order: row.task_order,
        params: typeof row.params === "string" ? JSON.parse(row.params) : row.params
      }));
  
      // 6. Respond
      res.json({
        participant,
        project_protocol: projectProtocol,
        protocol
      });
  
    } catch (err) {
      console.error("Error resolving participant token:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

export default router;
