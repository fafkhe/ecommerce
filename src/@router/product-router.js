import { Router } from "express";
import productController from "../@controller/product";
import catchAsync from "../@lib/catchAsync";

const router = Router();


router.get("/", catchAsync(productController.getallProducts))
router.post("/create-product", catchAsync(productController.createProduct));
router.post("/:_id", catchAsync(productController.editProduct));
router.get("/all-product", catchAsync(productController.allProduct));
router.get("/:_id", catchAsync(productController.singleProduct));

export default router;
