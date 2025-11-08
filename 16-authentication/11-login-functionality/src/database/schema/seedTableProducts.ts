import { getDatabaseConnection } from "./init.database";
import { vinylData } from "../../data/vinyl.data";
import { VinylTypes } from "../../types/vinylData.types";

const insertVinylsData = (products: VinylTypes[]) => {
	const db = getDatabaseConnection();

	try {
		const insert = db.prepare(`
    INSERT INTO products (title, artist, price, image, year, genre, stock)
    VALUES (@title, @artist, @price, @image, @year, @genre, @stock)
    `);

		const insertMany = db.transaction((items) => {
			for (const item of items) {
				insert.run(item);
			}
		});

		insertMany(products);
		if (products.length > 0) {
			console.log(`Inserted ${products.length} vinyls data successfully`);

			const tables = db.prepare(`SELECT * FROM products`).all();

			console.table(tables);
		}
	} catch (error) {
		console.error(`Failed to insert vinyls data: `, error);
	} finally {
		db.close();
	}
};

insertVinylsData(vinylData);
