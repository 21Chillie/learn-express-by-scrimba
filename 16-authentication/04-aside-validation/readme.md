---

# Input Validation

This section introduces backend input validation for user data in an Express app.
Frontend validation improves **UX only** — it can be bypassed, so real validation must occur on the **backend**.

## Validation Goals

1. Ensure all required fields exist.

2. Trim whitespace from `name` and `username`.

3. Prevent duplicate usernames caused by trailing spaces.

4. Optionally normalize usernames (e.g., lowercase).

5. Use regex to restrict allowed characters in usernames.

6. Validate email format with the **validator** NPM package.

7. Never trim or alter passwords unless your policy explicitly disallows spaces.


---

## Why Trim Input

Trailing or leading spaces in usernames (e.g., `"marcus1 "` vs `"marcus1"`) can create duplicate records and login confusion.
Trimming ensures consistent data and reliable duplicate checks before saving to the database.

---

## The `validator` Package

[`validator`](https://www.npmjs.com/package/validator) is a lightweight NPM library for **string validation and sanitization**.
It provides dozens of helper methods such as:

- `isEmail(string)` — check if a string is a valid email format.

- `isURL(string)` — check for valid URLs.

- `isStrongPassword(string)` — test password strength.

- `isAlpha(string)` / `isAlphanumeric(string)` — allow only letters/numbers.

- `escape(string)` — prevent XSS by escaping HTML entities.

### Email Validation

The method `validator.isEmail(email: string): boolean` returns `true` if the input string matches the pattern of a valid email format.
It checks for the presence of:

- A local part (before `@`)

- A valid domain name (after `@`)

- A valid TLD (e.g., `.com`, `.org`, `.net`)

It **does not** confirm that the email address actually exists — only that it’s formatted correctly.

Install it:

```bash
npm install validator
```

Basic example:

```ts
import validator from "validator";

console.log(validator.isEmail("user@example.com")); // true
console.log(validator.isEmail("user@domain,com")); // false
```

---

## Example: Validation Utility (TypeScript)

```ts
// src/utils/validateUser.ts
import validator from "validator";

export interface UserInput {
	fullName: string;
	username: string;
	email: string;
	password: string;
}

export function validateUserInput(input: UserInput) {
	const errors: string[] = [];

	// 1. Check all fields exist
	if (!input.fullName || !input.username || !input.email || !input.password) {
		errors.push("All fields are required.");
	}

	// 2. Trim whitespace (not for password)
	const fullName = input.fullName.trim();
	const username = input.username.trim();
	const email = input.email.trim();

	// 3. Username rules (regex)
	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	if (!usernameRegex.test(username)) {
		errors.push("Username may only contain letters, numbers, and underscores.");
	}

	// 4. Validate email format using validator
	if (!validator.isEmail(email)) {
		errors.push("Invalid email format.");
	}

	// Return sanitized values + errors
	return {
		valid: errors.length === 0,
		errors,
		sanitized: {
			fullName,
			username: username.toLowerCase(), // optional normalization
			email: email.toLowerCase(),
			password: input.password,
		},
	};
}
```

---

## Example Usage

```ts
// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { validateUserInput } from "../utils/validateUser";

export function registerUser(req: Request, res: Response) {
	const { valid, errors, sanitized } = validateUserInput(req.body);

	if (!valid) {
		return res.status(400).json({ errors });
	}

	// Proceed with hashing password, checking duplicates, etc.
	res.status(200).json({ message: "Validation successful", user: sanitized });
}
```

---

## Summary

- Always perform validation **server-side**.

- Use **trim()**, **regex**, and **validator** to sanitize and verify input.

- `validator.isEmail()` ensures the email follows a valid structure but doesn’t confirm it exists.

- Normalize usernames and emails to prevent duplication issues.

- Keep passwords unmodified unless your policy states otherwise.

---
