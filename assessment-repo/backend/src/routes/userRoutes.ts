import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middleware/auth';
import { validateUser, validateLogin } from '../middleware/validation';

const router = Router();
const userController = new UserController();

router.post('/register', validateUser, userController.register);
router.post('/login', validateLogin, userController.login);

router.get('/profile', authenticate, userController.getProfile);
router.put(
  '/profile',
  authenticate,
  validateUser,
  userController.updateProfile
);

export default router;
