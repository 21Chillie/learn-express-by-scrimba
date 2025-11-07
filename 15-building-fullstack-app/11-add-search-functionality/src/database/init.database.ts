import path from "path";
import Database from "better-sqlite3";

let db: Database.Database | null = null;

export function getDatabaseConnection() {
	db = new Database(path.join(__dirname, "app.db"));

	db.pragma("foreign_keys = ON");
	db.pragma("journal_mode = WAL");
	console.log("✅ Database connected:");

	return db;
}
