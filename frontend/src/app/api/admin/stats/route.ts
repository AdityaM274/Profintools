import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();

    // In a real app, verify admin session here

    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: subscriberCount } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
    const { count: activeToolCount } = await supabase.from('settings').select('*'); // Mock logic for tool count if complex

    // Revenue is harder without a payments table, returning mock
    const revenue = 12500;

    return NextResponse.json({
        totalUsers: userCount || 0,
        totalSubscribers: subscriberCount || 0,
        revenue,
        activeTools: 50 // Fixed or fetched from config
    });
}
