/*
  Challenge:
  1. Take the data 'vinyl' imported from data.js and add it to our database.
     The keys in the objects align with the columns in our database.
     The 'id' column in the database will self-populate - you do not need to do anything.

  2. If something goes wrong, rollback the process so no data is added.

  3. Run seedTable.js and then logTable.js to check.

    hint.md for help!
  */

import { db } from "./init.database";
import { vinylData } from "../data/vinyl.data";
import { VinylTypes } from "../types/vinylData.types";

const insertVinylsData = (products: VinylTypes[]) => {
	const insert = db.prepare(`
    INSERT INTO products (title, artist, price, image, year, genre, stock)
    VALUES (@title, @artist, @price, @image, @year, @genre, @stock)
    `);

	const insertMany = db.transaction((items) => {
		for (const item of items) {
			insert.run(item);
		}
	});

	try {
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
