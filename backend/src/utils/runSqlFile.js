// src/utils/runSqlFile.js
import fs from "fs";
import pool from "../db/connection.js";

export async function runSqlFile(filePath) {
  let connection;
  try {
    const sql = fs.readFileSync(filePath, "utf8");
    console.log(`Executing script: ${filePath}...`);

    connection = await pool.getConnection(); // get explicit connection
    await connection.query(sql);
    console.log("✔ Successfully executed SQL script");
  } catch (err) {
    console.error("❌ Error executing SQL file:");
    console.error(err);
  } finally {
    if (connection) connection.release();
  }
}