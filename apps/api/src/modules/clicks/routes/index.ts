import { Router } from "express";
import {
  incrementClickController,
  incrementHomePageClicksController,
} from "../controllers";
import { asyncHandler } from "@/utils";

const router = Router();

router.post("/link/:link", asyncHandler(incrementClickController));
router.post("/home/:username", asyncHandler(incrementHomePageClicksController));
export default router;
