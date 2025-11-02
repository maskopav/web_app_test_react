import { executeTransaction } from '../db/queryHelper.js';

export const saveProtocol = async (req, res) => {
  console.log("🧩 saveProtocol called with body:", req.body);
  const { name, language_id, description, created_by, tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: 'No tasks provided' });
  }

  try {
    const protocolId = await executeTransaction(async (conn) => {
      const [result] = await conn.query(
        `INSERT INTO protocols (name, language_id, description, version, created_by)
         VALUES (?, ?, ?, 1, ?)`,
        [
          name || 'Placeholder Protocol',
          language_id || 1,
          description || 'Auto-created from AdminTaskEditor',
          created_by || 1,
        ]
      );

      const protocolId = result.insertId;

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
      }

      return protocolId;
    });

    res.json({ success: true, protocol_id: protocolId });
  } catch (err) {
    console.error('❌ Error saving protocol:', err);
    res.status(500).json({ error: 'Failed to save protocol' });
  }
};
