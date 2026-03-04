import { Router } from 'express';
import { asyncHandler } from '@/utils';
import { adminLogin, adminRegister } from '@/modules/admin/auth/controllers';

const router: Router = Router();

router.post('/login', asyncHandler(adminLogin));
router.post('/register', asyncHandler(adminRegister));

export default router;