import { executeTransaction } from '../db/queryHelper.js';
import { logToFile } from '../utils/logger.js';

export const saveProtocol = async (req, res) => {
  logToFile(`🧩 saveProtocol called with body: ${JSON.stringify(req.body)}`);
  const { protocol_group_id, name, language_id, description, created_by, updated_by, tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    logToFile(`❌ Invalid request: no tasks provided`);
    return res.status(400).json({ error: 'No tasks provided' });
  }

  try {
    const protocolId = await executeTransaction(async (conn) => {
      const [result] = await conn.query(
        `INSERT INTO protocols (protocol_group_id, name, language_id, description, version, created_by, updated_by)
         VALUES (?, ?, ?, ?, 1, ?, ?)`,
        [
          protocol_group_id || 1,
          name || 'Placeholder Protocol',
          language_id || 1,
          description || 'Auto-created from AdminTaskEditor',
          created_by || 1,
          updated_by || 1,
        ]
      );

      const protocolId = result.insertId;
      logToFile(`✅ Inserted protocol with id=${protocolId}`);

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