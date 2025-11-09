import { getDatabaseConnection } from "./init.database";

function createTableCartItems() {
	const db = getDatabaseConnection();

	db.prepare(
		`
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
  `
	).run();
	console.log("Table 'cart_items' initialized");
}

createTableCartItems();
