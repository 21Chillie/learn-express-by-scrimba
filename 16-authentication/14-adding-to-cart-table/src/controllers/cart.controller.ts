import { Request, Response } from "express";
import { getDatabaseConnection } from "../database/schema/init.database";
import type { CartItemTypes } from "../types/cartItem.types";

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
