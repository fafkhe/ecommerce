import { Router } from "express";
import catchAsync from "../@lib/catchAsync";
import InvoiceController from "../@controller/invoice";

const router = Router();

router.get("/", catchAsync(InvoiceController.getMyInvoices));

export default router;
