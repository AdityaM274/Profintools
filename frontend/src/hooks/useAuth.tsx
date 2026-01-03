'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

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

    // Create client inside component or outside? 
    // Best practice:createClientComponentClient inside components for SSR safety, 
    // but here we use our singleton helper for client side only.
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                // Fetch premium status from profiles
                const { data } = await supabase
                    .from('profiles')
                    .select('is_premium')
                    .eq('id', session.user.id)
                    .single();

                setIsPremium(data?.is_premium || false);
            }
            setLoading(false);

            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
                setUser(session?.user ?? null);
                if (session?.user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('is_premium')
                        .eq('id', session.user.id)
                        .single();
                    setIsPremium(data?.is_premium || false);
                } else {
                    setIsPremium(false);
                }
                setLoading(false);
            });

            return () => subscription?.unsubscribe();
        };

        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, isPremium }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
