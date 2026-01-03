import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

// GET all content blocks
export async function GET(request: Request) {
    const supabase = createClient();
    const { data, error } = await supabase.from('cms_content').select('*');

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Transform array to object for easier frontend consumption { key: value }
    const contentMap = (data || []).reduce((acc: any, item: any) => {
        acc[item.key] = item.value;
        return acc;
    }, {});

    return NextResponse.json(contentMap);
}

// POST (Upsert) content block
export async function POST(request: Request) {
    const supabase = createClient();
    const body = await request.json(); // Expect { key, value, section }

    // Validate
    if (!body.key) return NextResponse.json({ error: 'Key is required' }, { status: 400 });

    const { data, error } = await supabase
        .from('cms_content')
        .upsert({
            key: body.key,
            value: body.value,
            section: body.section,
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}
