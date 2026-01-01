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
                // In a real scenario we might cache this or use SWR/React Query
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/settings`);
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
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
