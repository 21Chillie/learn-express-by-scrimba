import { registerUser } from "../controllers/auth.controller";
import express from "express";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
