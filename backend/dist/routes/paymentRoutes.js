import { Router } from 'express';
import { createCheckoutSession, verifyPayment } from '../controllers/paymentController.js';
import { authenticateUser } from '../middlewares/auth.js';
const router = Router();
router.post('/create-checkout-session', authenticateUser, createCheckoutSession);
router.post('/verify-payment', authenticateUser, verifyPayment);
export default router;
