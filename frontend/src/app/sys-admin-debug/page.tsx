'use client';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function check() {
            const supabase = createClient();
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError) {
                setError(authError.message);
                return;
            }

            if (!user) {
                setData({ message: 'No User Logged In' });
                return;
            }

            // Fetch Profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setData({
                user_email: user.email,
                user_id: user.id,
                profile_data: profile,
                profile_error: profileError?.message || 'none',
                match_test: 'admin@test.com' === user.email,
                whitelist_match: ['admin@test.com', 'superadmin@gmail.com'].includes(user.email || ''),
                profile_role_Admin_check: profile?.role === 'admin'
            });
        }

        check();
    }, []);

    return (
        <div className="p-10 bg-white text-black font-mono">
            <h1 className="text-xl font-bold mb-4">Debug Info</h1>
            {error && <div className="text-red-500 mb-4">Auth Error: {error}</div>}
            <pre className="bg-gray-100 p-4 rounded border">
                {JSON.stringify(data, null, 2)}
            </pre>

            <div className="mt-8">
                <p className="font-bold">Instructions:</p>
                <ul className="list-disc ml-5 mt-2">
                    <li>1. Check if "user_email" matches your login.</li>
                    <li>2. Check if "profile_role_Admin_check" is true.</li>
                    <li>3. If "profile_data" is null, RLS might be blocking read access.</li>
                </ul>
            </div>
        </div>
    );
}
