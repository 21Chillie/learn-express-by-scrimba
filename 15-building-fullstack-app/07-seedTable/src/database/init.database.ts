import path from "path";
import Database from "better-sqlite3";

export const db = new Database(path.join(__dirname, "app.db"));

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
