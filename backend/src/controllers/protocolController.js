// src/controllers/protocolController.js
import { executeTransaction, executeQuery } from '../db/queryHelper.js';
import { logToFile } from '../utils/logger.js';

export const saveProtocol = async (req, res) => {
  logToFile(`🧩 saveProtocol called with body: ${JSON.stringify(req.body)}`);
  const { protocol_group_id, name, language_id, description, version, created_by, updated_by, tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    logToFile(`❌ Invalid request: no tasks provided`);
    return res.status(400).json({ error: 'No tasks provided' });
  }

  try {
    const protocolId = await executeTransaction(async (conn) => {
      // Determine the protocol_group_id
      let groupId = protocol_group_id;
      if (!groupId) {
        const [rows] = await conn.query(`SELECT COALESCE(MAX(protocol_group_id), 0) + 1 AS next_group_id FROM protocols`);
        groupId = rows[0].next_group_id || 1;
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
          version || 1,
          created_by || 1,
          updated_by || 1,
        ]
      );

      const protocolId = result.insertId;
      logToFile(`✅ Inserted protocol with id=${protocolId}, group_id=${groupId}, version=${version}`);

      const insertTask = `INSERT INTO protocol_tasks
        (protocol_id, task_id, task_order, params)
        VALUES (?, ?, ?, ?)`;

      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        await conn.query(insertTask, [
          protocolId,
          t.task_id,
          t.task_order || i + 1,
          JSON.stringify(t.params || {}),
        ]);
        logToFile(`→ Added task ${t.task_id} to protocol ${protocolId}`);
      }

      return protocolId;
    });

    res.json({ success: true, protocol_id: protocolId });
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