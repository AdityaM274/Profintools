import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.warn('Supabase keys missing. Using mock client.');

        const createMock = () => new Proxy(() => { }, {
            get: (_target, prop) => {
                if (prop === 'then') return undefined; // distinct from Promise
                if (prop === 'onAuthStateChange') return () => ({ data: { subscription: { unsubscribe: () => { } } } });
                if (prop === 'getSession') return () => Promise.resolve({ data: { session: null } });
                return createMock();
            },
            apply: () => createMock() // Allow calling as function
        });

        return createMock() as any;
    }

    return createBrowserClient(url, key);
};
