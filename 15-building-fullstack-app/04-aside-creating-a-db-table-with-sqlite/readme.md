## ⚙️ Step-by-Step: Setup SQLite with TypeScript + Express

### 🧩 1. Install dependencies

Run this in your project root:

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3
```

> `@types/better-sqlite3` provides TypeScript type definitions.

---

### 🗂️ 2. Project structure (recommended)

```
src/
├─ app.ts
├─ routes/
│  └─ users.ts
├─ database/
│  ├─ database.ts
│  └─ init.ts
├─ services/
│  └─ userService.ts
└─ types/
   └─ user.ts
```

This modular structure is clean and production-friendly.

---

### 🧱 3. Configure SQLite connection

**File:** `src/database/database.ts`

```ts
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// ES module-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite
const db = new Database(path.join(__dirname, "app.db"));
db.pragma("foreign_keys = ON"); // enable foreign keys

export default db;
```

**Explanation**

- Creates or opens `app.db` inside `/src/database`.

- Enables SQLite foreign keys (recommended).

- Exports the `db` instance so it can be reused across services.

---

### 🧩 4. Initialize database schema

**File:** `src/database/init.ts`

```ts
import db from "./database.js";

db.prepare(
	`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

console.log("✅ Database initialized.");
```

Run once to initialize your database:

```bash
npx tsx src/database/init.ts
```

> (or use `ts-node` if you prefer: `npx ts-node src/database/init.ts`)

---

### 🧠 5. Create a type definition for users

**File:** `src/types/user.ts`

```ts
export interface User {
	id?: number;
	name: string;
	email: string;
	created_at?: string;
}
```

---

### 🧩 6. Create a service for user operations

**File:** `src/services/userService.ts`

```ts
import db from "../database/database.js";
import { User } from "../types/user.js";

export class UserService {
	static getAll(): User[] {
		const stmt = db.prepare("SELECT * FROM users ORDER BY id DESC");
		return stmt.all() as User[];
	}

	static getById(id: number): User | undefined {
		const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
		return stmt.get(id) as User | undefined;
	}

	static create(user: Omit<User, "id" | "created_at">): number {
		const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
		const info = stmt.run(user.name, user.email);
		return info.lastInsertRowid as number;
	}

	static delete(id: number): void {
		const stmt = db.prepare("DELETE FROM users WHERE id = ?");
		stmt.run(id);
	}
}
```

**Why a service layer?**

- Keeps your routes clean.

- Encapsulates database logic.

- Easier to test and refactor later.

---

### 🧭 7. Create Express routes

**File:** `src/routes/users.ts`

```ts
import express, { Request, Response } from "express";
import { UserService } from "../services/userService.js";

const router = express.Router();

// GET /users
router.get("/", (_req: Request, res: Response) => {
	const users = UserService.getAll();
	res.json(users);
});

// POST /users
router.post("/", (req: Request, res: Response) => {
	const { name, email } = req.body;
	if (!name || !email) {
		return res.status(400).json({ error: "Name and email are required" });
	}

	const id = UserService.create({ name, email });
	const user = UserService.getById(id);
	res.status(201).json(user);
});

// DELETE /users/:id
router.delete("/:id", (req: Request, res: Response) => {
	const id = Number(req.params.id);
	UserService.delete(id);
	res.status(204).send();
});

export default router;
```

---

### 🚀 8. Setup main Express app

**File:** `src/app.ts`

```ts
import express from "express";
import usersRouter from "./routes/users.js";

const app = express();

app.use(express.json());
app.use("/users", usersRouter);

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

Run with:

```bash
npx tsx src/app.ts
```

---

### ✅ 9. Test endpoints

Using `curl`, Postman, or Hoppscotch:

**Create user**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Resky","email":"resky@example.com"}'
```

**List users**

```bash
curl http://localhost:3000/users
```

---

### 💡 Best Practice Summary

| Area           | Practice                        | Benefit                                 |
| -------------- | ------------------------------- | --------------------------------------- |
| DB Driver      | `better-sqlite3`                | Simpler & faster than async wrappers    |
| Layering       | Service layer pattern           | Clean separation between routes & logic |
| Typing         | `User` interface                | Type-safe database operations           |
| Imports        | ES modules (`"type": "module"`) | Modern syntax                           |
| Error handling | Return 400 for invalid input    | Consistent API responses                |
| Initialization | Separate `init.ts` file         | Easy schema maintenance                 |

---

Would you like me to extend this by adding **TypeScript validation** (e.g., with Zod or class-validator) for request bodies, or integrate a **query builder/ORM** like **Drizzle ORM** for even cleaner database typing?
