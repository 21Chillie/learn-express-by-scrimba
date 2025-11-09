import { Request, Response } from "express";
import { getDatabaseConnection } from "../database/schema/init.database";
import type { CartItemTypes, TotalCartItemsTypes, AllItemListsTypes } from "../types/cartItem.types";

export function addToCart(req: Request, res: Response) {
	const db = getDatabaseConnection();

	const productId = parseInt(req.body.productId);

	if (!req.session.user) {
		console.log("You have to logged in");
		return res.status(401).json({ error: "You have to logged in!" });
	}

	if (isNaN(productId)) {
		console.log("Product id required");
		return res.status(401).json({ error: "Invalid product id" });
	}

	try {
		const existingProduct = db
			.prepare(
				`
        SELECT * FROM cart_items WHERE product_id = ? AND user_id = ?
        `
			)
			.get(productId, req.session.user.id) as CartItemTypes;

		if (existingProduct) {
			db.prepare(
				`
        UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?
        `
			).run(existingProduct.id);
		} else {
			db.prepare(
				`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, 1)
      `
			).run(req.session.user.id, productId);
		}

		res.status(200).json({ message: "Added to cart" });
	} catch (err) {
		console.error("Add to cart error:", err);
		return res.status(500).json({ error: "Failed to add to cart" });
	}
}

/*
Challenge:

1. When a logged-in user clicks the cart icon, they will be redirected to the cart.html page. To render the user's cart, the frontend needs to get an array of objects similar to the example below when it makes a GET request to the /api/cart endpoint. Important: this array should be sent in a JSON object with the key 'items'.

[
  {
    cartItemId: 4,
    quantity: 2,
    title: 'Selling Dogma',
    artist: 'The Clouds',
    price: 44.99
  },
  {
    cartItemId: 5,
    quantity: 1,
    title: 'Midnight Parallels',
    artist: 'Neon Grove',
    price: 40.99
  }
]

The frontend JS has been done for you.

Ignore frontend console errors for now!

For testing, log in with:
Username: test
Password: test

Then click the cart icon to go to the cart page. You should see the user’s items.

Loads of help in hint.md
*/

export function getCartCount(req: Request, res: Response) {
	const db = getDatabaseConnection();

	if (!req.session.user) {
		console.log("You have to logged in");
		return res.status(401).json({ error: "You have to logged in!" });
	}

	try {
		const result = db
			.prepare(
				`
			SELECT SUM(quantity) as total_quantity FROM cart_items
			WHERE user_id = ?
			`
			)
			.get(req.session.user.id) as TotalCartItemsTypes;

		let totalItems = result.total_quantity ?? 0;

		console.log("User cart items: ", totalItems);

		res.status(200).json({ totalItems });
	} catch (err) {
		console.error("Get total cart items error:", err);
		return res.status(500).json({ error: "Failed to get total cart items" });
	}
}

export async function getAll(req: Request, res: Response) {
	const db = getDatabaseConnection();

	// Don't touch this code!
	if (!req.session.user) {
		return res.json({ err: "not logged in" });
	}

	try {
		const getAllItems = db
			.prepare(
				`
			SELECT c.id, c.quantity, p.title, p.artist, p.price
			FROM cart_items AS c
			JOIN products AS p
				ON c.product_id = p.id
			WHERE c.user_id = ?
			`
			)
			.all(req.session.user.id) as AllItemListsTypes[];

		res.status(200).json({ items: getAllItems });
	} catch (err) {
		console.error("Get user cart error:", err);
		res.status(500).json({ error: "Failed to fetch cart items" });
	}
}
