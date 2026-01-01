import React from 'react';
import { Calculator, Shield, Target, Users } from 'lucide-react';

export default function About() {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Financial Accuracy for <span className="text-primary italic">Everyone.</span></h1>
                <p className="text-secondary text-xl leading-relaxed">
                    FinCalcHub was born out of a simple need: a clean, fast, and completely private place to perform financial calculations without the clutter of ads and trackers.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                <div className="glass-card p-10">
                    <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mb-8">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
                    <p className="text-secondary leading-relaxed">
                        We believe your financial data is yours alone. That's why nearly all our calculations happen 100% in your browser. We don't store your sensitive inputs on our servers unless you explicitly choose to save them to your account.
                    </p>
                </div>

                <div className="glass-card p-10">
                    <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center text-accent mb-8">
                        <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Unmatched Precision</h3>
                    <p className="text-secondary leading-relaxed">
                        Every formula in our 100+ calculators is double-verified against industry standards. Whether it's a simple loan EMI or a complex tax calculation, you can trust our results.
                    </p>
                </div>
            </div>

            <section className="bg-card border-2 border-border rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-extrabold mb-6">Our Mission</h2>
                        <p className="text-secondary text-lg leading-relaxed mb-8">
                            To empower millions of people to make better financial decisions by providing accessible, verified, and free financial tools that work on any device.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-3xl font-black text-primary mb-1">100+</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-secondary">Calculators</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-primary mb-1">1M+</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-secondary">Monthly Users</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-primary mb-1">100%</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-secondary">Private</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="glass-card p-8 rotate-3 hover:rotate-0 transition-transform cursor-default">
                            <div className="flex items-center gap-4 mb-6">
                                <Users className="w-6 h-6 text-primary" />
                                <span className="font-bold text-lg">Community Driven</span>
                            </div>
                            <p className="text-secondary italic">"Finally, a financial tool that doesn't feel like it's trying to sell me something. Clean interface and accurate results."</p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-border"></div>
                                <span className="text-sm font-bold">Sarah J., Entrepreneur</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            </section>
        </div>
    );
}
