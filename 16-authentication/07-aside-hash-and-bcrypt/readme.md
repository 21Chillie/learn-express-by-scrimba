---
# Password Hashing with Bcrypt

Storing passwords as **plain text** is a critical security vulnerability.
If a database is breached, attackers immediately gain access to all user passwords — which are often reused across multiple sites.
Proper password storage requires **hashing and salting**, using a reliable algorithm like **bcrypt**.
---

## Why Plain Text Passwords Are Dangerous

- Exposes users’ personal data across multiple platforms (email, banking, social, etc.).

- Anyone with database access can read passwords.

- Violates data protection laws and industry best practices.

---

## What Is Hashing?

**Hashing** converts an input (e.g., a password) into a fixed-length string using a mathematical algorithm.
The result is **irreversible** — you cannot retrieve the original password from its hash.

Example:

```
Password: "orangejuice66"
Hash: "$2b$10$E6b1nB.2R2FOVJ9oeqV4pe7D9Jm4l6EKpsdDjB1b7xD2eIlPqf1zK"
```

The same input always produces the same hash for the same algorithm.

---

## The Problem with Simple Hashing

Hackers use **rainbow tables** — massive databases of precomputed hashes — to reverse-engineer common passwords.
If a hacker finds a matching hash in their table, they can discover the original password (e.g., `"Skywalker96"`).

Thus, storing only the hash is **not enough** protection.

---

## What Is Salting?

A **salt** is a random string added to the password **before hashing**.
This ensures that even if two users have the same password, their hashes are different.

Example Process:

```
Password: "orangejuice66"
Salt: "$2b$10$PpV5lA9..."
Hashed Result: "$2b$10$PpV5lA9...GxTu0hjfIfDk0WRlA5OCMEqZ4bV/EdV1btN26L9e"
```

The salt:

- Is unique per password.

- Defeats rainbow tables (no two hashes are the same).

- Increases computational difficulty for brute-force attacks.

---

## Why Use Bcrypt

**Bcrypt** is an industry-standard hashing library designed specifically for password storage.
It automatically:

- Generates a **unique salt** per password.

- Applies multiple hashing rounds (configurable “cost factor”).

- Produces a combined string that includes algorithm info, salt, and final hash.

---

## Example: Hashing Passwords in TypeScript

```ts
// src/utils/hashPassword.ts
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10; // Cost factor — higher = more secure, but slower

export async function hashPassword(password: string): Promise<string> {
	const salt = await bcrypt.genSalt(SALT_ROUNDS);
	const hashed = await bcrypt.hash(password, salt);
	return hashed;
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}
```

---

## Example Usage in a Controller

```ts
// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/hashPassword";

export async function registerUser(req: Request, res: Response) {
	const { password } = req.body;
	const hashedPassword = await hashPassword(password);

	// Store hashedPassword in the database
	res.status(201).json({ message: "User registered successfully", hashedPassword });
}

export async function loginUser(req: Request, res: Response) {
	const { password } = req.body;
	const storedHash = "retrieved-hash-from-db";

	const isMatch = await comparePassword(password, storedHash);
	if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

	res.status(200).json({ message: "Login successful" });
}
```

---

## Summary

- **Never store plain text passwords.**

- Use **bcrypt** to hash and salt passwords securely.

- Salting ensures unique hashes even for identical passwords.

- Increasing the **cost factor** strengthens security but increases CPU load.

- Combining bcrypt with **rate limiting** and **2FA** offers strong protection against brute-force and rainbow table attacks.

---
