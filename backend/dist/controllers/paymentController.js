import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("Razorpay Initialized");
}
else {
    console.warn("Razorpay Keys Missing");
}
export const createCheckoutSession = async (req, res) => {
    const { firebaseUid } = req.user;
    if (!razorpay)
        return res.status(500).json({ message: 'Payment gateway not initialized' });
    try {
        const options = {
            amount: 100 * 100, // ₹100 in paise (Razorpay takes amount in smallest currency unit)
            currency: "INR",
            receipt: `receipt_${Date.now()}_${firebaseUid.substring(0, 5)}`,
            payment_capture: 1 // Auto capture
        };
        const order = await razorpay.orders.create(options);
        res.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    }
    catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ message: error.message });
    }
};
export const handleWebhook = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    // Validate signature
    const shasum = crypto.createHmac('sha256', secret || '');
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    if (digest === req.headers['x-razorpay-signature']) {
        // Event is valid
        const event = req.body.event;
        if (event === 'payment.captured' || event === 'order.paid') {
            // In a real app, you would verify the order ID and update the user
            // For this demo, we assume the frontend handles the success confirmation or we trust the webhook
            // To link it to a user, we'd need to have stored the order_id -> user mapping or pass metadata
            console.log("Payment successful via webhook");
        }
        res.json({ status: 'ok' });
    }
    else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { firebaseUid } = req.user;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    if (expectedSignature === razorpay_signature) {
        // Payment is authentic
        await User.findOneAndUpdate({ firebaseUid }, { isPremium: true, premiumExpiresAt: null } // Lifetime
        );
        res.json({ success: true, message: "Payment verified, premium activated" });
    }
    else {
        res.status(400).json({ success: false, message: "Invalid signature" });
    }
};
