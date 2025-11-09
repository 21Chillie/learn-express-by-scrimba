import { Request, Response } from "express";
import { getDatabaseConnection } from "../database/schema/init.database";
import type { CartItemTypes, TotalCartItems } from "../types/cartItem.types";

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

1. Write code to ensure that when a logged-in user clicks 'Add to Cart', their current cart count is shown in the header with a cart icon. The frontend has been done for you. All the backend need do is provide the following JSON on the /api/cart/cart-count endpoint:
{ <THE TOTAL NUMBER OF THE USER'S ITEMS> || 0 }

Ignore frontend console errors for now!

For testing, log in with:
Username: test
Password: test

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
			.get(req.session.user.id) as TotalCartItems;

		let totalItems = result.total_quantity ?? 0;

		console.log("User cart items: ", totalItems);

		res.status(200).json({ totalItems });
	} catch (err) {
		console.error("Get total cart items error:", err);
		return res.status(500).json({ error: "Failed to get total cart items" });
	}
}
