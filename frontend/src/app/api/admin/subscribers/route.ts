import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();

    // Potentially RLS blocked if not admin, but trying anonymously/client key
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

    if (error) {
        // If RLS fails, return empty array to prevent crash
        console.error("Newsletter Fetch Error", error);
        return NextResponse.json([]);
    }

    return NextResponse.json(data);
}
