import { Router } from "express";
import cartController from "../@controller/cart";
import catchAsync from "../@lib/catchAsync";

const router = Router();

router.post("/add", catchAsync(cartController.addtoCart));
router.get("/get", catchAsync(cartController.getCart))

export default router;
