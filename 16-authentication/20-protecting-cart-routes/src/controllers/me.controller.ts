import { getDatabaseConnection } from "../database/schema/init.database";
import type { Request, Response } from "express";
import type { UserType } from "../types/authentication.types";

export async function getCurrentUser(req: Request, res: Response) {
	try {
		const db = getDatabaseConnection();
		/*
Challenge:
  1. If no userId is attached to the session, end the response with the following JSON:
  { isLoggedIn: false }
  2. If the session has a userId, connect to the DB and get the user's name.
  3. End the response with the following JSON:
  { isLoggedIn: true, name: <user's name here> }
*/
		if (!req.session.user?.id) {
			return res.status(200).json({ isLoggedIn: false });
		}

		const checkUser = db.prepare(`SELECT id, name, email, username FROM users WHERE id = ?`).get(req.session.user.id) as UserType;

		res.status(200).json({ isLoggedIn: true, name: checkUser.name });
	} catch (err) {
		console.error("getCurrentUser error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
}
