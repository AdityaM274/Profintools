import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await req.json();

        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {

            // 2. Update User Profile in Supabase
            const supabaseAdmin = createAdminClient();

            // Assuming userId is passed from frontend, secure this by verifying session in production
            const { error } = await supabaseAdmin
                .from('profiles')
                .update({
                    is_premium: true,
                    premium_expires_at: null // Lifetime
                })
                .eq('id', userId);

            if (error) throw error;

            return NextResponse.json({ success: true, message: "Premium activated" });
        } else {
            return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
