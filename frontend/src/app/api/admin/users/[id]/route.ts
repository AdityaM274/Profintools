import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    const supabase = createClient();

    const { error } = await supabase
        .from('profiles')
        .update({ is_premium: body.isPremium })
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = createClient();

    // Note: Deleting from 'profiles' might fail if cascading from auth.users is required,
    // and we can't delete from auth.users without service role.
    // We'll try deleting profile.
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
