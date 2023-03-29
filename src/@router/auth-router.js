import { Router } from "express";
import authController from "../@controller/auth";
import catchAsync from "../@lib/server/catchAsync";

const router = Router();

router.post("/signup", catchAsync(authController.signUp));
router.post("/login", catchAsync(authController.login));
router.get("/me", catchAsync(authController.me));

export default router;
