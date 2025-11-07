If you’re using **`better-sqlite3`** with **TypeScript + Express**, you don’t need to memorize everything, but you _should_ understand the core APIs and patterns, because it’s a **synchronous**, high-performance wrapper around SQLite.

Let’s go through **the essential methods you’ll actually use**, organized by category, with examples and best practices.

---

## 🧱 1. Creating / Connecting to the Database

### **`new Database(filename, options?)`**

Opens (or creates) a SQLite database file.

```ts
import Database from "better-sqlite3";

const db = new Database("database.db", { verbose: console.log }); // optional debug log
```

**Tips:**

- The connection is **synchronous** (no async/await).

- You can call it once and reuse the same instance throughout your app.

---

## 🧾 2. Preparing SQL Statements

### **`db.prepare(sql)`**

Creates a reusable, precompiled SQL statement.

```ts
const stmt = db.prepare("INSERT INTO products (title, price) VALUES (?, ?)");
```

This returns a `Statement` object that can run multiple times efficiently.

---

## ⚙️ 3. Executing Queries

### **`stmt.run(...params)`**

Runs an SQL statement that doesn’t return rows (like `INSERT`, `UPDATE`, or `DELETE`).

```ts
const insert = db.prepare("INSERT INTO products (title, price) VALUES (?, ?)");
const info = insert.run("Coffee", 3.5);

console.log(info.lastInsertRowid); // new row ID
console.log(info.changes); // number of rows affected
```

🧠 **Returns an object**:

```ts
{
	changes: number;
	lastInsertRowid: number | bigint;
}
```

---

### **`stmt.get(...params)`**

Fetches **one** row from the result set.

```ts
const selectOne = db.prepare("SELECT * FROM products WHERE id = ?");
const product = selectOne.get(1);
console.log(product?.title);
```

---

### **`stmt.all(...params)`**

Fetches **all rows** as an array.

```ts
const selectAll = db.prepare("SELECT * FROM products");
const products = selectAll.all();
console.log(products.length);
```

---

### **`stmt.iterate(...params)`**

Returns an **iterator** (great for large datasets).

```ts
const rows = db.prepare("SELECT * FROM products").iterate();
for (const row of rows) {
	console.log(row.title);
}
```

> ⚡ Use `.iterate()` if you’re looping over a huge table to avoid high memory usage.

---

## 🔁 4. Transactions (for safety)

### **`db.transaction(fn)`**

Runs multiple statements atomically (all succeed or all fail).

```ts
const insertProduct = db.prepare(`
  INSERT INTO products (title, artist, price, image, year, genre, stock)
  VALUES (@title, @artist, @price, @image, @year, @genre, @stock)
`);

const insertMany = db.transaction((products) => {
	for (const product of products) insertProduct.run(product);
});

insertMany([
	{ title: "Album A", artist: "Artist 1", price: 9.99, image: "...", year: 2020, genre: "Pop", stock: 10 },
	{ title: "Album B", artist: "Artist 2", price: 12.5, image: "...", year: 2022, genre: "Rock", stock: 15 },
]);
```

✅ This ensures all inserts either **commit or rollback** if one fails.

---

## 🧩 5. Database-Level Utilities

### **`db.pragma(sql)`**

Run a PRAGMA statement (configure or inspect SQLite internals).

```ts
console.log(db.pragma("journal_mode")); // view current journal mode
db.pragma("foreign_keys = ON"); // enable foreign key constraints
```

---

### **`db.exec(sql)`**

Run a batch of SQL statements (not parameterized).

```ts
db.exec(`
  CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT);
  CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY, title TEXT);
`);
```

⚠️ Don’t use this for user input — it can’t be parameterized (risk of SQL injection).

---

### **`db.close()`**

Closes the database connection.

```ts
db.close();
```

---

## 📘 6. Debugging & Schema Inspection

### **`sqlite_master` table**

Query to list tables:

```ts
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables);
```

Query to show SQL schema:

```ts
const schema = db.prepare("SELECT sql FROM sqlite_master WHERE name='products'").get();
console.log(schema.sql);
```

---

## 💡 7. Best Practices for Express + TypeScript

✅ **Centralize your DB instance**
Create one file (e.g. `src/database/index.ts`):

```ts
import Database from "better-sqlite3";
const db = new Database("database.db");
export default db;
```

✅ **Use prepared statements or transactions**
Avoid raw `.exec()` for any dynamic input.

✅ **Map results to TypeScript interfaces**

```ts
interface Product {
	id: number;
	title: string;
	price: number;
}
const products = db.prepare("SELECT * FROM products").all() as Product[];
```

✅ **Enable foreign keys and performance tuning**

```ts
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL"); // better concurrency
```

---

## 🧠 Summary Table

| Method                    | Purpose                      | Returns                        |
| ------------------------- | ---------------------------- | ------------------------------ |
| `db.prepare(sql)`         | Create precompiled statement | `Statement`                    |
| `stmt.run(...params)`     | Execute (no rows)            | `{ changes, lastInsertRowid }` |
| `stmt.get(...params)`     | Get one row                  | Object or undefined            |
| `stmt.all(...params)`     | Get all rows                 | Array of objects               |
| `stmt.iterate(...params)` | Stream large results         | Iterator                       |
| `db.transaction(fn)`      | Group operations             | Wrapped function               |
| `db.exec(sql)`            | Execute raw SQL batch        | void                           |
| `db.pragma(sql)`          | Get/set DB settings          | any                            |
| `db.close()`              | Close database               | void                           |

---

Would you like me to show a **real Express + TypeScript service layer example** using these `better-sqlite3` methods properly (CRUD operations with best practices)?
