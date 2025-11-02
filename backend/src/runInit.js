import path from 'path';
import { fileURLToPath } from 'url';
import { runSqlFile } from './utils/runSqlFile.js';
import pool from './db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlFilePath = path.join(__dirname, '../scripts/seed/seed_all.sql');

(async function init() {
  console.log('🌱 Seeding database...');
  await runSqlFile(sqlFilePath);
  await pool.end();
  console.log('✅ Database seeded and connection closed.');
})();
