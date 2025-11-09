# Middleware and Route Protection in Express

## Overview

Middleware functions in Express allow you to **intercept requests** and perform actions before they reach the route handler.
They can be used for tasks like logging, authentication, validation, or error handling.

## In this section, we focus on **protecting sensitive routes** (e.g., user data, cart) and **logging login attempts** using middleware.

## The Security Issue

HTTP requests can be made to any route — even by unauthenticated users.
If routes directly access user data (e.g., `req.session.userId`), they can expose sensitive information when sessions are missing or invalid.

Example of a security flaw:

```js
db.prepare("SELECT * FROM cart_items WHERE user_id = ?").all(req.session.userId || 9);
```

If `req.session.userId` is `undefined`, the fallback (`9`) exposes data belonging to another user.

To prevent this, sensitive routes should only be accessible to **authenticated users**.

---

## Middleware Concept

A middleware is a function that receives three arguments:

```js
(req, res, next) => { ... }
```

- **req** — the incoming request object

- **res** — the outgoing response object

- **next** — a callback that passes control to the next middleware or route handler

Middlewares can be **global** (applied app-wide) or **route-specific** (applied to selected routes).

---

## Example 1: Logging Middleware

A simple middleware that logs every login attempt.

### `middleware/logSignIn.js`

```js
export function logSignIn(req, res, next) {
	console.log(`Sign-in attempt for username: ${req.body.username}`);
	next(); // pass control to the next handler
}
```

### Usage in Route

```js
import express from "express";
import { logSignIn } from "./middleware/logSignIn.js";

const router = express.Router();

router.post("/login", logSignIn, (req, res) => {
	// Handle user authentication
	const { username, password } = req.body;
	// ... authentication logic
	res.send("Sign-in attempted");
});

export default router;
```

Now every sign-in request passes through `logSignIn` before hitting the main `/login` logic.

---

## Example 2: Auth Protection Middleware

A middleware that ensures only authenticated users can access certain routes.

### `middleware/requireAuth.js`

```js
export function requireAuth(req, res, next) {
	if (!req.session.userId) {
		return res.status(403).json({ error: "Access denied. Please log in first." });
	}
	next();
}
```

### Usage in Route

```js
import express from "express";
import { requireAuth } from "./middleware/requireAuth.js";

const router = express.Router();

router.get("/cart", requireAuth, (req, res) => {
	const userId = req.session.userId;
	// Fetch cart items for this user
	const cartItems = db.prepare("SELECT * FROM cart_items WHERE user_id = ?").all(userId);
	res.json(cartItems);
});

export default router;
```

This ensures that:

- Only logged-in users (with `req.session.userId`) can access `/cart`.

- Unauthorized users receive a `403 Forbidden` response.

---

## Best Practices

- **Apply middleware selectively** to sensitive routes instead of globally.

- **Never trust client input** — always validate and check authentication serverside.

- **Do not fallback to hardcoded values** when sessions are missing.

- **Structure middleware logically** in a `/middleware` folder for clarity.

- **Combine with express-session** for user session persistence.

---

## Summary

| Concept            | Description                                     |
| ------------------ | ----------------------------------------------- |
| Middleware         | Functions that run before the route handler     |
| Route Protection   | Restrict access to authenticated users only     |
| Logging Middleware | Useful for tracking sign-in attempts            |
| Good Practice      | Use middleware selectively and organize cleanly |

By combining **route-specific middleware** with **Express Session**, you ensure your application handles user data securely and predictably.

---

### References

- [Express Middleware Docs](https://expressjs.com/en/guide/using-middleware.html)

- [Express Session](https://expressjs.com/en/resources/middleware/session.html)

---
