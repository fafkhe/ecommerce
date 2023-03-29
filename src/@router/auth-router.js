import { Router } from "express";
import authController from "../@controller/auth";
import catchAsync from "../@lib/catchAsync";

const router = Router();

router.post("/signup", catchAsync(authController.signUp));
router.post("/login", catchAsync(authController.login));
router.post("/create-admin",catchAsync(authController.createAdmin))
router.get("/me", catchAsync(authController.me));
router.get("/admin-me", catchAsync(authController.adminMe))


export default router;
