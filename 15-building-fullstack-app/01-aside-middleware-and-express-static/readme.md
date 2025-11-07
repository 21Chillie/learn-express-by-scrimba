## ⚙️ What is Middleware in Express?

**Middleware** in Express is essentially a **function that runs between the request and the response**.

You can think of it like a **checkpoint** that each request passes through on its way to your route handler.

### Middleware function signature:

```js
(req, res, next) => { ... }
```

Every middleware can:

- **Read or modify the request** (`req`)

- **Read or modify the response** (`res`)

- **Decide whether to continue** (`next()`)

---

### 🧭 Middleware Flow Visualization

When a request comes in, Express runs middleware **in order**:

```
Request → [Middleware 1] → [Middleware 2] → [Route Handler] → Response
```

Example:

```js
app.use((req, res, next) => {
	console.log(`Request method: ${req.method}, URL: ${req.url}`);
	next(); // move to the next middleware
});

app.get("/", (req, res) => {
	res.send("Hello, world!");
});
```

When you visit `/`, the console logs, then Express sends the response.

---

## 🧩 Types of Middleware

There are several types, but the main ones are:

| Type                  | Example                    | Purpose                           |
| --------------------- | -------------------------- | --------------------------------- |
| **Application-level** | `app.use(...)`             | Applies to the whole app          |
| **Router-level**      | `router.use(...)`          | Applies only to a specific router |
| **Built-in**          | `express.json()`           | Provided by Express itself        |
| **Third-party**       | `morgan`, `cors`, `helmet` | Installed via npm                 |
| **Error-handling**    | `(err, req, res, next)`    | Handles errors globally           |

---

## 🔍 Example of Common Built-in Middleware

### 1. `express.json()`

Parses incoming JSON payloads.

```js
app.use(express.json());
```

Now you can do:

```js
app.post("/user", (req, res) => {
	console.log(req.body); // parsed JSON object
});
```

### 2. `express.urlencoded()`

Parses URL-encoded data (like form submissions).

```js
app.use(express.urlencoded({ extended: true }));
```

### 3. `express.static()`

Serves **static files** (CSS, JS, images, etc.) directly.

---

## 🗂️ Express Static — Serving Public Files

Let’s focus on this because it’s often misunderstood.

When you use:

```js
app.use(express.static("public"));
```

You’re telling Express:

> “Anything in the `/public` folder can be accessed directly via the browser.”

Example project structure:

```
project/
 ├── public/
 │    ├── style.css
 │    ├── script.js
 │    └── images/
 │         └── logo.png
 ├── server.js
 └── views/
      └── index.ejs
```

Now:

- `http://localhost:3000/style.css` → serves `public/style.css`

- `http://localhost:3000/images/logo.png` → serves that image

---

### ✅ Combine it with EJS or HTML

If you use EJS:

```html
<link
	rel="stylesheet"
	href="/style.css" />
<script src="/script.js"></script>
```

No need to include `/public` in the path — Express automatically serves it from there.

---

### 📁 You Can Set a Mount Path

You can mount it under a prefix:

```js
app.use("/static", express.static("public"));
```

Now files are served from:

```
http://localhost:3000/static/style.css
```

---

## 💡 How Middleware and express.static Work Together

They’re all just middleware.
`express.static()` is actually a **built-in middleware** that intercepts requests for static files.

So your middleware order matters:

```js
// Logging middleware first
app.use((req, res, next) => {
	console.log("Middleware running");
	next();
});

// Then static middleware
app.use(express.static("public"));

// Then routes
app.get("/", (req, res) => res.send("Home Page"));
```

If a request matches a file in `/public`, Express sends it immediately — no route runs.
If not, it passes to the next middleware or route.

---

## ⚠️ Order Matters!

Express executes middleware **in the order they’re defined**.

Example:

```js
app.use(express.json());
app.use(express.static("public"));
app.use(authMiddleware);
app.use(routes);
```

If you put `authMiddleware` _before_ `express.static`,
then even static files would require authentication 😅.

So always order your middleware intentionally.

---

## 🧠 TL;DR Summary

| Concept                    | Description                                     |
| -------------------------- | ----------------------------------------------- |
| **Middleware**             | Functions that run between request and response |
| **`next()`**               | Passes control to the next middleware           |
| **`express.json()`**       | Parses JSON body                                |
| **`express.urlencoded()`** | Parses form data                                |
| **`express.static()`**     | Serves public files                             |
| **Order matters**          | Express runs them top to bottom                 |

---

If you want, next I can show:

- How to **create your own custom middleware** (e.g., for logging, auth, or error handling),

- and explain how **global vs route-specific middleware** differ.

Would you like to continue there next?
