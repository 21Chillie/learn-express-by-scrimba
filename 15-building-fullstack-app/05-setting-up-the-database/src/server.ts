import { app } from "./app";
import { db } from "./database/database";
import "./database/init.database";

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
