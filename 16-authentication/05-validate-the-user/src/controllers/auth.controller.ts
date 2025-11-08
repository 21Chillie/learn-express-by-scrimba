import { Request, Response } from "express";
import validator from "validator";
import { UserSignUpType } from "../types/userSignUp.types";
import { getDatabaseConnection } from "../database/schema/init.database";

export async function registerUser(req: Request<{}, {}, UserSignUpType, {}>, res: Response) {
	let { name, email, username, password } = req.body;

	if (!name || !email || !username || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}

	const trimmedName = name.trim();
	const trimmedEmail = email.trim().toLowerCase();
	const trimmedUsername = username.trim();

	const usernameRegexPattern = /^[a-zA-Z0-9_-]{1,20}$/;

	if (!usernameRegexPattern.test(trimmedUsername)) {
		console.log("Invalid Username");
		return res.status(400).json({ error: "Username may only contain letters, numbers, hyphen, and underscore" });
	}

	if (!validator.isEmail(trimmedEmail)) {
		console.log("Invalid Email");
		return res.status(400).json({ error: "Invalid email format" });
	}

	const userData: UserSignUpType = {
		name: trimmedName,
		email: trimmedEmail,
		username: trimmedUsername,
		password: password,
	};

	console.log(userData);
}
