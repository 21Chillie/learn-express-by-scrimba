import express from "express";
import { addToCart, deleteItem, getAll, getCartCount, deleteAll } from "../controllers/cart.controller";

export const cartRouter = express.Router();

cartRouter.post("/add", addToCart);

cartRouter.get("/cart-count", getCartCount);

cartRouter.get("/", getAll);

cartRouter.delete("/all", deleteAll);

cartRouter.delete("/:itemId", deleteItem);
