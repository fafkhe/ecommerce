import { Router } from "express";
import catchAsync from "../@lib/catchAsync";
import InvoiceController from "../@controller/invoice";

const router = Router();

router.post("/", catchAsync(InvoiceController.checkout));

export default router;
