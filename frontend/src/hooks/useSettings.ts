import { useState, useEffect } from 'react';

export const useSettings = () => {
    const [settings, setSettings] = useState<any>({
        maintenanceMode: false,
        adsEnabled: true,
        disabledTools: [],
        adSlots: {},
        googlePublisherId: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch from Supabase
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();

                const { data, error } = await supabase
                    .from('settings')
                    .select('*')
                    .single();

                if (data && !error) {
                    setSettings({
                        maintenanceMode: data.maintenance_mode,
                        adsEnabled: data.ads_enabled,
                        googlePublisherId: data.google_publisher_id,
                        adSlots: data.ad_slots || {},
                        affiliateAds: data.affiliate_ads || [],
                        disabledTools: data.disabled_tools || []
                    });
                } else if (error) {
                    // console.error("Supabase Settings Error:", error);
                    // Use default if table is empty or error
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
};
