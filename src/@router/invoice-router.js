import { Router } from "express";
import catchAsync from "../@lib/catchAsync";
import InvoiceController from "../@controller/invoice";

const router = Router();

router.get("/get-my-invoices", catchAsync(InvoiceController.getMyInvoices));

router.get("/", catchAsync(InvoiceController.getAllInvoicesByAdmin));
router.get("/:_id", catchAsync(InvoiceController.getSingleInvoice));

export default router;
