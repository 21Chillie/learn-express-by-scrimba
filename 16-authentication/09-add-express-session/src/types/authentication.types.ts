export type UserSignUpType = {
	name: string;
	email: string;
	username: string;
	password: string;
};

export type ExistingUserType = {
	email: string;
	username: string;
};

export type NewUserType = {
	id: number;
	email: string;
	username: string;
};
