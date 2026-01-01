'use client';

import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
            <div className="bg-primary/10 p-6 rounded-3xl mb-8">
                <FileQuestion className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4">Page Not Found</h1>
            <p className="text-secondary max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="btn-primary flex items-center gap-2">
                    <Home className="w-4 h-4" /> Go Home
                </Link>
                <Link href="/tools" className="px-6 py-2.5 rounded-lg border border-border hover:bg-input transition-colors font-bold flex items-center gap-2">
                    <Search className="w-4 h-4" /> Browse Tools
                </Link>
            </div>
        </div>
    );
}
