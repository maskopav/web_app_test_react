# Backend – TaskProtocoller Web App

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
| `.env` | Stores DB credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) |

```bash
backend/
├── package.json
├── tsconfig.json               # optional if you use TypeScript
├── README.md
├── .env                        # stores DB credentials (ignored by git)
│
├── scripts/
│   ├── DB_creation.sql         # create DB tables
│   └── initTasks.sql           # insert scripts ( mapping tables,..)
│
├── src/
│   ├── db/
│   │   └── connection.js       # MariaDB connection pool
│   ├── routes/
│   │   ├── mappings.js         # get mapping tables from DB
│   │   └── protocols.js        # endpoint for saving tasks - when user clicks on save in AdminTaskEditor
│   ├── utils/
│   │   └── runSqlFile.js       # executes .sql files programmatically
│   ├── app.js                  # ? does not exist
│   ├── server.js               # Entry point (starts the backend)
│   │
│   └── runInitTasks.js         # entry point for inserting mapping tables to DB (runs SQL insert automatically)

```

## Setup

### Install dependencies
```bash
cd backend
npm init -y
npm install mysql2 dotenv
```

```bash
backend/
├── scripts/
│   ├── schema/                # creation scripts only (tables, constraints)
│   │   ├── create_tables.sql
│   │   └── create_views.sql
│   ├── seed/                  # initial inserts only (lookup tables)
│   │   ├── insert_task_types.sql
│   │   ├── insert_languages.sql
│   │   ├── insert_tasks.sql
│   │   └── seed_all.sql       # imports all above
│   └── utils/
│       └── truncate_all.sql
│
├── src/
│   ├── app.js                 # initializes app, middleware, routes
│   ├── server.js              # starts the app (listens on PORT)
│   │
│   ├── db/
│   │   ├── connection.js
│   │   └── queryHelper.js     # reusable query executor
│   │
│   ├── controllers/           # main business logic (matches frontend api)
│   │   ├── mappingController.js
│   │   ├── protocolController.js
│   │   └── genericController.js  # base class (optional)
│   │
│   ├── routes/                # routers only (thin)
│   │   ├── mappings.js
│   │   ├── protocols.js
│   │   └── index.js           # exports all routers
│   │
│   ├── services/              # reusable logic not tied to express
│   │   ├── protocolService.js
│   │   └── mappingService.js
│   │
│   ├── utils/
│   │   ├── runSqlFile.js
│   │   ├── fileUtils.js
│   │   └── logger.js
│   │
│   └── runInit.js             # runs all init SQLs (modular)
│
└── .env
```