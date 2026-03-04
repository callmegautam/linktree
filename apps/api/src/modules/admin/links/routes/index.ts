import { Router } from "express";
import { adminAuthMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";
import { getAdminLinks, toggleLinkStatus, deleteLink } from "../controllers";

const router: Router = Router();

router.get("/", adminAuthMiddleware, asyncHandler(getAdminLinks));
router.put(
  "/:link/status/:status",
  adminAuthMiddleware,
  asyncHandler(toggleLinkStatus),
);
router.delete("/:link", adminAuthMiddleware, asyncHandler(deleteLink));

export default router;
