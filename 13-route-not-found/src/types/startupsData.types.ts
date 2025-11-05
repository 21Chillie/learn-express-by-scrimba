type BusinessAddressTypes = {
	street: string;
	city: string;
	state: string;
};

type FoundersType = {
	name: string;
	role: string;
};

export type StartupTypes = {
	id: number;
	name: string;
	industry: string;
	founded: number;
	country: string;
	continent: string;
	business_address: BusinessAddressTypes;
	founders: FoundersType[];
	employees: number;
	website: string;
	mission_statement: string;
	description: string;
	is_seeking_funding: boolean;
	has_mvp: boolean;
};
