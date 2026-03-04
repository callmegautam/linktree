import { Router } from "express";
import authRoutes from "./auth/routes";
import analyticsRoutes from "./analytics/routes";
import usersRoutes from "./users/routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/users", usersRoutes);

export default router;
