'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
    User, CreditCard, History, Settings,
    TrendingUp, ShieldCheck, ExternalLink, LogOut
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function Dashboard() {
    const { user, loading, isPremium } = useAuth();
    const router = useRouter();
    const [recentHistory, setRecentHistory] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Load some dummy history for display
        const history: any[] = [];
        // In real app, fetch from backend if premium or localStorage
        setRecentHistory(history);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}</h1>
                    <p className="text-secondary">Manage your account and premium features.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar / Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">{user.email}</h2>
                                <div className="flex items-center gap-1.5">
                                    {isPremium ? (
                                        <span className="flex items-center gap-1 text-xs font-bold text-accent">
                                            <ShieldCheck className="w-3 h-3" /> Premium Member
                                        </span>
                                    ) : (
                                        <span className="text-xs text-secondary">Free Plan</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button className="w-full text-left p-3 rounded-lg bg-input/50 flex items-center justify-between group hover:bg-input transition-colors">
                                <div className="flex items-center gap-3">
                                    <Settings className="w-4 h-4 text-secondary" />
                                    <span className="text-sm font-bold">Account Settings</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-border group-hover:text-primary transition-colors" />
                            </button>
                            <button className="w-full text-left p-3 rounded-lg hover:bg-input transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-4 h-4 text-secondary" />
                                    <span className="text-sm font-bold">Billing & Invoices</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-border group-hover:text-primary transition-colors" />
                            </button>
                        </div>
                    </div>

                    {!isPremium && (
                        <div className="glass-card p-6 bg-accent/5 border-accent/20">
                            <h3 className="font-bold text-accent mb-2">Upgrade to Premium</h3>
                            <p className="text-sm text-secondary mb-4">Get ad-free experience and unlimited tool saves for life.</p>
                            <Link href="/premium" className="btn-primary w-full inline-block text-center text-sm py-2 bg-accent shadow-accent/20">
                                Upgrade Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-6 border-l-4 border-l-primary">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">+12% this week</span>
                            </div>
                            <p className="text-secondary text-sm font-medium">Calculations Performed</p>
                            <p className="text-3xl font-black">42</p>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-l-accent">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                    <History className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-secondary text-sm font-medium">Saved Results</p>
                            <p className="text-3xl font-black">8 / 10</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="glass-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Recent Calculations</h3>
                            <button className="text-primary text-sm font-bold hover:underline">View All</button>
                        </div>

                        {recentHistory.length > 0 ? (
                            <div className="space-y-4">
                                {/* Map over activity */}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
                                <History className="w-10 h-10 text-border mx-auto mb-4" />
                                <p className="text-secondary text-sm">No recent activity to show.</p>
                                <Link href="/" className="text-primary text-sm font-bold hover:underline mt-2 inline-block">Explore Tools</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple Helper for Chevron
const ChevronRight = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
