import { Router } from "express";
import catchAsync from "../@lib/catchAsync";
import InvoiceController from "../@controller/invoice";

const router = Router();

router.get("/get-my-invoices", catchAsync(InvoiceController.getMyInvoices));
router.get("/user/:_id", catchAsync(InvoiceController.getSingleInvoiceByUser));
router.get(
  "/admin/:_id",
  catchAsync(InvoiceController.getSingleInvoiceByAdmin)
);
router.get("/", catchAsync(InvoiceController.getAllInvoicesByAdmin));

export default router;
