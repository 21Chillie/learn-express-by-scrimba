import express from "express";
import { addToCart, getAll, getCartCount } from "../controllers/cart.controller";

export const cartRouter = express.Router();

cartRouter.post("/add", addToCart);

cartRouter.get("/cart-count", getCartCount);

cartRouter.get("/", getAll);
