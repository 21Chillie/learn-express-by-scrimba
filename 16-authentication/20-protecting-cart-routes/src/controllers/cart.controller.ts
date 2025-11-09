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
			SELECT c.id AS cartItemId, c.quantity, p.title, p.artist, p.price
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

export function deleteItem(req: Request<{ itemId: string }>, res: Response) {
	const db = getDatabaseConnection();
	console.log(req.params.itemId);
	const itemId = parseInt(req.params.itemId, 10);

	if (!req.session.user) {
		console.log("You have to logged in");
		return res.status(401).json({ error: "You have to logged in!" });
	}

	if (isNaN(itemId)) {
		console.log("Invalid item id ", itemId);
		return res.status(401).json({ error: "Invalid item ID" });
	}

	try {
		const itemExist = db
			.prepare(
				`
			SELECT * FROM cart_items
			WHERE id = ? AND user_id = ?
			`
			)
			.get(itemId, req.session.user.id) as CartItemTypes;

		if (!itemExist) {
			return res.status(404).json({ error: `Item not found` });
		}

		db.prepare(`DELETE FROM cart_items WHERE id = ?`).run(itemExist.id);

		res.status(204).end();
	} catch (err) {
		console.error("Delete item error: ", err);
		res.status(500).json({ error: "Failed while trying to delete item" });
	}
}

export function deleteAll(req: Request, res: Response) {
	const db = getDatabaseConnection();

	if (!req.session.user) {
		console.log("You have to logged in");
		return res.status(401).json({ error: "You have to logged in!" });
	}

	try {
		db.prepare(`DELETE FROM cart_items WHERE user_id = ?`).run(req.session.user.id);

		res.status(201).json({ message: `Delete all user item with id ${req.session.user.id}` });
	} catch (err) {
		console.error("Delete all item error: ", err);
		res.status(500).json({ error: "Failed while trying to delete all item" });
	}
}
