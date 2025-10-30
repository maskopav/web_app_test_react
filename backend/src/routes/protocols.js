// src/routes/protocols.js
import express from 'express';
import pool from '../db/connection.js';

const router = express.Router();

/**
 * Example payload (frontend sends this):
 * {
 *   name: "My protocol",
 *   language_id: 1,
 *   description: "Voice test protocol",
 *   created_by: 123,
 *   tasks: [
 *     { task_id: 1, task_order: 1, params: { duration: 5, phoneme: "a" } },
 *     { task_id: 2, task_order: 2, params: { syllable: "pa", repeat: 3 } }
 *   ]
 * }
 */
router.post('/save', async (req, res) => {
  const { name, language_id, description, created_by, tasks } = req.body;

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: 'No tasks provided' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert into protocols table
    const [result] = await conn.query(
      `INSERT INTO protocols (name, language_id, description, version, created_by)
       VALUES (?, ?, ?, 1, ?)`,
      [
        name || 'Placeholder Protocol',
        language_id || 1,
        description || 'Auto-created from AdminTaskEditor',
        created_by || 1
      ]
    );
    console.log(result);

    const protocolId = result.insertId;

    // Insert into protocol_tasks table
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      await conn.query(
        `INSERT INTO protocol_tasks (protocol_id, task_id, task_order, params)
         VALUES (?, ?, ?, ?)`,
        [
          protocolId,
          t.task_id,
          t.task_order || i + 1,
          JSON.stringify(t.params || {})
        ]
      );
    }

    await conn.commit();
    res.json({ success: true, protocol_id: protocolId });

  } catch (err) {
    await conn.rollback();
    console.error('Error saving protocol:', err);
    res.status(500).json({ error: 'Failed to save protocol' });
  } finally {
    conn.release();
  }
});

export default router;
