# Graceful 404 Handling in Express

Handle unsupported routes with a clear, user-friendly JSON response instead of Express’s default HTML 404.

## Goal

When a client requests a route that doesn’t exist (e.g., `/ai/planets` instead of `/api/planets`), respond with:

```json
{
	"error": "Endpoint not found. Please check the API documentation."
}
```

## Implementation

Place a **fallback route handler** at the **end** of your route definitions in `server.js`:

### `server.js`

```js
const express = require("express");
const app = express();

// Mount API routes
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

// 404 fallback: must be AFTER all routes
app.use((req, res) => {
	res.status(404).json({
		error: "Endpoint not found. Please check the API documentation.",
	});
});

app.listen(3000);
```

## Key Rules

- The fallback `app.use()` **must come after** all defined routes and middleware.
- It acts as a catch-all: if no route matches, this handler runs.
- Do **not** include a path (e.g., `app.use('/api', ...)`); an empty path catches **all unmatched requests**.

## Why Order Matters

Express evaluates middleware and routes **top to bottom**. If the 404 handler is placed too early, it will intercept all requests—even valid ones—before they reach the correct route.

✅ Correct order:

1. Define routes (`app.use('/api', apiRoutes)`)
2. Fallback 404 handler (`app.use((req, res) => {...})`)

❌ Incorrect order:
404 handler before routes → all requests return 404.
