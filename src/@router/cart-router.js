import { Router } from "express";
import cartController from "../@controller/cart";
import catchAsync from "../@lib/catchAsync";

const router = Router();

router.post("/add", catchAsync(cartController.addtoCart));

export default router;
