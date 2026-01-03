import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

// GET all ads
export async function GET(request: Request) {
    const supabase = createClient();
    const { data, error } = await supabase.from('ad_campaigns').select('*').order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// POST (Create) new ad
export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    const { data, error } = await supabase
        .from('ad_campaigns')
        .insert({
            name: body.name,
            image_url: body.imageUrl,
            link_url: body.linkUrl,
            slot: body.slot || 'sidebar',
            is_active: body.isActive ?? true
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

// DELETE ad
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const supabase = createClient();
    const { error } = await supabase.from('ad_campaigns').delete().eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
