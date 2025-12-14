import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import {
  listProducts,
  createProduct,
  increaseStock,
  decreaseStock,
  getProductSummary,
  getTransactions
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/products", asyncHandler(listProducts));
router.post("/products", asyncHandler(createProduct));
router.post("/products/:id/increase", asyncHandler(increaseStock));
router.post("/products/:id/decrease", asyncHandler(decreaseStock));
router.get("/products/:id", asyncHandler(getProductSummary));
router.get("/products/:id/transactions", asyncHandler(getTransactions));

export default router;