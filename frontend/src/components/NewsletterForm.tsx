'use client';
import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            // If you have a real Brevo API route, call it here.
            // For now, we simulate success for the UI demo.
            // await fetch('/api/newsletter/subscribe', { ... }) 

            await new Promise(r => setTimeout(r, 1000)); // Simulate delay

            setStatus('success');
            setMessage('Thanks for subscribing! Check your email to confirm.');
            setEmail('');
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden text-center">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl text-white mb-6 backdrop-blur-sm">
                    <Mail className="w-8 h-8" />
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">Market Insights in your Inbox</h3>
                <p className="text-slate-400 mb-8 text-lg">
                    Join 10,000+ investors getting weekly financial tips, tool updates, and market trends. No spam, unsubscribe anytime.
                </p>

                {status === 'success' ? (
                    <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-xl p-4 flex items-center justify-center text-emerald-400 gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">{message}</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            required
                            placeholder="Enter your email address"
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading'}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {status === 'loading' ? 'Joining...' : 'Subscribe Free'}
                        </button>
                    </form>
                )}

                {status === 'error' && (
                    <div className="mt-4 text-rose-400 flex items-center justify-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}

                <p className="mt-6 text-xs text-slate-500">
                    By subscribing, you agree to our <a href="/privacy" className="underline hover:text-slate-300">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
