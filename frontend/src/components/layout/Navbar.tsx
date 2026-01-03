'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Calculator, ShieldCheck, User, Search, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
    const { user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4',
                isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border' : 'bg-transparent'
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                        <TrendingUp className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        ProFin<span className="text-primary">Tools</span>
                    </span>
                </Link>

                {/* Desktop Menu - Centered Search & Categories */}
                <div className="hidden md:flex flex-1 mx-10 items-center justify-center max-w-xl relative">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search 100+ tools..."
                            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-inner"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    const val = e.currentTarget.value;
                                    if (val) {
                                        window.location.href = `/?search=${encodeURIComponent(val)}#tools`;
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {/* Currency Toggle (Mock) */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700">
                        <span className="bg-white dark:bg-slate-600 shadow-sm text-xs font-bold px-3 py-1 rounded-full text-slate-800 dark:text-white">INR</span>
                        <span className="text-xs font-semibold px-3 text-slate-400">USD</span>
                    </div>

                    {!user ? (
                        <>
                            <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-semibold text-sm px-3 transition-colors">
                                Sign In
                            </Link>
                            <Link href="/pricing" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Go Premium
                            </Link>
                        </>
                    ) : (
                        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold hover:text-indigo-600 transition-colors bg-slate-100 px-4 py-2 rounded-full">
                            <User className="w-4 h-4" /> My Account
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 hover:bg-input rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {
                isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 animate-fade-in shadow-xl">
                        <Link href="/tools" className="p-3 hover:bg-input rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Tools</Link>
                        <Link href="/premium" className="p-3 hover:bg-input rounded-lg transition-colors flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <ShieldCheck className="w-4 h-4 text-accent" />
                            Premium
                        </Link>
                        <Link href="/login" className="btn-primary text-center" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
