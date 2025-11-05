import { startups } from "../data/startups.data";
import type { Request, Response } from "express";
import type { StartupTypes } from "../types/startupsData.types";
import type { QueryParamTypes } from "../types/filterQuery.types";

const getAllData = (req: Request<{}, {}, {}, Partial<QueryParamTypes>>, res: Response): void => {
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
};

export default getAllData;
