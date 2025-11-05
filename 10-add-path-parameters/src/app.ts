import express from "express";
import type { Request, Response } from "express";

import { startups } from "./data/startups.data";
import { QueryParamTypes } from "./types/filterQuery.types";
import { StartupTypes } from "./types/startupsData.types";
import { PathParamTypes } from "./types/filterPathParams.types";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
	res.send("Hello World");
});

app.get("/api", (req: Request<{}, {}, {}, Partial<QueryParamTypes>>, res: Response): void => {
	const { industry, country, continent, is_seeking_funding, has_mvp } = req.query;

	let filteredData: StartupTypes[] = startups;

	if (industry) {
		filteredData = filteredData.filter((item) => item.industry.toLowerCase() === industry.toLowerCase());
	}

	if (country) {
		filteredData = filteredData.filter((item) => item.country.toLowerCase() === country.toLowerCase());
	}

	if (continent) {
		filteredData = filteredData.filter((item) => item.continent.toLowerCase() === continent.toLowerCase());
	}

	if (is_seeking_funding) {
		filteredData = filteredData.filter((item) => item.is_seeking_funding === JSON.parse(is_seeking_funding.toLocaleLowerCase()));
	}

	if (has_mvp) {
		filteredData = filteredData.filter((item) => item.has_mvp === JSON.parse(has_mvp.toLocaleLowerCase()));
	}

	res.status(200).json(filteredData);
});

app.get("/api/:field/:term", (req: Request<PathParamTypes>, res: Response) => {
	const { field, term } = req.params;
	const allowedFields = ["country", "continent", "industry"];

	let filterPathParams = startups;

	if (!allowedFields.includes(field)) {
		return res.status(400).json({ error: "Only country, continent, and industry are supported" });
	}

	filterPathParams = filterPathParams.filter((item) => {
		const value = item[field as keyof StartupTypes] as string;
		return value.toLowerCase() === term.toLowerCase();
	});

	res.status(200).json(filterPathParams);
});

export default app;
