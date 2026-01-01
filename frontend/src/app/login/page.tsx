'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Calculator, Mail, Lock, Chrome, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-20 animate-fade-in">
            <div className="text-center mb-10">
                <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                    <Calculator className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
                <p className="text-secondary mt-2">Sign in to your premium account</p>
            </div>

            <div className="glass-card p-8 shadow-2xl">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" /> Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-secondary flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" /> Password
                            </label>
                            <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-4 text-secondary font-bold">Or continue with</span></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-input hover:bg-border transition-colors border border-border rounded-lg py-3 flex items-center justify-center gap-2 font-bold text-sm"
                >
                    <Chrome className="w-4 h-4" /> Google Account
                </button>

                <p className="text-center text-sm text-secondary mt-8">
                    Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Create one for free</Link>
                </p>
            </div>
        </div>
    );
}
