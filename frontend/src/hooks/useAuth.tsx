'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isPremium: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isPremium: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user as User | null);
            if (user) {
                const premiumStatus = localStorage.getItem('isPremium') === 'true';
                setIsPremium(premiumStatus);
            } else {
                setIsPremium(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isPremium }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
