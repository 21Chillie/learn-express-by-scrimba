import express from "express";
import { productsRouter } from "./routes/products.route";
import { authRouter } from "./routes/auth.routes";
import { meRouter } from "./routes/me.route";
import { cartRouter } from "./routes/cart.routes";
import session from "express-session";
import sessionConfig from "./config/session.config";

export const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(express.static("public"));

// Routes
app.use("/api/products", productsRouter);

app.use("/api/auth/me", meRouter);

app.use("/api/auth", authRouter);

app.use("/api/cart", cartRouter);
