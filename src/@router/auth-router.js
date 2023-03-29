import { Router } from "express";
import aufController from "../@controller/auth";
import catchAsync from "../@lib/server/catchAsync";

const router = Router();

router.post("/signup", catchAsync(aufController.signUp));


export default router;
