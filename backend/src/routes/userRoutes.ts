import { Router } from 'express';
import { syncUser, getPremiumStatus } from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = Router();

router.post('/sync', authenticateUser, syncUser);
router.get('/premium-status', authenticateUser, getPremiumStatus);

export default router;
