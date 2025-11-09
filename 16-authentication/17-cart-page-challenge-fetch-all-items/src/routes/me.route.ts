import express from "express";
import { getCurrentUser } from "../controllers/me.controller";

export const meRouter = express.Router();

meRouter.get("/", getCurrentUser);
