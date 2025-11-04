# The `req` Object Overview

The `req` (request) object in Express provides extensive information about the incoming request.
Some useful properties include:

| Property     | Description                                 |
| ------------ | ------------------------------------------- |
| `req.body`   | Holds data sent in the request body         |
| `req.params` | Holds route parameters (e.g., `/api/:id`)   |
| `req.method` | HTTP method (`GET`, `POST`, `DELETE`, etc.) |
| `req.ip`     | Client’s IP address                         |
| `req.query`  | Object containing the query parameters      |

For now will focus on `req.params`.

---

## Working with Query Parameters in Express

Query parameters are a powerful way for clients to send additional data to your API through the URL.
They’re often used for **filtering**, **searching**, or **customizing** responses without changing the endpoint.

---

## Example: Query Parameters in URLs

A query parameter starts after a `?` in the URL and uses `&` to separate multiple key-value pairs.

```http
/api?category=tech&limit=10&sort=asc
```

In this example:

- `category` → `"tech"`
- `limit` → `"10"`
- `sort` → `"asc"`

---

## Accessing Query Parameters in Express

Express automatically parses these parameters and stores them in `req.query` as an object.

```js
app.get("/api", (req, res) => {
	console.log(req.query);
	res.send("Query received");
});
```

Request:

```curl
GET /api?course=express&level=beginner
```

Output:

```js
{ course: "express", level: "beginner" }
```

---

## Using Query Parameters for Filtering

You can use `req.query` to filter your data dynamically.

```ts
import express from "express";
import data from "./data.js";

const app = express();

app.get("/api/pets", (req, res) => {
	const { type, isAdopted } = req.query;

	let results = data;

	if (type) results = results.filter((pet) => pet.type === type);
	if (isAdopted) results = results.filter((pet) => pet.isAdopted === (isAdopted === "true"));

	res.json(results);
});
```

Request example:

```curl
GET /api/pets?type=dog&isAdopted=false
```

---

## Key Takeaways

- Query parameters come after a ? and are separated by &.
- Express automatically parses them into the req.query object.
- All values are strings by default — convert them when needed.
- Use query parameters for filtering, sorting, and fine-tuning API results.
