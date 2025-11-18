import pool from "../db/connection.js";
import { generateAccessToken } from "../utils/tokenGenerator.js";

export async function createParticipantProtocol(req, res) {
  try {
    const { participant_id, project_protocol_id } = req.body;

    if (!participant_id || !project_protocol_id) {
      return res.status(400).json({ error: "Missing participant_id or project_protocol_id" });
    }

    // Generate unique token
    let token = generateAccessToken();

    let unique = false;
    while (!unique) {
    const [rows] = await conn.query(
        `SELECT id FROM participant_protocols WHERE unique_token = ?`,
        [token]
    );
    if (rows.length === 0) unique = true;
    else token = generateAccessToken();
    }

    // create row
    const [result] = await pool.query(
      `
      INSERT INTO participant_protocols
      (participant_id, project_protocol_id, unique_token, start_date, is_active)
      VALUES (?, ?, ?, NOW(), 1)
      `,
      [participant_id, project_protocol_id, token]
    );

    res.json({
      success: true,
      participant_protocol_id: result.insertId,
      unique_token: token
    });
  } catch (err) {
    console.error("Error creating participant protocol:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
