/*

Challenge:
1. Create a database and store its connection in a const 'db'.
      The database will live in a file called 'app.db' which can be in root.
      The database driver will be 'better-sqlite3.Database'.
2. Use the prepare() method to write SQL to create a table called 'products'. It should have the following columns:
      id (unique key)
      title (required, text)
      artist (required, text)
      price (required, floating-point number)
      image (required, text) (this is "text" because it will hold an image url)
      year (integer)
      genre (text)
      stock (integer)
3. Close the database connection and log a message to say table created.

When you are done, run createTable.ts to verify that it has worked.

*/

import { db } from "./init.database";

db.prepare(
	`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    stock INTEGER
  )
  `
).run();

db.close();

console.log("Table initialized");
