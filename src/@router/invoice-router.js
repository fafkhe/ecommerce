import { Router } from "express";
import catchAsync from "../@lib/catchAsync";
import InvoiceController from "../@controller/invoice";

const router = Router();

router.get("/", catchAsync(InvoiceController.getMyInvoices));
router.get("/user/:_id", catchAsync(InvoiceController.getSingleInvoiceByUser));

export default router;
