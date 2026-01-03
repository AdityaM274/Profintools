import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

    if (error) {
        // If no settings found, return defaults
        return NextResponse.json({
            maintenanceMode: false,
            adsEnabled: true,
            disabledTools: [],
            adSlots: {}
        });
    }

    return NextResponse.json(data);
}

export async function PUT(request: Request) {
    const supabase = createClient();
    const body = await request.json();

    // Ideally verify admin here

    // We assume ID 1 is the singleton settings row, or we select the first one
    // Since we don't know the ID, we might need to upsert.
    // Assuming there's only one row.

    // Check if row exists
    const { data: existing } = await supabase.from('settings').select('id').single();

    let result;
    if (existing) {
        result = await supabase.from('settings').update({
            maintenance_mode: body.maintenanceMode,
            ads_enabled: body.adsEnabled,
            google_publisher_id: body.googlePublisherId,
            ad_slots: body.adSlots,
            affiliate_ads: body.affiliateAds,
            disabled_tools: body.disabledTools
        }).eq('id', existing.id);
    } else {
        result = await supabase.from('settings').insert({
            maintenance_mode: body.maintenanceMode,
            ads_enabled: body.adsEnabled,
            google_publisher_id: body.googlePublisherId,
            ad_slots: body.adSlots,
            affiliate_ads: body.affiliateAds,
            disabled_tools: body.disabledTools
        });
    }

    if (result.error) {
        return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
