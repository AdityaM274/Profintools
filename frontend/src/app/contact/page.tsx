'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, MapPin, Phone } from 'lucide-react';

export default function Contact() {
    const [status, setStatus] = useState<'' | 'sending' | 'success' | 'error'>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulated API call
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto mb-20">
                <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Get in <span className="text-primary italic">Touch.</span></h1>
                <p className="text-secondary text-xl">Have a question or feedback? We'd love to hear from you.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Contact Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">Contact Details</h3>
                                <p className="text-xs text-secondary">Typically responds within 24h</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Mail className="w-5 h-5 text-secondary shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Email</p>
                                    <p className="font-medium">support@fincalchub.com</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Location</p>
                                    <p className="font-medium">San Francisco, CA</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Phone className="w-5 h-5 text-secondary shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Support Line</p>
                                    <p className="font-medium">+1 (555) 000-0000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-8">
                    <div className="glass-card p-10">
                        {status === 'success' ? (
                            <div className="text-center py-20">
                                <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                                <p className="text-secondary italic">We've received your request and will get back to you shortly.</p>
                                <button onClick={() => setStatus('')} className="mt-8 text-primary font-bold hover:underline">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-secondary">Full Name</label>
                                        <input type="text" required placeholder="John Doe" className="input-field" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-secondary">Email Address</label>
                                        <input type="email" required placeholder="john@example.com" className="input-field" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Subject</label>
                                    <input type="text" required placeholder="How can we help?" className="input-field" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-secondary">Message</label>
                                    <textarea required rows={6} placeholder="Tell us more about your inquiry..." className="input-field py-4 resize-none transition-all focus:h-48"></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
