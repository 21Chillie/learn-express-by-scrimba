import express from "express";
import { productsRouter } from "./routes/products.router";

export const app = express();
const PORT = 8000;

app.use(express.static("public"));

app.use("/api", productsRouter);
