import { Router } from "express";
import { asyncHandler } from "@/utils";
import { getAnalytics } from "../controllers";
import { adminAuthMiddleware } from "@/middlewares/auth";

const router: Router = Router();

router.get("/", adminAuthMiddleware, asyncHandler(getAnalytics));

export default router;
