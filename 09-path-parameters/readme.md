# Working with Path Parameters in Express

As our API grows, users will want more control over how they access data.
One common way to achieve this is through **path parameters** — dynamic parts of a URL that represent specific resources.

---

## What Are Path Parameters?

Path parameters let users request data for a specific resource directly in the URL path.

Example:

```http
/api/crypto/BTC
```

Here:

- `/api/crypto` → the base endpoint
- `BTC` → a dynamic value representing the cryptocurrency

You can define path parameters in Express using a colon (`:`).

---

## Example: Defining a Path Parameter

```js
import express from "express";
const app = express();

app.get("/api/crypto/:currency", (req, res) => {
	console.log(req.params);
	res.send("Check the console");
});
```

Request:

```curl
GET /api/crypto/ETH
```

Output:

```js
{
	currency: "ETH";
}
```

Express automatically captures the value after `:currency` and stores it inside `req.params`.

---

## Using Multiple Path Parameters

You can define multiple dynamic segments in a single route.

Example:

```js
app.get("/api/:category/:type", (req, res) => {
	console.log(req.params);
	res.json(req.params);
});
```

Request:

```curl
GET /api/crypto/ETH
GET /api/metals/gold
```

Output:

```js
{ category: "crypto", type: "ETH" }
{ category: "metals", type: "gold" }
```

This structure lets you handle different data types (e.g., cryptocurrencies, metals) using a single, flexible route.

---

Key Points

- Use a colon (:) to define a path parameter in Express.
- Access all path parameters through req.params.
- You can use multiple parameters in one route.
- Path parameters are ideal for fetching or modifying specific items by ID, name, or code.
