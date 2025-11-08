import { getDatabaseConnection } from "./init.database";

function logDatabase() {
	const db = getDatabaseConnection();

	const tableName = db.prepare(`SELECT name FROM sqlite_master WHERE type='table';`).all();

	const tableProduct = db.prepare(`SELECT * FROM products`).all();
	const tableUsers = db.prepare(`SELECT * FROM users`).all();

	console.log("📦 Tables in database:", tableName);
	console.table(tableProduct);
	console.table(tableUsers);
}

logDatabase();
