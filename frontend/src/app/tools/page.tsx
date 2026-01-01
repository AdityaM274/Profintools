'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, ChevronRight, Calculator, TrendingUp, FileText, Activity, PiggyBank, Briefcase, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS, CATEGORIES } from '@/constants/tools';

const IconMap: { [key: string]: any } = {
    Calculator,
    TrendingUp,
    FileText,
    Activity,
    PiggyBank,
    Briefcase
};

function ToolsListContent() {
    const searchParams = useSearchParams();
    const categoryQuery = searchParams.get('category');

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(categoryQuery || 'All');

    useEffect(() => {
        if (categoryQuery) {
            setActiveCategory(categoryQuery);
        }
    }, [categoryQuery]);

    const filteredTools = TOOLS.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Explore All Tools</h1>
                    <p className="text-secondary">Precision calculators for every financial need.</p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tools..."
                        className="w-full bg-card border-2 border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar Categories */}
                <div className="lg:col-span-3">
                    <div className="sticky top-32 space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4 px-4">Categories</h3>
                        <button
                            onClick={() => setActiveCategory('All')}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                activeCategory === 'All' ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20" : "hover:bg-input text-secondary"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <LayoutGrid className="w-4 h-4" />
                                All Tools
                            </div>
                            <span className="text-[10px] bg-background/20 px-1.5 py-0.5 rounded-md">{TOOLS.length}</span>
                        </button>

                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                    activeCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-blue-500/20" : "hover:bg-input text-secondary"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {IconMap[cat === 'Business' ? 'Briefcase' : cat === 'Taxes' ? 'FileText' : cat === 'Investments' ? 'TrendingUp' : 'Calculator'] && React.createElement(IconMap[cat === 'Business' ? 'Briefcase' : cat === 'Taxes' ? 'FileText' : cat === 'Investments' ? 'TrendingUp' : 'Calculator'], { className: "w-4 h-4" })}
                                    {cat}
                                </div>
                                <span className="text-[10px] bg-background/20 px-1.5 py-0.5 rounded-md">
                                    {TOOLS.filter(t => t.category === cat).length}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-9">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredTools.map((tool) => {
                            const Icon = IconMap[tool.icon] || Calculator;
                            return (
                                <Link
                                    key={tool.id}
                                    href={`/tools/${tool.slug}`}
                                    className="glass-card p-6 group hover:scale-[1.02] transition-all hover:border-primary/50 relative overflow-hidden"
                                >
                                    <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">Free</div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{tool.name}</h3>
                                            <p className="text-secondary text-xs leading-relaxed mb-4">{tool.description}</p>
                                            <div className="flex items-center text-primary font-bold text-[10px] uppercase tracking-wider">
                                                Try Calculator <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {filteredTools.length === 0 && (
                        <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
                            <Search className="w-12 h-12 text-secondary mx-auto mb-4 opacity-20" />
                            <p className="text-secondary font-medium">No tools found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ToolsListing() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
            <ToolsListContent />
        </Suspense>
    );
}
