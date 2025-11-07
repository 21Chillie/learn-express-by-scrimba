import { Request, Response } from "express";
import { getDatabaseConnection } from "../database/init.database";
import { GenreRow } from "../types/productController.types";

export function getGenres(req: Request, res: Response) {
	try {
		const db = getDatabaseConnection();

		const rows = db.prepare(`SELECT DISTINCT genre FROM products`).all() as GenreRow[];

		const genres: string[] = rows.map((row) => row.genre);

		console.log(genres);

		res.status(200).json(genres);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch genres" });
	}
}

export function getProducts(req: Request, res: Response) {
	try {
		const db = getDatabaseConnection();

		const products = db.prepare(`SELECT * FROM products`).all();

		console.log(products);

		res.status(200).json(products);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch products" });
	}
}
