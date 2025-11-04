import express from "express";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
	res.send("Hello World");
});

export default app;
