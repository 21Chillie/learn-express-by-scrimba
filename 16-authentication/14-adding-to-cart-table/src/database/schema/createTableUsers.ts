import { getDatabaseConnection } from "./init.database";

function createTableUsers() {
	const db = getDatabaseConnection();

	db.prepare(
		`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `
	).run();

	console.log(`Table 'users' initialized`);
}

createTableUsers()
