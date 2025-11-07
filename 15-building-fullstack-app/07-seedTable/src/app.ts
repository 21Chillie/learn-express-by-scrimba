import express from "express";
import { productRouter } from "./routes/products.router";

export const app = express();
const PORT = 8000;

app.use(express.static("public"));

app.use("/api", productRouter);
