import { Request, Response } from "express";
import validator from "validator";
import { UserSignUpType, ExistingUserType, NewUserType } from "../types/authentication.types";
import { getDatabaseConnection } from "../database/schema/init.database";
import bcrypt from "bcryptjs";

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

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);

	const userData: UserSignUpType = {
		name: trimmedName,
		email: trimmedEmail,
		username: trimmedUsername,
		password: hashPassword,
	};

	try {
		const db = getDatabaseConnection();

		const existingUser = db
			.prepare(`SELECT * FROM users WHERE email = ? OR username = ?`)
			.get(userData.email, userData.username) as ExistingUserType;

		if (existingUser) {
			if (existingUser.email === userData.email) {
				return res.status(400).json({ error: "Email is already registered, please login" });
			}

			if (existingUser.username === userData.username) {
				return res.status(400).json({ error: "Username is already registered, please login" });
			}
		}

		const insertUser = db
			.prepare(
				`
			INSERT INTO users (name, email, username, password)
			VALUES (?, ?, ?, ?)
			RETURNING id, email, username
			`
			)
			.run(userData.name, userData.email, userData.username, userData.password);

		const newUserId = insertUser.lastInsertRowid as number;

		const newUser = db
			.prepare(
				`
			SELECT id, email, username FROM users
			WHERE id = ?
			`
			)
			.get(newUserId) as NewUserType;

		req.session.user = { id: newUser.id, email: newUser.email, username: newUser.username };

		if (req.session.user) {
			console.log(`New user is registered successfully with ID: ${req.session.user.id}`);

			console.log(req.session.user);
		}

		return res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).json({ error: "Registration failed. Please try again." });
	}
}
