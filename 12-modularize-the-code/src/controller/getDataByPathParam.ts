import { startups } from "../data/startups.data";
import type { StartupTypes } from "../types/startupsData.types";
import type { Request, Response } from "express";
import type { PathParamTypes } from "../types/filterPathParams.types";

const getDataByPathParams = (req: Request<PathParamTypes>, res: Response) => {
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
};

export default getDataByPathParams;
