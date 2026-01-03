import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

// GET all tool configs
export async function GET(request: Request) {
    const supabase = createClient();
    const { data, error } = await supabase.from('tool_configs').select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Convert to map for easy lookup
    const configMap = (data || []).reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
    }, {});

    return NextResponse.json(configMap);
}

// POST (Upsert) tool config
export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    if (!body.id) return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });

    const { data, error } = await supabase
        .from('tool_configs')
        .upsert({
            id: body.id,
            is_active: body.isActive,
            custom_title: body.customTitle,
            custom_description: body.customDescription, // Fixed typo
            seo_keywords: body.seoKeywords,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
