import { Router } from "express";
import catchAsync from "../@lib/catchAsync";
import InvoiceController from "../@controller/invoice";

const router = Router();

router.get("/get-my-invoices", catchAsync(InvoiceController.getMyInvoices));

router.get("/", catchAsync(InvoiceController.getAllInvoicesByAdmin));
router.get("/:_id", catchAsync(InvoiceController.getSingleInvoice));
router.post("/box", catchAsync(InvoiceController.boxOrder));
router.post("/delivered", catchAsync(InvoiceController.deliveredOrder));

export default router;
