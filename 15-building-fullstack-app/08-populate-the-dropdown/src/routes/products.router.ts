import express from "express";
import { getProducts, getGenres } from "../controllers/products.controller";

export const productsRouter = express.Router();

productsRouter.get("/products", getProducts);

productsRouter.get("/products/genres", getGenres);
