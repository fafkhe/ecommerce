import addressController from "../@controller/adress";
import { Router } from "express";
import catchAsync from "../@lib/catchAsync";

const router = Router();

router.post("/", catchAsync(addressController.addAdress));
router.get("/", catchAsync(addressController.getMyAddresses));
router.delete("/", catchAsync(addressController.deleteMyAddress));


export default router;
