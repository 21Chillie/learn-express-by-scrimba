import { app } from "./app";
import { db } from "./database/init.database";
import "./database/createTable";

const PORT = 8000;

const server = app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
	console.log("Closing database...");
	db.close();
	console.log("Database closed. Goodbye!");
	server.close(() => process.exit(0));
});
