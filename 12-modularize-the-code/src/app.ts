import express from "express";
import apiRouter from "./routes/startupApi.routes";
import type { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({ greeting: "Hello there, welcome to startups api", message: "Please visit /api route to get the data" });
});

app.use("/api", apiRouter);

export default app;
