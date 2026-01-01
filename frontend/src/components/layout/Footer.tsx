'use client';

import React from 'react';
import Link from 'next/link';
import { Calculator, Mail, Facebook, Twitter, Instagram, Linkedin, Send, TrendingUp } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState<'' | 'loading' | 'success' | 'error'>('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <footer className="bg-[var(--hero-bg)] text-white pt-16 pb-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand and Description */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="bg-primary-500 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">ProFin<span className="text-primary-400">Tools</span></span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            ProFinTools provides professional-grade financial tools completely free. We prioritize your privacy by processing all data directly in your browser. No servers, no tracking, just math.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <Link key={i} href="#" className="p-2 bg-slate-800 hover:bg-primary hover:text-white rounded-lg transition-all text-slate-400">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-primary-400">Tools</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/tools" className="hover:text-primary-400 transition-colors">All Calculators</Link></li>
                            <li><Link href="/tools/loan-emi-calculator" className="hover:text-primary-400 transition-colors">EMI Calculator</Link></li>
                            <li><Link href="/tools/sip-calculator" className="hover:text-primary-400 transition-colors">SIP Planner</Link></li>
                            <li><Link href="/tools/income-tax-calculator" className="hover:text-primary-400 transition-colors">Income Tax</Link></li>
                        </ul>
                    </div>

                    {/* Business Links */}
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-primary-400">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Use</Link></li>
                            <li><Link href="/premium" className="inline-block mt-2 px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full hover:bg-primary-500 hover:text-white transition-all">Remove Ads</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-1 md:col-span-1 relative">
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-400">Stay Updated</h4>
                        <p className="text-sm text-slate-400 mb-6">Get the latest financial tools delivered.</p>

                        {status === 'success' ? (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Subscribed!
                            </div>
                        ) : (
                            <form className="relative" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="absolute right-1 top-1 bottom-1 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-bold"
                                >
                                    {status === 'loading' ? '...' : 'Subscribe'}
                                </button>
                            </form>
                        )}

                    </div>
                </div>

                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} ProFinTools. Designed for financial freedom.
                    </p>
                    <div className="flex gap-6 text-xs text-slate-500">
                        <Link href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
                        <Link href="/robots.txt" className="hover:text-white transition-colors">Robots</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
