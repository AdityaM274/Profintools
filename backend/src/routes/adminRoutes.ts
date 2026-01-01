import { Router } from 'express';
import { getDashboardStats, getUsers, getSubscribers, updateUser, deleteUser, getSettings, updateSettings } from '../controllers/adminController.js';
import { authenticateUser } from '../middlewares/auth.js';

const router = Router();

// In a real app, you'd add an 'isAdmin' middleware here
router.get('/stats', authenticateUser, getDashboardStats);

// User Management
router.get('/users', authenticateUser, getUsers);
router.put('/users/:id', authenticateUser, updateUser);
router.delete('/users/:id', authenticateUser, deleteUser);

// Newsletter
router.get('/subscribers', authenticateUser, getSubscribers);

// Global Settings
router.get('/settings', authenticateUser, getSettings);
router.put('/settings', authenticateUser, updateSettings);

export default router;
