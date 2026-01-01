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
                <div className="hidden md:flex flex-1 mx-10 items-center justify-center max-w-2xl relative">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-secondary" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find a calculator..."
                            className="w-full bg-input/50 border-0 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">IN INR</span>

                    {!user ? (
                        <Link href="/login" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-500/30">
                            Sign In
                        </Link>
                    ) : (
                        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
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
