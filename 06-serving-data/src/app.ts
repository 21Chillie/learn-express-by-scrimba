import express from "express";
import type { Request, Response } from "express";
import { startups } from "./data/data";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
	res.send("Hello World");
});

app.get("/api", (req: Request, res: Response): void => {
	res.status(200).json(startups);
});

export default app;
