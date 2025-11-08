import express from "express";
import { productsRouter } from "./routes/products.router";
import { authRouter } from "./routes/auth.routes";

export const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api/products", productsRouter);

app.use("/api/auth", authRouter);
