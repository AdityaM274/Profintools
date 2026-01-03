'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, TrendingUp, Calculator, FileText, Activity, PiggyBank, Zap, Smartphone, WifiOff, DollarSign, CheckCircle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS, CATEGORIES } from '@/constants/tools';
import { AD_SLOTS } from '@/config/ads';
import AdUnit from '@/components/AdUnit';
import { useSettings } from '@/hooks/useSettings';
import NewsletterForm from '@/components/NewsletterForm';

const IconMap: { [key: string]: any } = {
    Calculator,
    TrendingUp,
    FileText,
    Activity,
    PiggyBank,
    DollarSign
};

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { settings, loading } = useSettings();

    const filteredTools = TOOLS.filter(tool => {
        // Hide disabled tools
        if (settings.maintenanceMode) return false;
        if (settings.disabledTools?.includes(tool.id)) return false;

        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const popularTags = ['Income Tax', 'SIP', 'Home Loan', 'Retirement', 'FIRE', 'FD Returns'];

    return (
        <div className="bg-slate-50 min-h-screen">

            {/* Hero Section */}
            <div className="relative bg-slate-900 overflow-hidden">
                {/* LEADERBOARD AD - Responsive */}
                <div className="container mx-auto px-4 pt-4 pb-2">
                    <AdUnit slot={AD_SLOTS.HOME_HEADER} className="w-full max-w-4xl mx-auto" />
                </div>

                {/* Background Gradients */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 pt-8 pb-20 text-center">
                    {/* ... Hero Content ... */}
                    {/* Hero Content */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                        Updated for 2026 Financial Year
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
                        Smart Money starts <br /> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">Smart Math.</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
                        100+ Free Tools for Loans, Investments, Taxes & More. No signup required for basic use.
                    </p>

                    {/* 3 Prominent CTAs */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-fade-in-up delay-300">
                        <button onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center transform hover:scale-105 active:scale-95 duration-200">
                            Explore Tools <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <Link href="/pricing" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center justify-center whitespace-nowrap transform hover:scale-105 active:scale-95 duration-200">
                            Go Premium
                        </Link>
                        <button onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-bold transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center whitespace-nowrap transform hover:scale-105 active:scale-95 duration-200">
                            Get Tips
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-6 text-slate-400 text-sm font-medium mb-12 animate-fade-in-up delay-400">
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700"><ShieldCheck className="w-5 h-5 text-emerald-400" /> Secure</div>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700"><WifiOff className="w-5 h-5 text-indigo-400" /> Private</div>
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700"><Smartphone className="w-5 h-5 text-blue-400" /> Mobile-Friendly</div>
                    </div>

                    {/* Trending Tags */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-400 font-medium animate-fade-in-up delay-500">
                        <span className="opacity-60">Trending:</span>
                        {popularTags.map(term => (
                            <button key={term} onClick={() => setSearchQuery(term)} className="hover:text-white underline decoration-slate-600 hover:decoration-emerald-400 underline-offset-4 transition-all">
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div id="tools" className="max-w-7xl mx-auto px-4 py-12 relative z-10 flex flex-col lg:flex-row gap-8">

                {/* Main Content Column */}
                <div className="flex-1">
                    {/* Categories Tabs */}
                    <div className="sticky top-20 z-30 bg-slate-50/95 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-200/50 mb-8">
                        <div className="flex justify-start lg:justify-center overflow-x-auto no-scrollbar gap-2 pb-2">
                            {['All', ...CATEGORIES].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${activeCategory === cat
                                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/30'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* In-Feed Ad Placeholder 1 */}
                    <div className="mb-8 block md:hidden">
                        <AdUnit slot={AD_SLOTS.HOME_IN_FEED} className="w-full" />
                    </div>

                    {/* Search Bar - Client Side Filter */}
                    <div className="mb-12 relative z-20">
                        <div className="relative max-w-lg mx-auto md:mx-0">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Filter tools by name..."
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Featured / Popular Section (Only show if no search) */}
                    {!searchQuery && activeCategory === 'All' && (
                        <div className="mb-16 animate-fade-in-up">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-emerald-500" />
                                Featured & Popular
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {TOOLS.filter(t => ['sip-calculator', 'income-tax-calculator', 'home-loan-emi-calculator', 'ppf-calculator'].includes(t.id)).map((tool) => (
                                    <Link key={tool.id} href={`/tools/${tool.slug}`} className="group relative block">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10"></div>
                                        <div className="bg-white border border-slate-100 rounded-2xl p-8 h-full shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:scale-[1.02]">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                                                    {IconMap[tool.icon] ? React.createElement(IconMap[tool.icon], { className: "w-8 h-8" }) : <Calculator className="w-8 h-8" />}
                                                </div>
                                                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-xl mb-3">{tool.name}</h3>
                                            <p className="text-slate-500 mb-6 line-clamp-2">{tool.description}</p>
                                            <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
                                                Use Tool <ArrowRight className="w-5 h-5 ml-2" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tools Grid Mixed with Ads */}
                    <div className="mb-20">
                        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
                            <Calculator className="w-6 h-6 text-indigo-600" />
                            All Calculators
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[500px]">
                            {filteredTools.map((tool, index) => {
                                const Icon = IconMap[tool.icon] || Calculator;
                                // Determine category style
                                let iconBg = 'bg-indigo-50 text-indigo-600';
                                if (tool.category.includes('Investment') || tool.category.includes('SIP')) iconBg = 'bg-emerald-50 text-emerald-600';
                                if (tool.category.includes('Loan') || tool.category.includes('EMI')) iconBg = 'bg-blue-50 text-blue-600';
                                if (tool.category.includes('Tax')) iconBg = 'bg-rose-50 text-rose-600';

                                // Inject Ad every 6 items (responsive grid friendly)
                                if (index > 0 && index % 6 === 0) {
                                    return (
                                        <div key={`ad-${index}`} className="col-span-1 sm:col-span-2 lg:col-span-3">
                                            <AdUnit slot={AD_SLOTS.HOME_IN_FEED} className="w-full" />
                                        </div>
                                    );
                                }

                                return (
                                    <Link
                                        key={tool.id}
                                        href={`/tools/${tool.slug}`}
                                        className="group relative block h-full"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10 transform group-hover:scale-105"></div>
                                        <div className="bg-white border border-slate-100 rounded-2xl p-6 h-full flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-2.5 rounded-xl transition-colors ${iconBg}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Free</span>
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-indigo-600 transition-colors">{tool.name}</h3>
                                            <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed line-clamp-2">{tool.description}</p>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">{tool.category}</span>
                                                <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                    Try <ArrowRight className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-sm">Showing {filteredTools.length} tools</p>
                        </div>
                    </div>

                    {/* Why Use Section */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-3xl p-8 md:p-12 mb-12">
                        {/* ... content same as before ... */}
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-2xl text-accent mb-6">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Why use ProFinTools?</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
                                We provide precise financial calculators that run 100% in your browser. Unlike other sites, we don't store your financial data, salary information, or investment details on our servers. Your privacy is our priority.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <CheckIcon className="text-green-500 mb-4 w-8 h-8" />
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Instant Results</h4>
                                    <p className="text-sm text-slate-500">Zero loading time. Calculations happen instantly on your device.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <Smartphone className="text-blue-500 mb-4 w-8 h-8" />
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Mobile Friendly</h4>
                                    <p className="text-sm text-slate-500">Optimized for phones and tablets with a responsive design.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <WifiOff className="text-purple-500 mb-4 w-8 h-8" />
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">Offline Capable</h4>
                                    <p className="text-sm text-slate-500">Works even without an internet connection once loaded.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-12">
                        <NewsletterForm />
                    </div>

                    <div className="mb-12">
                        <AdUnit slot={AD_SLOTS.HOME_FOOTER} className="w-full" />
                    </div>
                </div>

                {/* SIDEBAR - Desktop Only */}
                <aside className="hidden lg:block w-80 flex-shrink-0 space-y-8">
                    <div className="sticky top-24">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
                            <h4 className="font-bold text-slate-800 mb-4">Recommended</h4>
                            <AdUnit slot={AD_SLOTS.HOME_SIDEBAR} format="vertical" className="w-full" />
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);
