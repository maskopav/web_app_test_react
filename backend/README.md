# 🧩 Backend – Task Initialization for React Voice Recorder

This backend module initializes and manages the database for the **React Voice Recorder & Admin Task Editor** app.  
It connects to a MariaDB database and automatically runs SQL scripts to populate base tables (`task_types`, `tasks`).

---

## ⚙️ Project Overview

### Purpose
To automate database setup — so no manual import in phpMyAdmin is needed.

### Features
- Connects to MariaDB/MySQL automatically via Node.js
- Runs SQL scripts (e.g., inserting tasks)
- Uses environment variables for DB credentials
- Modular structure for adding more scripts later

---

## 📁 Structure

| Folder / File | Description |
|----------------|-------------|
| `scripts/initTasks.sql` | SQL script inserting base tasks and task types |
| `src/db/connection.js` | Creates and exports the database connection pool |
| `src/utils/runSqlFile.js` | Reads `.sql` files and executes them sequentially |
| `src/index.js` | Entry point – runs the task initialization |
| `.env` | Stores DB credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) |

```bash
backend/
├── package.json
├── tsconfig.json               # optional if you use TypeScript
├── README.md
├── .env                        # stores DB credentials (ignored by git)
│
├── scripts/
│   ├── createUsers.sql
│   └── initTasks.sql           # your SQL script (provided above)
│
├── src/
│   ├── db/
│   │   └── connection.js       # MariaDB connection pool
│   ├── routes/
│   │   └── protocols.js        # endpoint for saving tasks
│   ├── utils/
│   │   └── runSqlFile.js       # executes .sql files programmatically
│   ├── app.js                  # mounts express, routes, middleware
│   ├── server.js               # Entry point (starts the backend)
│   │
│   └── index.js                # entry point (runs SQL insert automatically)

```

## Setup

### Install dependencies
```bash
cd backend
npm init -y
npm install mysql2 dotenv


