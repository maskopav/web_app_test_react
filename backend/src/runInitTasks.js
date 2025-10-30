// src/index.js
import path from "path";
import { fileURLToPath } from "url";
import { runSqlFile } from "./utils/runSqlFile.js";
import pool from "./db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlFilePath = path.join(__dirname, "../scripts/initTasks.sql");

async function main() {
  console.log("Connected to MariaDB ✅");
  await runSqlFile(sqlFilePath);
  await pool.end();
  console.log("Connection closed.");
}

main();
