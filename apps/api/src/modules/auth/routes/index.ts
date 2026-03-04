import { Router } from 'express';
import { asyncHandler } from '../../../utils';
import { deleteUser, login, logout, me, register } from '../controllers';
import { authMiddleware } from '../../../middlewares/auth';

const router: Router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', authMiddleware, asyncHandler(logout));
router.get('/me', authMiddleware, asyncHandler(me));
router.delete('/', authMiddleware, asyncHandler(deleteUser));
export default router;