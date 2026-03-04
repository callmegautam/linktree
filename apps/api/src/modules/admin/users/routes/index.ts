import { Router } from "express";
import { getAdminUsers, toggleUserStatus } from "../controllers";
import { adminAuthMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";

const router = Router();

router.get("/", adminAuthMiddleware, asyncHandler(getAdminUsers));
router.put(
  "/:user/status/:status",
  adminAuthMiddleware,
  asyncHandler(toggleUserStatus),
);

export default router;
