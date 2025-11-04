import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, (): void => {
	console.log(`Server running at http://localhost:${PORT}`);
});
