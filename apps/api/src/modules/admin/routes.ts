import { Router } from 'express';
import adminAuthRoutes from './auth/routes';

const router: Router = Router();

router.use('/auth', adminAuthRoutes);

export default router;