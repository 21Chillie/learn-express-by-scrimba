import express from "express";
import { addToCart } from "../controllers/cart.controller";

export  const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
