import { Request, Response } from "express";
import validator from "validator";
import { ExistingUserType, UserType } from "../types/authentication.types";
import { getDatabaseConnection } from "../database/schema/init.database";
import bcrypt from "bcryptjs";

export async function registerUser(req: Request<{}, {}, UserType, {}>, res: Response) {
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

	const userData: Omit<UserType, "id"> = {
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

		req.session.user = { id: newUserId };

		if (req.session.user) {
			console.log(`New user is registered successfully with ID: ${req.session.user.id}`);

			console.log(req.session.user);
		}

		return res.status(201).json({ message: "User registered" });
	} catch (err) {
		console.error("Registration error:", err);
		res.status(500).json({ error: "Registration failed. Please try again." });
	}
}

/*
Challenge:

 1. If the user's login details are incomplete, end the response with this JSON and a suitable code:
    { error: 'All fields are required' }

 2. If the user's login details are invalid, end the response with this JSON and a suitable code:
    { error: 'Invalid credentials'}. This could be because the user does not exist OR because the password does not match the username.

 3. If the user’s login details are valid, create a session for the user and end the response with this JSON:
    { message: 'Logged in' }

Look at .registerUser() above. Is there anything else you need to do?

Important: lastID is not available to us here, so how can we get the user’s ID to attach it to the session?

You can test it by signing in with the following:
username: test
password: test

hint.md for help.
*/

export async function loginUser(req: Request<{}, {}, { username: string; password: string }>, res: Response) {
	let { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: "All fields are required" });
	}

	username = username.trim();

	try {
		const db = getDatabaseConnection();
		const user = db.prepare(`SELECT * FROM users WHERE username = ?`).get(username) as UserType;

		if (!user) {
			return res.status(400).json({ error: "Invalid credentials, the user doesn't exist or password doesn't match!" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid credentials, the user doesn't exist or password doesn't match!" });
		}

		req.session.user = { id: user.id };

		console.log("Login Success");

		res.status(200).json({ message: "Logged in" });
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Login failed. Please try again." });
	}
}

export function logoutUser(req: Request, res: Response) {
	req.session.destroy((err) => {
		if (err) {
			console.error("Session destroy error: ", err);
			return res.status(500).json({ error: "Error while trying to logout" });
		}

		res.clearCookie("connect.sid");
		res.status(200).json({ message: "Logged out" });
	});
}
