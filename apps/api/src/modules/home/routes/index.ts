import { Router } from "express";
import { getHomePage } from "../controllers";
import { asyncHandler } from "@/utils";

const router = Router();

router.get("/:username", asyncHandler(getHomePage));

export default router;
