import { getDatabaseConnection } from "./init.database";

function createTable() {
	const db = getDatabaseConnection();

	db.prepare(
		`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    stock INTEGER
  )
  `
	).run();
	console.log("Table initialized");
}

createTable();
