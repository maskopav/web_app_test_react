import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

// GET /api/mappings?tables=tasks,languages,protocols
router.get("/", async (req, res) => {
  try {
    const tables = (req.query.tables || "").split(",").filter(Boolean);

    if (tables.length === 0) {
      return res.status(400).json({ error: "No tables specified" });
    }

    const results = {};
    for (const table of tables) {
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      results[table] = rows;
    }

    res.json(results);
  } catch (err) {
    console.error("Error fetching mappings:", err);
    res.status(500).json({ error: "Failed to load mappings" });
  }
});

export default router;
