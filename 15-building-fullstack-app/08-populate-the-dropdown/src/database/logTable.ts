import { getDatabaseConnection } from "./init.database";

function logDatabase() {
	const db = getDatabaseConnection();

	const tableName = db.prepare(`SELECT name FROM sqlite_master WHERE type='table';`).all();

	const tables = db.prepare(`SELECT * FROM products`).all();

	console.log("📦 Tables in database:", tableName);
	console.table(tables);
}

logDatabase();
