import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const sessionConfig: session.SessionOptions = {
	secret: process.env.SESSION_SECRET || "super-secret-key",
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	},
};

export default sessionConfig;
