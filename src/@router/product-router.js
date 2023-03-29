import { Router } from "express";
import productController from "../@controller/product";
import catchAsync from "../@lib/catchAsync";

const router = Router();

router.post("/create-product", catchAsync(productController.createProduct));

export default router;
