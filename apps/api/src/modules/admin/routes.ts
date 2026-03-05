import { Router } from "express";
import authRoutes from "./auth/routes";
import analyticsRoutes from "./analytics/routes";
import usersRoutes from "./users/routes";
import linksRoutes from "./links/routes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/users", usersRoutes);
router.use("/links", linksRoutes);

export default router;
