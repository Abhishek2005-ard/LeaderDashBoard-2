import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import { validateRegister, validateLogin } from '../middlewares/validationMiddleware';

const router = Router();

/**
 * Public Authentication Routes
 */
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

/**
 * Protected Authentication Routes
 */
router.get('/me', protect, getMe as any);

export default router;
