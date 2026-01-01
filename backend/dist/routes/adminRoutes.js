import { Router } from 'express';
import { getDashboardStats, getUsers } from '../controllers/adminController.js';
import { authenticateUser } from '../middlewares/auth.js';
const router = Router();
// In a real app, you'd add an 'isAdmin' middleware here
router.get('/stats', authenticateUser, getDashboardStats);
router.get('/users', authenticateUser, getUsers);
export default router;
