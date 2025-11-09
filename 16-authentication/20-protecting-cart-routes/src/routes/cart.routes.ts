import express from "express";
import { addToCart, deleteItem, getAll, getCartCount, deleteAll } from "../controllers/cart.controller";
import { requireAuth } from "../middleware/requireAuth";

export const cartRouter = express.Router();

cartRouter.post("/add", requireAuth, addToCart);

cartRouter.get("/cart-count", requireAuth, getCartCount);

cartRouter.get("/", requireAuth, getAll);

cartRouter.delete("/all", requireAuth, deleteAll);

cartRouter.delete("/:itemId", requireAuth, deleteItem);
