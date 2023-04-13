import { Router } from "express";
import cartController from "../@controller/cart";
import catchAsync from "../@lib/catchAsync";

const router = Router();

router.get("/", catchAsync(cartController.getCart));
router.post("/", catchAsync(cartController.addtoCart));
router.patch("/", catchAsync(cartController.changeTheQuantity));
router.delete("/", catchAsync(cartController.removeProduct));

export default router;
