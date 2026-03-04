import { Router } from "express";
import { changeUsername, getProfile, updateProfile, uploadAvatar } from "@/modules/profile/controllers";
import { authMiddleware } from "@/middlewares/auth";
import { asyncHandler } from "@/utils";
import { upload } from "@/utils/multer";

const router = Router();

router.get("/", authMiddleware, asyncHandler(getProfile));
router.patch("/", authMiddleware, asyncHandler(updateProfile));
router.patch("/change-username", authMiddleware, asyncHandler(changeUsername));
router.post("/upload-avatar", authMiddleware, upload.single('file'), asyncHandler(uploadAvatar))

export default router;