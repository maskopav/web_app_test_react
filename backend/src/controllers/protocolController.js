// src/controllers/protocolController.js
import { executeTransaction, executeQuery } from '../db/queryHelper.js';
import { logToFile } from '../utils/logger.js';
import { generateAccessToken } from "../utils/tokenGenerator.js";

// POST
export const saveProtocol = async (req, res) => {
  logToFile(`🧩 saveProtocol called with body: ${JSON.stringify(req.body)}`);
  const { 
    protocol_group_id, 
    name, 
    language_id, 
    description, 
    version, 
    created_by, 
    updated_by, 
    tasks,
    project_id,
    editingMode 
  } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    logToFile(`❌ Invalid request: no tasks provided`);
    return res.status(400).json({ error: 'No tasks provided' });
  }

  try {
      const protocol_id = await executeTransaction(async (conn) => {
      // Determine the protocol_group_id
      let groupId = protocol_group_id;
      if (!groupId) {
        const [rows] = await conn.query(`SELECT COALESCE(MAX(protocol_group_id), 0) + 1 AS next_group_id FROM protocols`);
        groupId = rows[0].next_group_id || 1;
      }

      let newVersion = version || 1;

      if (editingMode) {
        // find latest version
        const [verRows] = await conn.query(
          `SELECT COALESCE(MAX(version), 0) AS max_version FROM protocols WHERE protocol_group_id = ?`,
          [groupId]
        );
        newVersion = verRows[0].max_version + 1;

        // mark old versions as not current
        await conn.query(
          `UPDATE protocols SET is_current = 0, updated_at = NOW() WHERE protocol_group_id = ? AND is_current = 1`,
          [groupId]
        );
      }

      // Insert the new protocol
      const [result] = await conn.query(
        `INSERT INTO protocols (protocol_group_id, name, language_id, description, version, created_by, updated_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          groupId,
          name || 'Placeholder Protocol',
          language_id || 1,
          description || 'Auto-created from AdminTaskEditor',
          newVersion || 1,
          created_by || 1,
          updated_by || 1,
        ]
      );

      const protocol_id = result.insertId;
      logToFile(`✅ Inserted protocol with id=${protocol_id}, group_id=${groupId}, version=${version}`);

      const insertTask = `INSERT INTO protocol_tasks
        (protocol_id, task_id, task_order, params)
        VALUES (?, ?, ?, ?)`;

      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        await conn.query(insertTask, [
          protocol_id,
          t.task_id,
          t.task_order || i + 1,
          JSON.stringify(t.params || {}),
        ]);
        logToFile(`→ Added task ${t.task_id} to protocol ${protocol_id}`);
      }

      // Generate unique token
      let accessToken = generateAccessToken();

      let unique = false;
      while (!unique) {
        const [rows] = await conn.query(
          `SELECT id FROM project_protocols WHERE access_token = ?`,
          [accessToken]
        );
        if (rows.length === 0) unique = true;
        else accessToken = generateAccessToken();
      }

      // Insert project_protocol
      // TEMP: project_id = 1 (choose correct project later)
      await conn.query(
        `
          INSERT INTO project_protocols
          (project_id, protocol_id, access_token)
          VALUES (?, ?, ?)
        `,
        [project_id, protocol_id, accessToken]
      );

      logToFile(`→ Created project_protocol with token ${accessToken}`);

      return protocol_id;
    });

    res.json({ success: true, protocol_id: protocol_id });
  } catch (err) {
    logToFile(`❌ Error saving protocol: ${err.stack || err}`);
    res.status(500).json({ error: 'Failed to save protocol' });
  }
};

// GET /api/protocols/:id
export const getProtocolById = async (req, res) => {
  const { id } = req.params;
  logToFile(`📖 getProtocolById called with id=${id}`);

  try {
    // Get protocol details
    const protocolRows = await executeQuery(
      `SELECT * FROM protocols WHERE id = ?`,
      [id]
    );

    if (protocolRows.length === 0) {
      return res.status(404).json({ error: 'Protocol not found' });
    }
    const protocol = protocolRows[0];

    // Get tasks assigned to that protocol
    const taskRows = await executeQuery(
      `SELECT task_id, task_order, params
       FROM protocol_tasks
       WHERE protocol_id = ?
       ORDER BY task_order ASC`,
      [id]
    );

    // Parse params JSON
    const tasks = taskRows.map(t => ({
      ...t,
      params: t.params ? JSON.parse(t.params) : {}
    }));

    // Return structured result
    const result = { ...protocol, tasks };
    res.json(result);

  } catch (err) {
    logToFile(`❌ Error fetching protocol: ${err.stack || err}`);
    res.status(500).json({ error: 'Failed to load protocol' });
  }
};

// GET /api/protocols?project_id=X
export const getProtocolsByProjectId = async (req, res) => {
  const { project_id } = req.query;
  logToFile(`📖 getProtocolsByProjectId called with id=${project_id}`);

  try {
    let query = "SELECT * FROM protocols";
    const params = [];

    if (project_id) {
      query = `
        SELECT p.* FROM protocols p
        JOIN project_protocols pp ON p.id = pp.protocol_id
        WHERE pp.project_id = ?
      `;
      params.push(project_id);
    }

    const rows = await executeQuery(query, params);
    res.json(rows);
  } catch (err) {
    logToFile(`❌ Error fetching protocols: ${err.stack || err}`);
    res.status(500).json({ error: 'Failed to load protocols by projectId' });
  }
};