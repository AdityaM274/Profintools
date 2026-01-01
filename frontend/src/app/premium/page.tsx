'use client';

import React from 'react';
import { Check, ShieldCheck, Zap, Bell, History, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

import { useAuth } from '@/hooks/useAuth';

export default function Premium() {
    const { user } = useAuth();
    const benefits = [
        { icon: EyeOff, title: 'No Ads', description: 'Remove all banners, interstitials, and display ads from the entire site.' },
        { icon: History, title: 'Unlimited History', description: 'Save all your calculations locally or to your account with no limits.' },
        { icon: Zap, title: 'Priority Access', description: 'Be the first to use new tools and experimental features.' },
        { icon: Bell, title: 'Smart Alerts', description: 'Get notified of tax changes, interest rate updates, and more.' }
    ];

    const handleCheckout = async () => {
        try {
            const token = await user?.getIdToken();
            if (!token) {
                window.location.href = '/login?redirect=/premium';
                return;
            }

            // 1. Create Order
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const orderData = await res.json();

            if (!orderData.id) throw new Error("Order creation failed");

            // 2. Open Razorpay
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "FinCalc Pro",
                description: "Premium Lifetime Subscription",
                order_id: orderData.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payments/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    if (verifyRes.ok) {
                        alert("Upgrade successful! Refreshing...");
                        window.location.href = '/dashboard';
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    email: user?.email,
                    contact: "" // Optional
                },
                theme: {
                    color: "#0284c7"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (e) {
            console.error("Checkout failed", e);
            alert("Checkout initialization failed.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 animate-fade-in">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            {/* ... header and grid ... */}
            <div className="text-center max-w-3xl mx-auto mb-20">
                <div className="flex justify-center mb-6">
                    <div className="bg-accent/10 p-4 rounded-3xl text-accent">
                        <ShieldCheck className="w-12 h-12" />
                    </div>
                </div>
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight">FinCalcHub <span className="text-primary">Premium</span></h1>
                <p className="text-secondary text-xl">The ultimate toolkit for serious financial planning. One small fee, lifetime of clarity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {benefits.map((b) => (
                    <div key={b.title} className="glass-card p-8">
                        <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary mb-6">
                            <b.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-3">{b.title}</h3>
                        <p className="text-secondary text-sm leading-relaxed">{b.description}</p>
                    </div>
                ))}
            </div>

            <div className="max-w-md mx-auto relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 group-hover:bg-primary/30 transition-all"></div>
                <div className="glass-card p-10 border-primary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl font-bold text-xs uppercase">Best Value</div>
                    <h2 className="text-2xl font-black mb-2">Lifetime Access</h2>
                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-5xl font-black text-primary">₹1</span>
                        <span className="text-secondary font-bold">one-time</span>
                    </div>
                    <ul className="space-y-4 mb-10">
                        {['All current 100+ tools', 'Lifetime updates', 'No monthly subscriptions', 'Cloud backup (coming soon)'].map((l) => (
                            <li key={l} className="flex gap-3 text-sm font-medium">
                                <Check className="w-5 h-5 text-green-500" /> {l}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleCheckout} className="btn-primary w-full py-4 text-center text-lg shadow-xl shadow-blue-500/40">
                        Get Started Now
                    </button>
                    <p className="text-center text-xs text-secondary mt-6">30-day money-back guarantee. Secure payment via Razorpay.</p>
                </div>
            </div>
        </div>
    );
}
