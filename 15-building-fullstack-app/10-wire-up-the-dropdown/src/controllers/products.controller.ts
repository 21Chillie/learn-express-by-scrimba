import { Request, Response } from "express";
import { getDatabaseConnection } from "../database/init.database";
import { GenreRow } from "../types/productController.types";
import type { VinylTypes } from "../types/vinylData.types";

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

export function getProducts(req: Request<{}, {}, {}, { genre: string; search: string }>, res: Response) {
	const { genre, search } = req.query;
	let query = `SELECT * FROM products`;
	let params: unknown[] = [];

	try {
		const db = getDatabaseConnection();

		if (genre) {
			query += ` WHERE genre = ?`;
			params.push(genre);
		}

		const products = db.prepare(query).all(params) as VinylTypes[];

		res.status(200).json(products);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch products" });
	}
}
